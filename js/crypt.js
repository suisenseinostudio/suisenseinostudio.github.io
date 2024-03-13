try{
  const a=navigator.serviceWorker.register("/sw.js",{scope:"/",type:"module"})
}catch(e){console.error(e)}
window.onload=()=>{
  var e=document.getElementById("login-form");
  e&&(e.onsubmit=e=>{
    e.preventDefault(),
    fetch(new Request("/sw-login",{method:"POST",body:document.getElementById("password").value})),
    location.href=new URLSearchParams(location.search).get("rd")||"/";
  }),
  document.querySelectorAll("[data-plain]").forEach(l=>{
    fetch(l.dataset.plain)
      .then(e=>(401==e.status&&(location.href=`/login.html?rd=${location.pathname}`),e.text()))
      .then(e=>{l.innerHTML=e})
  }),
  document.querySelectorAll("[data-src]").forEach(l=>{
    fetch(l.dataset.src)
      .then(e=>(401==e.status&&(location.href=`/login.html?rd=${location.pathname}`),e.text()))
      .then(e=>{
        l.innerHTML=e
          .replaceAll("-----","<div class='spacer'></div>")
          .replaceAll(/^\s*([^#<\s].*)$/gm,"<p>$1</p>")
          .replaceAll(/^##([^#].*\S.*)$/gm,"<h3>$1</h3>")
          .replaceAll(/^###([^#].*\S.*)$/gm,"<h4>$1</h4>")
          .replaceAll(/^####([^#].*\S.*)$/gm,"<h5>$1</h5>")
          .replaceAll(/\*\*(.*?\S.*?)\*\*/gm,"<span class='marker'>$1</span>")
          .replaceAll(/\+\[(.*?\S.*?)\]\((.*?\S.*?)\)/gm,"<a href='$2' class='normal-link' target='_blank' rel='noopener noreferrer'>$1</a>")
          .replaceAll(/\[(.*?\S.*?)\]\((.*?\S.*?)\)/gm,"<a href='$2' class='normal-link'>$1</a>")
})})};
