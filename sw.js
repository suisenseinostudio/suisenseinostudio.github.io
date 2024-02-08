let db,passes=[];

self.addEventListener("install",e=>{
  try{
    const req=indexedDB.open("db",2);
    req.onsuccess=event=>{
      db=event.target.result;
      db.onerror=errEvent=>{
        console.error("error in db");
        console.error(errEvent.target.errorCode);
      };
      db.transaction("pass").objectStore("pass").openCursor().onsuccess=e=>{
        const cursor=e.target.result;
        if(cursor){
          passes.push(cursor.value);
          cursor.continue();
        }
      };
    };
    req.onupgradeneeded=event=>{
      try{
        db=event.target.result;
        db.createObjectStore("pass");
      }catch(err){
        console.log(err);
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

const decrypt=async req=>{
  try{
    const res=await (await fetch(req)).arrayBuffer();
    const iv=res.slice(0,8*12);
    const algo={name:"AES-GCM",iv};
    const data=res.slice(8*12,res.byteLength);
    for(const pass of passes){
      console.log(`decrypting with "${pass}"...`);
      const key=await deriveKey(pass);
      const result=await crypto.subtle.decrypt(algo,key,data);
      if((new TextDecoder()).decode(result.slice(0,8*12))==(new TextDecoder()).decode(iv)){
        console.log("succeeded");
        return new Blob([result.slice(8*12,result.byteLength)]);
      }else{
        console.log("failed");
      }
    }
    console.log("no more pass");
    return new Response(null,{status:401});
  }catch(err){
    console.error("error in decrypt");
    console.error(err);
  }
};

self.addEventListener("fetch",async e=>{
  console.log(e.request.url);
  if(/sw-login$/.test(e.request.url)){
    const pass=await e.request.text();
    db.transaction("keys","readwrite").objectStore("pass").add(pass,pass);
    e.respondWith(new Response(null,{status:202}));
  }else if(/-e$/.test(e.request.url)){
    console.log("encrypted file");
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
});
