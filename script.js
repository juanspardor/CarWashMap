// ✅ Declare markers before use
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

// 🔍 Businesses to fetch on refresh
const businesses = [
  { query: "Mister Car Wash", type: "Mister" },
  { query: "Take 5 Car Wash", type: "Take" }
];

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

// 🌐 Fetch live data from Nominatim (on refresh)
async function fetchAndRenderFreshData() {
  clearMarkers();

  for (let biz of businesses) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(biz.query)}&format=json&limit=10&countrycodes=us`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "map-test-app (test@example.com)" // replace with your email
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

    // ⏱ Be polite to Nominatim
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
}

// 🗺️ Init map
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4); // USA center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  loadFromJSON(); // 🟢 Load static markers
}

// 🔁 Called when button is clicked
function refreshMap() {
  fetchAndRenderFreshData(); // 🔄 Fetch and show live data
}

// 🚀 Load map on page load
document.addEventListener("DOMContentLoaded", initMap);
