/* Dream Master invitation: reveal only when the visitor reaches the project section. */
(() => {
  const section = document.getElementById("dream-master");
  if (!section || !("IntersectionObserver" in window)) return;
  const seenKey = "senses-dream-master-developer-invite-seen";
  try { if (sessionStorage.getItem(seenKey)) return; } catch (_) {}
  let opened = false;
  const show = () => {
    if (opened) return;
    opened = true;
    try { sessionStorage.setItem(seenKey, "1"); } catch (_) {}
    const style = document.createElement("style");
    style.textContent = ".dream-master-invite-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(22,12,28,.58);display:grid;place-items:center;padding:1rem}.dream-master-invite{position:relative;width:min(100%,520px);background:#fffaf0;color:#30233a;border:1px solid #dfcf9f;border-radius:18px;padding:2rem;box-shadow:0 18px 60px rgba(0,0,0,.28)}.dream-master-invite h2{margin:.35rem 2rem .7rem 0}.dream-master-invite p{line-height:1.6}.dream-master-invite .invite-kicker{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#765b20}.dream-master-invite .invite-actions{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap;margin-top:1.25rem}.dream-master-invite-close{position:absolute;right:1rem;top:.8rem;border:0;background:transparent;font-size:1.8rem;cursor:pointer;color:inherit}.dream-master-invite a{display:inline-block}.dream-master-invite .invite-dismiss{border:0;background:transparent;text-decoration:underline;cursor:pointer;color:inherit;font:inherit;padding:.6rem}";
    document.head.append(style);
    const backdrop = document.createElement("div");
    backdrop.className = "dream-master-invite-backdrop";
    backdrop.innerHTML = '<section class="dream-master-invite" role="dialog" aria-modal="true" aria-labelledby="dream-invite-title" aria-describedby="dream-invite-copy"><button type="button" class="dream-master-invite-close" aria-label="Close invitation">×</button><p class="invite-kicker">Dream Master · Development circle</p><h2 id="dream-invite-title">Would you like to help build the game?</h2><p id="dream-invite-copy">We are welcoming developers, designers, testers, sound creators, and thoughtful collaborators as Dream Master takes shape. Add your email to receive updates specifically about this project.</p><p><small>Your address will be used for Dream Master development updates and opportunities only. You can unsubscribe at any time.</small></p><div class="invite-actions"><a class="button" href="https://form.typeform.com/to/VWe8kQVI" target="_blank" rel="noopener">Join the developer list</a><button type="button" class="invite-dismiss">Maybe later</button></div></section>';
    document.body.append(backdrop);
    const close = () => { backdrop.remove(); style.remove(); };
    backdrop.querySelector(".dream-master-invite-close").addEventListener("click", close);
    backdrop.querySelector(".invite-dismiss").addEventListener("click", close);
    backdrop.addEventListener("click", event => { if (event.target === backdrop) close(); });
    document.addEventListener("keydown", function onKey(event) {
      if (event.key === "Escape" && document.body.contains(backdrop)) {
        close();
        document.removeEventListener("keydown", onKey);
      }
    });
    backdrop.querySelector(".dream-master-invite-close").focus();
  };
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      show();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(section);
})();
