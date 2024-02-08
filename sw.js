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

const decrypt=req=>{
};

self.addEventListener("fetch",e=>{
  if(e.request.url.test(/\.[a-z]+-e$/){
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
