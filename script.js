try{
  const rg=navigator.serviceWorker.register("sw.js");
  if(rg.active){
    rg.active.postMessage("hello");
    document.querySelectorAll("[data-src]").forEach(elm=>{
      fetch(elm.dataset.src).then(res=>res.text()).then(txt=>{
        elm.innerHTML=txt;
      });
    });
  }
}catch(err){
  console.error(err);
}
