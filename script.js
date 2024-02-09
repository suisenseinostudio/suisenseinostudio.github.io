try{
  const rg=navigator.serviceWorker.register("sw.js");
}catch(err){
  console.error(err);
}

window.onload=()=>{
  const login=document.getElementById("login-form");
  if(login){
    login.onsubmit=e=>{
      e.preventDefault();
      fetch(new Request("/sw-login",{
        method:"POST",
        body:document.getElementById("password").value
      }));
      location.href="/";
    };
  }
  document.querySelectorAll("[data-src]").forEach(elm=>{
    fetch(elm.dataset.src).then(res=>{
      if(res.status==401)location.href="/login";
      return res.text();
    }).then(txt=>{
      elm.innerHTML=txt;
    });
  });
};
