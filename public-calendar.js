/* Founder-provided current weekly schedule, October 12, 2026. Google Calendar is not automatically synchronized. */
(() => {
  const mount = document.getElementById("public-events");
  if (!mount) return;
  const series = [
    { title: "Yoga For Life · All Peoples Church", place: "All Peoples Church · 2600 N 2nd St, Milwaukee, WI 53212", first: "2026-10-12", count: 5, hour: 10, minute: 0, duration: 60, kind: "Yoga For Life" },
    { title: "YAGI Stewardship & Free Meditation", place: "YAGI Legacy Garden · 2713 W Richardson Pl, Milwaukee, WI 53208", first: "2026-10-13", count: 4, hour: 11, minute: 0, duration: 150, kind: "Stewardship", description: "Shoveling, snowblowing, and site maintenance, followed by free meditation. Meditation follows stewardship within this block; no separate start time is assigned. Activities follow site conditions and appropriate supervision." },
    { title: "Yoga For Life · Darius Simmons Garden", place: "Darius Simmons Garden · 2571 N 2nd St, Milwaukee, WI 53212", first: "2026-10-16", count: 4, hour: 10, minute: 0, duration: 60, kind: "Yoga For Life" },
    { title: "Prāṇa Circle · Free Livestream", place: "Online · Patreon", first: "2026-10-12", count: 5, hour: 19, minute: 0, duration: 60, kind: "Prāṇa Circle", onlineUrl: "https://www.patreon.com/collection/1228721", description: "Join with your email; no paid membership is required." }
  ];
  const venues = [
    { name: "All Peoples campus · Church, Gathering Table & Darius Simmons Garden", address: "Church / Gathering Table: 2600 N 2nd St · Garden: 2571 N 2nd St, Milwaukee, WI 53212", destination: "All Peoples Gathering Lutheran Church, 2600 N 2nd St, Milwaukee, WI 53212", lat: 43.0651514, lon: -87.9127075, status: "Monday Yoga For Life; Monday/Wednesday volunteer service; Friday garden practice and optional Foodways. Campus marker uses the existing garden location; directions lead to the church." },
    { name: "YAGI Legacy Garden", address: "2713 W Richardson Pl, Milwaukee, WI 53208", lat: 43.0427251, lon: -87.9479783, status: "Tuesday stewardship and free meditation · Times may vary October 13–November 10; check dated events." },
    { name: "Sherman Phoenix Marketplace", address: "3536 W Fond du Lac Ave, Milwaukee, WI 53216", lat: 43.0760668, lon: -87.9580842, status: "Thursday pathway · Pending extension review. No confirmed class time; await announcement before attending." }
  ];
  const locationList = document.getElementById("map-location-list");
  const directions = place => "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(place.destination || place.address);
  if (locationList) {
    for (const place of venues) {
      const link = document.createElement("a");
      link.href = directions(place);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = place.name + " · " + place.status + " · Google Maps directions ↗";
      locationList.append(link);
    }
  }
  if (window.L && document.getElementById("community-map")) {
    const map = L.map("community-map", { scrollWheelZoom: false }).setView([43.055, -87.932], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 18
    }).addTo(map);
    const pins = venues.map(place => {
      const popup = document.createElement("div");
      const heading = document.createElement("strong");
      heading.textContent = place.name;
      const address = document.createElement("p");
      address.textContent = place.address;
      const link = document.createElement("a");
      link.href = directions(place);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Directions ↗";
      const status = document.createElement("p");
      status.textContent = place.status;
      popup.append(heading, address, status, link);
      const icon = L.divIcon({ className: "senses-map-pin", html: '<span aria-hidden="true">✦</span>', iconSize: [34, 34], iconAnchor: [17, 17] });
      return L.marker([place.lat, place.lon], { icon }).addTo(map).bindPopup(popup);
    });
    map.fitBounds(L.featureGroup(pins).getBounds().pad(0.12));
  }
  const events = series.flatMap(item => Array.from({ length: item.count }, (_, week) => {
    const day = new Date(item.first + "T12:00:00Z");
    day.setUTCDate(day.getUTCDate() + week * 7);
    const date = day.toISOString().slice(0, 10);
    const offset = date >= "2026-11-01" ? "-06:00" : "-05:00";
    const start = new Date(date + "T" + String(item.hour).padStart(2, "0") + ":" + String(item.minute).padStart(2, "0") + ":00" + offset);
    if (item.kind === "Stewardship" && date === "2026-10-13") { const adjusted = new Date(date + "T14:30:00-05:00"); return { ...item, start: adjusted, end: new Date(adjusted.getTime() + 150 * 60000), description: item.description + " October 13 confirmed session: 2:30–5:00 PM Central." }; }
    return { ...item, start, end: new Date(start.getTime() + item.duration * 60000) };
  })).filter(event => event.end > new Date()).sort((a, b) => a.start - b.start);

  const dateText = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", month: "short", day: "numeric" });
  const timeText = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" });
  const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeIcs = value => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  function googleLink(event) {
    const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: stamp(event.start) + "/" + stamp(event.end), details: event.description || "Senses Yoga School public gathering. Confirm current details before traveling.", location: event.place, ctz: "America/Chicago" });
    return "https://calendar.google.com/calendar/render?" + params;
  }
  function appleLink(event) {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Senses Yoga School//Public Schedule//EN", "BEGIN:VEVENT", "UID:" + stamp(event.start) + "-" + event.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "@sensesyoga.org", "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(event.start), "DTEND:" + stamp(event.end), "SUMMARY:" + escapeIcs(event.title), "LOCATION:" + escapeIcs(event.place), "DESCRIPTION:" + escapeIcs(event.description || "Confirm current details before traveling."), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  }
  mount.replaceChildren();
  if (!events.length) {
    const notice = document.createElement("p");
    notice.textContent = "The reviewed schedule has ended. Please contact the school for the next public gathering.";
    mount.append(notice);
    return;
  }
  for (const event of events) {
    const card = document.createElement("article");
    card.className = "public-event";
    const date = document.createElement("div");
    date.className = "public-event-date";
    date.textContent = dateText.format(event.start);
    const details = document.createElement("div");
    const category = document.createElement("span");
    category.className = "eyebrow";
    category.textContent = event.kind;
    const title = document.createElement("h3");
    title.textContent = event.title;
    const info = document.createElement("p");
    info.textContent = timeText.format(event.start) + "–" + timeText.format(event.end) + " · " + event.place;
    details.append(category, title, info);
    if (event.description) {
      const note = document.createElement("p");
      note.textContent = event.description;
      details.append(note);
    }
    const actions = document.createElement("div");
    actions.className = "public-event-actions";
    if (event.onlineUrl) {
      const join = document.createElement("a");
      join.href = event.onlineUrl;
      join.target = "_blank";
      join.rel = "noopener";
      join.textContent = "Join free on Patreon";
      actions.append(join);
    } else {
      const rsvp = document.createElement("a");
      rsvp.href = "https://form.typeform.com/to/TTvNJuX1";
      rsvp.target = "_blank";
      rsvp.rel = "noopener";
      rsvp.textContent = "RSVP";
      const checkIn = document.createElement("a");
      checkIn.href = "https://docs.google.com/forms/d/10vaQVnl1i0eFEc3cvkKUmjn59J7oKTLXx4l5YYctV_A/viewform";
      checkIn.target = "_blank";
      checkIn.rel = "noopener";
      checkIn.textContent = "Post-session check-in";
      actions.append(rsvp, checkIn);
    }
    const google = document.createElement("a");
    google.href = googleLink(event);
    google.target = "_blank";
    google.rel = "noopener";
    google.textContent = "Add to Google";
    const apple = document.createElement("a");
    apple.href = appleLink(event);
    apple.download = "senses-yoga-" + stamp(event.start) + ".ics";
    apple.textContent = "Add to Apple";
    actions.append(google, apple);
    card.append(date, details, actions);
    mount.append(card);
  }
})();
