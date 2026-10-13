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
})();
