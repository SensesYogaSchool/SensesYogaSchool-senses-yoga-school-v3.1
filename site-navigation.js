/* Senses Yoga School · unified accessible campus navigation */
(()=>{
  const header=document.querySelector("body > header, header");
  if(!header)return;
  const nav=header.querySelector(".nav");
  if(!nav)return;
  const root=location.pathname.split("/").filter(Boolean).length<=1?"":"../";
  const links=[["Discover","index.html"],["Schools","schools.html"],["Practice","practice.html"],["Library","library.html"],["Calendar","calendar.html"],["Support","support.html"]];
  const current=location.pathname.split("/").pop()||"index.html";
  nav.innerHTML=links.map(([label,href])=>'<a href="'+root+href+'"'+(current===href?' aria-current="page"':'')+'>'+label+'</a>').join("");
  nav.setAttribute("aria-label","Main school navigation");
  nav.id="site-main-navigation";
  let menu=header.querySelector(".menu");
  if(!menu){
    menu=document.createElement("button");
    menu.className="menu";
    header.querySelector(".navbar")?.insertBefore(menu,nav);
  }
  // Replace earlier page-specific menu handlers so the menu toggles exactly once.
  const fresh=menu.cloneNode(false);
  fresh.textContent="Menu";
  fresh.type="button";
  fresh.setAttribute("aria-expanded","false");
  fresh.setAttribute("aria-controls",nav.id);
  fresh.setAttribute("aria-label","Open navigation menu");
  menu.replaceWith(fresh);
  const setOpen=(open)=>{
    nav.classList.toggle("open",open);
    fresh.setAttribute("aria-expanded",String(open));
    fresh.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");
    document.body.classList.toggle("menu-open",open);
  };
  fresh.addEventListener("click",()=>setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click",e=>{if(e.target.closest("a"))setOpen(false);});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&nav.classList.contains("open")){
      setOpen(false);
      fresh.focus();
    }
  });
  document.addEventListener("click",e=>{
    if(nav.classList.contains("open")&&!header.contains(e.target))setOpen(false);
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change",e=>{
    if(e.matches)setOpen(false);
  });
})();
