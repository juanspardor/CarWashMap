// Marker icon colors
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

// Your business search definitions
const businesses = [
  { query: "Mister Car Wash", type: "Mister" },
  { query: "Take 5 Car Wash", type: "Take" }
];

let map;
let markers = [];

// Remove all current markers
function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

// Load locations from the static file
async function loadFromJSON() {
  try {
    const res = await fetch("locations.json");
    const data = await res.json();

    data.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lon], {
        icon: icons[loc.type] || undefined
      })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>Type: ${loc.type}`);
      markers.push(marker);
    });

  } catch (err) {
    console.error("Failed to load locations.json:", err);
    alert("Could not load map data.");
  }
}

// Fetch updated locations from the Nominatim API
async function fetchAndRenderFreshData() {
  clearMarkers();

  for (let biz of businesses) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(biz.query)}&format=json&limit=10&countrycodes=us`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "your-app-name (your@email.com)"
        }
      });

      const data = await res.json();

      data.forEach((item, i) => {
        const marker = L.marker([item.lat, item.lon], {
          icon: icons[biz.type] || undefined
        })
          .addTo(map)
          .bindPopup(`<b>${biz.query} #${i + 1}</b>`);
        markers.push(marker);
      });

    } catch (err) {
      console.error(`Error fetching data for ${biz.query}:`, err);
      alert(`Error fetching data for ${biz.query}`);
    }

    // Respect Nominatim API rate limit
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
}

// Init the map and load static data
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  loadFromJSON(); // ✅ Load static locations only
}

// This is called only when user clicks "Refresh"
function refreshMap() {
  fetchAndRenderFreshData(); // ✅ Pull live data only on demand
}

// Initialize map on page load
document.addEventListener("DOMContentLoaded", initMap);
