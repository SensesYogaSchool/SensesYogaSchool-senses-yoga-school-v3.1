/* Senses Yoga School · reusable homepage announcement */
(() => {
  const render = (a) => {
  if (!a || !a.enabled || !a.id || (a.expiresAt && Date.now() >= Date.parse(a.expiresAt))) return;
  const key = "senses-announcement-seen:" + a.id;
  try { if (localStorage.getItem(key)) return; } catch (_) {}
  const markSeen = () => { try { localStorage.setItem(key, "1"); } catch (_) {} };
  const panel = document.createElement("aside");
  panel.className = "senses-announcement";
  panel.setAttribute("aria-label", "School community announcement");
  panel.hidden = true;
  const content = document.createElement("div");
  content.className = "senses-announcement-content";
  const logo = document.createElement("img");
  logo.src = "assets/senses-yoga-logo.png";
  logo.alt = "Senses Yoga School";
  const heading = document.createElement("h2");
  heading.textContent = a.title || "School announcement";
  const eyebrow = document.createElement("p");
  eyebrow.className = "senses-announcement-eyebrow";
  eyebrow.textContent = a.eyebrow || "Community Announcement";
  const message = document.createElement("p");
  message.textContent = a.message || "";
  const details = document.createElement("p");
  details.className = "senses-announcement-details";
  details.textContent = [a.date, a.place].filter(Boolean).join(" · ");
  const link = document.createElement("a");
  link.className = "button";
  link.href = a.link || "calendar.html";
  link.textContent = a.linkText || "Learn more";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "senses-announcement-close";
  close.setAttribute("aria-label", "Dismiss announcement");
  close.textContent = "×";
  close.addEventListener("click", () => { markSeen(); panel.remove(); });
  content.append(logo, eyebrow, heading, message, details, link);
  panel.append(content, close);
  document.body.append(panel);
  window.setTimeout(() => {
    if (document.visibilityState !== "visible" || (a.expiresAt && Date.now() >= Date.parse(a.expiresAt))) return;
    panel.hidden = false;
    markSeen();
  }, Math.max(0, Number(a.delayMs) || 10000));
  };
  const endpoint = window.SENSES_ANNOUNCEMENT_FEED_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\//.test(endpoint)) { render(window.SENSES_ANNOUNCEMENT); return; }
  const cb = "SensesAnnouncementFeed_" + Math.random().toString(36).slice(2);
  const script = document.createElement("script");
  let settled = false;
  const fallback = () => { if (settled) return; settled = true; delete window[cb]; script.remove(); render(window.SENSES_ANNOUNCEMENT); };
  window[cb] = (data) => { if (settled) return; settled = true; delete window[cb]; script.remove(); render(data); };
  script.onerror = fallback;
  script.src = endpoint + (endpoint.includes("?") ? "&" : "?") + "callback=" + encodeURIComponent(cb);
  document.head.append(script);
  window.setTimeout(fallback, 5000);
})();
