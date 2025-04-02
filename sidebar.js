document.addEventListener('DOMContentLoaded', () => {
  const accessToken = 'pk.eyJ1IjoicnRhbWF5bzciLCJhIjoiY2x0MHN2aXNvMHEzZDJxcXl0ZGdyem12biJ9.jFqQ8YQsP77PJtxgaBhuIg';
  mapboxgl.accessToken = accessToken;

  const settings = {
    desktop: {
      default: { center: [-81.5, 26.3], zoom: 6.99 },
      layers: {
        state: { center: [-84, 28.2], zoom: 5.8 },
        metro: { center: [-81.5, 26.3], zoom: 6.99 },
        county: { center: [-81.5, 26.3], zoom: 6.99 },
        city: { center: [-81.5, 26.3], zoom: 7.4 },
        zip: { center: [-81.5, 26.3], zoom: 7.4 }
      }
    },
    tablet: {
      default: { center: [-82.1, 26.3], zoom: 6.8 },
      layers: {
        state: { center: [-86.31, 28], zoom: 5.5 },
        metro: { center: [-82.1, 26.3], zoom: 6.8 },
        county: { center: [-82.1, 26.3], zoom: 6.8 },
        city: { center: [-82.1, 26.3], zoom: 6.8 },
        zip: { center: [-82.1, 26.3], zoom: 6.8 }
      }
    },
    mobile: {
      default: { center: [-81.25, 26.2], zoom: 6.8 },
      layers: {
        state: { center: [-83.6, 28.1], zoom: 5.29 },
        metro: { center: [-81.25, 26.2], zoom: 6.85 },
        county: { center: [-81.25, 26.2], zoom: 6.85 },
        city: { center: [-81, 26], zoom: 6.59 },
        zip: { center: [-81.17, 26.2], zoom: 6.8 }
      }
    }
  };

  function getDeviceSettings() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1024) return settings.desktop;
    if (screenWidth > 768) return settings.tablet;
    return settings.mobile;
  }

  const deviceSettings = getDeviceSettings();

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rtamayo7/cm8sape5r00jc01s354wd73jd',
    center: deviceSettings.default.center,
    zoom: deviceSettings.default.zoom
    // Attribution control is enabled by default
  });

  // Add navigation control
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  // Add scale control
  const scale = new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' });
  map.addControl(scale, 'bottom-right');

  const layerMap = {
    state: ['ctc-florida-fill', 'ctc-florida-label'],
    metro: ['ctc-core7-msas-fill', 'ctc-core7-msas-label'],
    county: ['ctc-core7-counties-fill', 'ctc-core7-counties-label'],
    city: ['ctc-core7-cities-fill', 'ctc-core7-cities-label'],
    zip: ['ctc-core7-zipcodes-fill', 'ctc-core7-zipcodes-label']
  };

  function toggleLayerVisibility(selectedLayer) {
    Object.keys(layerMap).forEach(layerGroup => {
      layerMap[layerGroup].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
      });
    });

    layerMap[selectedLayer].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
    });

    const layerSettings = deviceSettings.layers[selectedLayer];
    if (layerSettings) {
      map.flyTo({ center: layerSettings.center, zoom: layerSettings.zoom });
    }
  }

  map.on('load', () => {
    toggleLayerVisibility('county');

    document.querySelectorAll('input[name="layer"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        toggleLayerVisibility(e.target.value);
      });
    });

    // Restore Mapbox logo's default position
    map.setPadding({ left: 0, bottom: 0 });
  });

  window.addEventListener('resize', () => {
    const newDeviceSettings = getDeviceSettings();
    map.flyTo({ center: newDeviceSettings.default.center, zoom: newDeviceSettings.default.zoom });
    updateToggleBarPosition(); // Recalculate toggle bar position on resize
  });

  // Add toggle bar position control
  const toggleBar = document.getElementById('toggle-bar');
  function setToggleBarPosition(topPercent, leftPercent) {
    toggleBar.style.top = `${topPercent}%`;
    toggleBar.style.left = `${leftPercent}%`;
  }

  function updateToggleBarPosition() {
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    const mapWidth = document.getElementById('map').offsetWidth;
    const zoomControlWidth = 50; // Approximate width of the zoom controls
    const usableWidth = mapWidth - sidebarWidth - zoomControlWidth;

    const centerLeftPercent = ((sidebarWidth + usableWidth / 2) / mapWidth) * 100; // Center of the usable space in percentage
    setToggleBarPosition(8, centerLeftPercent - 5); // Adjust top and left percentages as needed
  }

  // Example: Adjust toggle bar position dynamically
  updateToggleBarPosition(); // Initial position
});