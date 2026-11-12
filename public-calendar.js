/* Historical venue reference. Confirm current dates in the embedded Google Calendar; this map is not automatically synchronized. */
(() => {
  // The map and venue links must initialize independently of any legacy event-list mount.
  const series = [
    { title: "Yoga For Life · All Peoples Church", place: "All Peoples Church · 2600 N 2nd St, Milwaukee, WI 53212", first: "2026-10-12", count: 5, hour: 10, minute: 0, duration: 60, kind: "Yoga For Life" },
    { title: "YAGI Stewardship & Free Meditation", place: "YAGI Legacy Garden · 2713 W Richardson Pl, Milwaukee, WI 53208", first: "2026-10-13", count: 4, hour: 11, minute: 0, duration: 150, kind: "Stewardship", description: "Shoveling, snowblowing, and site maintenance, followed by free meditation. Meditation follows stewardship within this block; no separate start time is assigned. Activities follow site conditions and appropriate supervision." },
    { title: "Yoga For Life · Darius Simmons Garden", place: "Darius Simmons Garden · 2571 N 2nd St, Milwaukee, WI 53212", first: "2026-10-16", count: 4, hour: 10, minute: 0, duration: 60, kind: "Yoga For Life" },
    { title: "Prāṇa Circle · Free Livestream", place: "Online · Patreon", first: "2026-10-12", count: 5, hour: 19, minute: 0, duration: 60, kind: "Prāṇa Circle", onlineUrl: "https://www.patreon.com/collection/1228721", description: "Join with your email; no paid membership is required." }
  ];
  const venues = [
    { name: "All Peoples campus · Church, Gathering Table & Darius Simmons Garden", address: "Church / Gathering Table: 2600 N 2nd St · Garden: 2571 N 2nd St, Milwaukee, WI 53212", destination: "All Peoples Gathering Lutheran Church, 2600 N 2nd St, Milwaukee, WI 53212", lat: 43.0651514, lon: -87.9127075, status: "Community campus and historical/recurring practice location. Verify the current class and entrance in the live calendar before traveling." },
    { name: "YAGI Legacy Garden", address: "2713 W Richardson Pl, Milwaukee, WI 53208", lat: 43.0427251, lon: -87.9479783, status: "Garden stewardship venue. Confirm current public gatherings and weather-related changes in the live calendar." },
    { name: "Sherman Phoenix Marketplace", address: "3536 W Fond du Lac Ave, Milwaukee, WI 53216", lat: 43.0760668, lon: -87.9580842, status: "Historical Yoga for Life venue; future sessions are not confirmed here. Check the live calendar before visiting." },
    { name: "Scaling Wellness in Milwaukee (SWIM)", address: "831 N 27th St, Milwaukee, WI 53208", destination: "Scaling Wellness in Milwaukee, 831 N 27th St, Milwaukee, WI 53208", lat: 43.0452, lon: -87.9499, status: "Planned Yoga For Life eight-week in-kind hosted pilot for January 2027. Session dates and time are to be confirmed." },
    { name: "Milwaukee Public Library · East Branch", address: "2320 N Cramer St, Milwaukee, WI 53211", destination: "Milwaukee Public Library East Branch, 2320 N Cramer St, Milwaukee, WI 53211", lat: 43.0587, lon: -87.8867, status: "Approved Dream Connections gatherings: November 23, December 7, December 21, 2026, and January 4, 2027. Yoga For Life library sessions are also being coordinated here on alternating Tuesdays; check the live calendar for reservation updates." },
    { name: "Milwaukee Public Library · Center Street Branch", address: "2727 W Fond du Lac Ave, Milwaukee, WI 53210", destination: "Milwaukee Public Library Center Street Branch, 2727 W Fond du Lac Ave, Milwaukee, WI 53210", lat: 43.067614, lon: -87.948207, status: "Yoga For Life Tuesday library series venue. November 24 and December dates have been requested; check the dated schedule and live calendar for reservation confirmation." }
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
      if (place.name.includes("Milwaukee Public Library")) {
        const schedule = document.createElement("p");
        const scheduleLink = document.createElement("a");
        scheduleLink.href = "calendar.html#library-gatherings";
        scheduleLink.textContent = "View dated library gatherings →";
        schedule.append(scheduleLink);
        popup.append(schedule);
      }
      const icon = L.divIcon({ className: "senses-map-pin", html: '<span aria-hidden="true">✦</span>', iconSize: [34, 34], iconAnchor: [17, 17] });
      return L.marker([place.lat, place.lon], { icon }).addTo(map).bindPopup(popup);
    });
    map.fitBounds(L.featureGroup(pins).getBounds().pad(0.12));
  }
})();
