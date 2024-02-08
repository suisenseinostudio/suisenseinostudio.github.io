try{
  const rg=navigator.serviceWorker.register("sw.js");
}catch(err){
  console.error(err);
}

window.onload=()=>{
  document.querySelectorAll("[data-src]").forEach(elm=>{
    fetch(elm.dataset.src).then(res=>res.text()).then(txt=>{
      elm.innerHTML=txt;
    });
  });
};
