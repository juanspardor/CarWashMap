let map;
let markers = [];

// 🎨 Marker icons by type
const icons = {
  Mister: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Take: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Whistle: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Zips: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Tidal: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Tommy: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
};

// ✅ Remove current markers
function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

async function loadFromJSON() {
  try {
    const res = await fetch("locations.json");
    const data = await res.json();

    let bounds = [];

    data.forEach((loc, index) => {
      const latlng = [loc.lat, loc.lon];
      const icon = icons[loc.type];

      // 👇 Log what you're about to try
      //console.log(`Processing #${index + 1}: ${loc.name} (type: ${loc.type})`);

      if (!icon) {
        console.error(`❌ Missing or unknown icon type: "${loc.type}" for "${loc.name}"`);
      }

      const marker = L.marker(latlng, {
        icon: icon || defaultIcon  // 🔐 use fallback to avoid crash
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
  const US_BOUNDS = [
    [24.396308, -125.0],   // Southwest corner (Key West to California)
    [49.384358, -66.93457] // Northeast corner (Maine)
  ];

  map = L.map('map', {
    maxBounds: US_BOUNDS,
    maxBoundsViscosity: 1.0,
    minZoom: 4,
    maxZoom: 18
  }).setView([39.8283, -98.5795], 5); // Centered on continental US

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  loadFromJSON(); // Load your markers
}


// 🚀 Load map on page load
document.addEventListener("DOMContentLoaded", initMap);
