/* Curated public events. Replace this list with the dedicated public feed when available. */
(() => {
  const mount = document.getElementById("public-events");
  if (!mount) return;
  const series = [
    { title: "Yoga For Life · Sherman Park", place: "Sherman Park, Milwaukee, WI", first: "2026-09-21", count: 4, hour: 14, minute: 45, duration: 60, kind: "Yoga For Life" },
    { title: "YAGI Community Wellness Session", place: "2713 W Richardson Pl, Milwaukee, WI 53208", first: "2026-09-23", count: 4, hour: 10, minute: 0, duration: 180, kind: "YAGI" },
    { title: "Yoga For Life · Darius Simmons Garden", place: "2571 N 2nd St, Milwaukee, WI 53212", first: "2026-09-25", count: 4, hour: 10, minute: 0, duration: 60, kind: "Yoga For Life" }
  ];
  const venues = [
    { name: "Sherman Park", address: "Sherman Park, 3000 N Sherman Blvd, Milwaukee, WI 53210", lat: 43.0733764, lon: -87.9658620 },
    { name: "YAGI Legacy Garden", address: "2713 W Richardson Pl, Milwaukee, WI 53208", lat: 43.0427251, lon: -87.9479783 },
    { name: "Darius Simmons Garden / All Peoples", address: "2571 N 2nd St, Milwaukee, WI 53212", lat: 43.0651514, lon: -87.9127075 },
    { name: "Sherman Phoenix Marketplace", address: "Milwaukee, WI", lat: 43.0760668, lon: -87.9580842 },
    { name: "Gordon Park", address: "Milwaukee, WI", lat: 43.0688793, lon: -87.8959559 },
    { name: "Lakeshore State Park", address: "Milwaukee, WI", lat: 43.0326963, lon: -87.8954344 }
  ];
  const locationList = document.getElementById("map-location-list");
  const directions = place => "https://www.openstreetmap.org/directions?to=" + encodeURIComponent(place.lat + "," + place.lon);
  if (locationList) {
    for (const place of venues) {
      const link = document.createElement("a");
      link.href = directions(place);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = place.name + " · Directions ↗";
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
      popup.append(heading, address, link);
      if (["Sherman Park", "YAGI Legacy Garden", "Darius Simmons Garden / All Peoples"].includes(place.name)) {
        const rsvp = document.createElement("a");
        rsvp.href = place.name === "YAGI Legacy Garden"
          ? "https://www.signupgenius.com/go/10C054DA5A92BA3F9C16-61993676-yoga#/"
          : "mailto:luan@sensesyoga.org?subject=" + encodeURIComponent("RSVP: " + place.name);
        rsvp.textContent = "RSVP ↗";
        rsvp.style.marginLeft = "12px";
        popup.append(rsvp);
      }
      return L.marker([place.lat, place.lon]).addTo(map).bindPopup(popup);
    });
    map.fitBounds(L.featureGroup(pins).getBounds().pad(0.12));
  }
  const events = series.flatMap(item => Array.from({ length: item.count }, (_, week) => {
    const day = new Date(item.first + "T12:00:00Z");
    day.setUTCDate(day.getUTCDate() + week * 7);
    const date = day.toISOString().slice(0, 10);
    const start = new Date(date + "T" + String(item.hour).padStart(2, "0") + ":" + String(item.minute).padStart(2, "0") + ":00-05:00");
    return { ...item, start, end: new Date(start.getTime() + item.duration * 60000) };
  })).filter(event => event.end > new Date()).sort((a, b) => a.start - b.start);

  const dateText = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", month: "short", day: "numeric" });
  const timeText = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" });
  const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeIcs = value => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  function googleLink(event) {
    const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: stamp(event.start) + "/" + stamp(event.end), details: "Senses Yoga School public gathering. Confirm current details before traveling.", location: event.place, ctz: "America/Chicago" });
    return "https://calendar.google.com/calendar/render?" + params;
  }
  function appleLink(event) {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Senses Yoga School//Public Schedule//EN", "BEGIN:VEVENT", "UID:" + stamp(event.start) + "-" + event.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "@sensesyoga.org", "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(event.start), "DTEND:" + stamp(event.end), "SUMMARY:" + escapeIcs(event.title), "LOCATION:" + escapeIcs(event.place), "DESCRIPTION:Confirm current details before traveling.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
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
    const actions = document.createElement("div");
    actions.className = "public-event-actions";
    const rsvp = document.createElement("a");
    rsvp.href = event.kind === "YAGI"
      ? "https://www.signupgenius.com/go/10C054DA5A92BA3F9C16-61993676-yoga#/"
      : "mailto:luan@sensesyoga.org?subject=" + encodeURIComponent("RSVP: " + event.title + " · " + dateText.format(event.start));
    rsvp.target = "_blank";
    rsvp.rel = "noopener";
    rsvp.textContent = "RSVP";
    const google = document.createElement("a");
    google.href = googleLink(event);
    google.target = "_blank";
    google.rel = "noopener";
    google.textContent = "Add to Google";
    const apple = document.createElement("a");
    apple.href = appleLink(event);
    apple.download = "senses-yoga-" + stamp(event.start) + ".ics";
    apple.textContent = "Add to Apple";
    actions.append(rsvp, google, apple);
    card.append(date, details, actions);
    mount.append(card);
  }
})();
