let map;
let markers = [];

// 🎨 Marker icons by type
const icons = {
  Mister: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Take: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// ✅ Remove current markers
function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

// 📂 Load from static locations.json
async function loadFromJSON() {
  try {
    const res = await fetch("locations.json");
    const data = await res.json();

    let bounds = [];

    data.forEach(loc => {
      const latlng = [loc.lat, loc.lon];
      const marker = L.marker(latlng, {
        icon: icons[loc.type] || undefined
      })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b>`);
      markers.push(marker);
      bounds.push(latlng);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

  } catch (err) {
    console.error("Failed to load locations.json:", err);
    alert("Could not load map data.");
  }
}

// 🗺️ Init map
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4); // USA center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  loadFromJSON(); // ✅ Load static markers only
}

// 🚀 Load map on page load
document.addEventListener("DOMContentLoaded", initMap);
