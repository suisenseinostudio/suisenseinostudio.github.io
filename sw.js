let db;

self.addEventListener("install",e=>{
  const req=indexedDB.open("db",1);
  req.onsuccess=event=>{
    db=event.target.result;
  };
  req.onupgradeneeded=event=>{
    try{
      db.createObjectStore("pass");
    }catch(err){
      console.error(err);
    }
  };
});

const importKey=async(pass)=>{
  const data=(new TextEncoder()).encode(pass);
  return window.crypto.subtle.importKey("raw",data,"PBKDF2",false,["deriveKey"]);
};

const deriveKey=async(pass)=>{
  const salt=window.crypto.getRandomValues(new Uint8Array(16));
  const algo={name:"PBKDF2",hash:"SHA-256",salt,iterations:100000};
  const base=await importKey(pass);
  return window.crypto.subtle.deriveKey(algo,base,{name:"AES-GCM",length:256},false,["encrypt"]);
};

self.addEventListener("message",e=>{
  db.transaction("keys","readwrite").objectStore("pass").add(e.data,e.data);
});

const decrypt=async req=>{
  const res=await (await fetch(req)).arrayBuffer();
  const iv=res.slice(0,8*12);
  const algo={name:"AES-GCM",iv};
  const data=res.slice(8*12,res.byteLength);
  db.transaction("pass").openCursor().onsucess=async e=>{
    const cursor=e.target.result;
    if(cursor){
      const key=await deriveKey(cursor.value);
      const result=await crypto.subtle.decrypt(algo,key,data);
      if((new TextDecoder()).decode(result.slice(0,8*12))==(new TextDecoder()).decode(iv)){
        return new Blob([result.slice(8*12,result.byteLength)]);
      }else{
        cursor.continue();
      }
    }else{
      return new Response(null,{status:401});
    }
  }
};

self.addEventListener("fetch",e=>{
  if(e.request.url.test(/\.[a-z]+-e$/){
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
}
