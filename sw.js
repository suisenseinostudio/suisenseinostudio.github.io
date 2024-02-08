let db;

self.addEventListener("install",e=>{
  const req=indexedDB.open("db",1);
  req.onsuccess=event=>{
    db=event.target.result;
  };
  req.onupgradeneeded=event=>{
    try{
      db.createObjectStore("keys",{autoIncrement:true});
    }catch(err){
      console.error(err);
    }
  };
});

self.addEventListener("message",e=>{
  db.transaction("keys","readwrite").objectStore("keys").add(e.data);
});

const decrypt=async req=>{
  const res=await (await fetch(req)).arrayBuffer();
  const iv=res.slice(0,8*12);
  const algo={name:"AES-GCM",iv};
  const data=res.slice(8*12,res.byteLength);
  db.transaction("keys").openCursor().onsucess=async e=>{
    const cursor=e.target.result;
    if(cursor){
      const key=cursor.value;
      const result=await crypto.subtle.decrypt(algo,key,data);
      if((new TextDecoder()).decode(result.slice(0,8*12))==(new TextDecoder()).decode(iv)){
        return new Blob([result.slice(8*12,result.byteLength)]);
      }else{
        cursor.continue();
      }
    }else{
      return new Response(null,{status:401});
    }
};

self.addEventListener("fetch",e=>{
  if(e.request.url.test(/\.[a-z]+-e$/){
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
