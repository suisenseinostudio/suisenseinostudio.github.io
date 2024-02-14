import {dec} from "https://suisenseinostudio.github.io/deriveKey/ed.js";

let db;
const passes=[];

try{
  const req=indexedDB.open("db",2);
  req.onsuccess=event=>{
    db=event.target.result;
    db.onerror=errEvent=>{
      console.error(`error in db:${errEvent.target.errorCode}`);
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
  console.error(`error in oninstall:${err.name}:${err.message})`);
}

console.log("done");

const decrypt=async req=>{
  try{
    const res=await (await fetch(req)).blob();
    for(const pass of passes){
      console.log(`decrypting with "${pass}"...`);
      try{
        const result=await dec(res,pass);
        if(result){
          console.log("succeeded!");
          return new Response(result);
        }else{
          throw new Error("iv dosn't match");
        }
      }catch(err){
        if(err.message!="iv dosn't match")
          console.error(`error in crypto.subtle.decrypt:${err.name}:${err.message}`);
        console.log("failed");
      }
    }
    console.log("no more pass");
    return new Response(null,{status:401});
  }catch(err){
    console.error(`error in decrypt:${err.name}:${err.message}`);
  }
};

self.addEventListener("fetch",async e=>{
  console.log(e.request.url);
  if(/sw-login$/.test(e.request.url)){
    console.log("register pass");
    e.respondWith(new Response(null,{status:202}));
    const pass=await e.request.text();
    console.log(pass);
    passes.push(pass);
    db.transaction("pass","readwrite").objectStore("pass").add(pass,pass);
  }else if(/-e$/.test(e.request.url)){
    console.log("encrypted file");
    e.respondWith(decrypt(e.request));
  }else{
    e.respondWith(fetch(e.request));
  }
});
