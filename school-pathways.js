/* Shared School Pathway Navigation
   Enhances existing school pages; section links always point to real page anchors. */
(() => {
  const page = location.pathname.split("/").pop() || "";
  const configs = {
    "creative-arts.html": {
      current: "arts",
      sections: [
        ["nada-sound","Nāda · Sound & Listening"],
        ["moga-gatherings","MOGA Gatherings"],
        ["troubled-popcorn","Creative Media"],
        ["dream-master-contributions","Dream Master Contributions"],
        ["contribute","Contribute"]
      ]
    },
    "specialized-studies.html": {
      current: "studies",
      sections: [
        ["mandukya","Foundational Texts"],
        ["meditation-sleep-research","Sleep & Meditation Research"],
        ["dream-master","Dream Master"],
        ["symbols-and-meditation","Symbols & Meditation"],
        ["dream-research","Dream Cognition"],
        ["contribute","Contribute"]
      ]
    }
  };
  const config = configs[page];
  if (!config) return;
  const hero = document.querySelector("main .school-hero");
  if (!hero) return;

  if (page === "creative-arts.html") {
    const dreamSection = document.querySelector("main .dream-master-section");
    if (dreamSection && !dreamSection.id) dreamSection.id = "dream-master-contributions";
  }

  const schools = [
    ["wellness","Wellness","wellness.html"],
    ["ecology","Ecology","ecology.html"],
    ["nada","Nāda · MOGA","creative-arts.html#nada-sound"],
    ["studies","Specialized Studies","specialized-studies.html"],
    ["arts","Nāṭyaśāstra & Creative Arts","creative-arts.html"]
  ];
  const shell = document.createElement("nav");
  shell.className = "school-pathway-shell";
  shell.setAttribute("aria-label","School and page section pathways");
  shell.innerHTML = `
    <div class="school-pathway-inner">
      <div class="school-switcher" aria-label="Explore the schools">
        <span class="school-switcher-label">Explore our schools</span>
        ${schools.map(([key,label,url]) => `<a href="${url}" ${key===config.current?'aria-current="page"':""}>${label}</a>`).join("")}
      </div>
      <div class="school-section-row">
        <span class="school-section-label">On this page</span>
        <div class="school-section-links" aria-label="Jump to a section">
          ${config.sections.map(([id,label]) => document.getElementById(id) ? `<a href="#${id}">${label}</a>` : "").join("")}
        </div>
      </div>
    </div>`;
  hero.insertAdjacentElement("afterend",shell);

  const links = [...shell.querySelectorAll(".school-section-links a")];
  const targets = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  targets.forEach(target => target.classList.add("school-pathway-target"));
  const markActive = id => links.forEach(link => {
    if (link.hash === "#" + id) link.setAttribute("aria-current","location");
    else link.removeAttribute("aria-current");
  });
  links.forEach(link => link.addEventListener("click", event => {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    history.replaceState(null,"",link.hash);
    target.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    markActive(target.id);
  }));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) markActive(visible.target.id);
    },{rootMargin:"-24% 0px -62% 0px",threshold:[0,.15,.35,.6]});
    targets.forEach(target => observer.observe(target));
  }
  const initial = decodeURIComponent(location.hash.slice(1));
  if (initial && targets.some(target=>target.id===initial)) markActive(initial);
  else if (targets[0]) markActive(targets[0].id);
})();
