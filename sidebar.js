document.addEventListener('DOMContentLoaded', () => {
  // Initialize Mapbox
  mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  const map = new mapboxgl.Map({
    container: 'map', // ID of the map container
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-81.5158, 27.6648], // Example coordinates (Florida)
    zoom: 6
  });

  // Resize the map when the window resizes
  window.addEventListener('resize', () => {
    map.resize();
  });

  // Sidebar accordion functionality
  document.querySelectorAll('.accordion').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });
  });
});