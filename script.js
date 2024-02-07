document.querySelectorAll("[data-src]").forEach(elm=>{
  fetch(elm.dataset.src).then(res=>res.text()).then(txt=>{
    elm.innerHTML=txt;
});
