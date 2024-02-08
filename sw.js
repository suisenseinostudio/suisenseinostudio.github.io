let db;

self.addEventListener("install",e=>{
  try{
    const req=indexedDB.open("db",1);
    req.onsuccess=event=>{
      db=event.target.result;
      db.onerror=errEvent=>{
        console.error("error in db");
        console.error(errEvent.target.errorCode);
      };
    };
    req.onupgradeneeded=event=>{
      try{
        db.createObjectStore("pass");
      }catch(err){
        console.error(err);
      }
    };
  }catch(err){
    console.error("error in oninstall");
    console.error(err);
  }
});

const importKey=async(pass)=>{
  try{
    const data=(new TextEncoder()).encode(pass);
    return self.crypto.subtle.importKey("raw",data,"PBKDF2",false,["deriveKey"]);
  }catch(err){
    console.error("error in importKey");
    console.error(err);
  }
};

const deriveKey=async(pass)=>{
  try{
    const salt=self.crypto.getRandomValues(new Uint8Array(16));
    const algo={name:"PBKDF2",hash:"SHA-256",salt,iterations:100000};
    const base=await importKey(pass);
    return self.crypto.subtle.deriveKey(algo,base,{name:"AES-GCM",length:256},false,["encrypt"]);
  }catch(err){
    console.error("error in deriveKey");
    console.error(err);
  }
};
console.log("done");

self.addEventListener("message",e=>{
  db.transaction("keys","readwrite").objectStore("pass").add(e.data,e.data);
});

const decrypt=async req=>{
  try{
    const res=await (await fetch(req)).arrayBuffer();
    const iv=res.slice(0,8*12);
    const algo={name:"AES-GCM",iv};
    const data=res.slice(8*12,res.byteLength);
    db.transaction("pass").openCursor().onsuccess=async e=>{
      try{
        const cursor=e.target.result;
        if(cursor){
          console.log(`decrypting with "${cursor.value}"...`)
          const key=await deriveKey(cursor.value);
          const result=await crypto.subtle.decrypt(algo,key,data);
          if((new TextDecoder()).decode(result.slice(0,8*12))==(new TextDecoder()).decode(iv)){
            console.log("succeeded");
            return new Blob([result.slice(8*12,result.byteLength)]);
          }else{
            console.log("failed");
            cursor.continue();
          }
        }else{
          console.log("no more pass");
          return new Response(null,{status:401});
        }
      }catch(err){
        console.error("error in openCursor.onsuccess");
        console.error(err);
      }
    }
  }catch(err){
    console.error("error in decrypt");
    console.error(err);
  }
};

self.addEventListener("fetch",e=>{
  console.log(e.request.url);
  if(/-e$/.test(e.request.url)){
    console.log("encrypted file");
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
});
