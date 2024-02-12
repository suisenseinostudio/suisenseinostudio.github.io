try{
  const rg=navigator.serviceWorker.register("sw.js",{type:"module"});
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
  document.querySelectorAll("[data-plain]").forEach(elm=>{
    fetch(elm.dataset.plain).then(res=>{
      if(res.status==401)location.href="/login";
      return res.text();
    }).then(txt=>{
      elm.innerHTML=txt;
    });
  });
  document.querySelectorAll("[data-src]").forEach(elm=>{
    fetch(elm.dataset.src).then(res=>{
      if(res.status==401)location.href="/login";
      return res.text();
    }).then(txt=>{
      elm.innerHTML=txt
        .replaceAll(/^##([^#].*)$/gm,"<h3>$1</h3>")
        .replaceAll(/^###([^#].*)$/gm,"<h4>$1</h4>")
        .replaceAll(/^([^#].*)$/gm,"<p>$1</p>");
    });
  });
};
