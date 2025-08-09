/* eslint-disable */

// Parse locations from the map container
export const displayMap = (locations) => {
  const leaflet = document.getElementById('map');
  if (leaflet) {
    const locations = JSON.parse(leaflet.dataset.locations);

    const map = L.map('map', {
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Create bounds to fit all locations
    const bounds = L.latLngBounds();

    // Add markers and popups
    locations.forEach((loc) => {
      const [lng, lat] = loc.coordinates;

      // Marker with popup
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
          autoClose: false,
          closeOnClick: false,
        })
        .openPopup();

      // Extend bounds
      bounds.extend([lat, lng]);
    });

    // Fit map to bounds
    map.fitBounds(bounds, {
      padding: [150, 100],
    });
  }
};
