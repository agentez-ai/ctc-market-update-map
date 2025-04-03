document.addEventListener('DOMContentLoaded', () => {
  const accessToken = 'pk.eyJ1IjoicnRhbWF5bzciLCJhIjoiY2x0MHN2aXNvMHEzZDJxcXl0ZGdyem12biJ9.jFqQ8YQsP77PJtxgaBhuIg';
  mapboxgl.accessToken = accessToken;

  const settings = {
    desktop: {
      default: { center: [-81.4, 26.3], zoom: 6.99 },
      layers: {
        state: { center: [-83.5, 28.2], zoom: 5.8 },
        metro: { center: [-81.4, 26.2], zoom: 6.99 },
        county: { center: [-81.2, 26.2], zoom: 6.99 },
        city: { center: [-81.4, 26.2], zoom: 7.4 },
        zip: { center: [-81.4, 26.2], zoom: 7.4 }
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

    // Label the zoom control for precise measurement
    document.querySelector('.mapboxgl-ctrl-top-right > .mapboxgl-ctrl').id = 'zoom-control';
  });

  // Use the Mapbox idle event to position the toggle bar after rendering
  map.on('idle', function () {
    updateToggleBarPosition();
  });

  window.addEventListener('resize', updateToggleBarPosition);

  // Function to position the toggle bar
  function updateToggleBarPosition() {
    const sidebar = document.getElementById('sidebar');
    const toggleBar = document.getElementById('toggle-bar');
    const zoomControl = document.getElementById('zoom-control');

    // Ensure all elements exist
    if (!sidebar || !toggleBar || !zoomControl) {
      console.error('Missing element for toggle positioning');
      return;
    }

    const sidebarRect = sidebar.getBoundingClientRect();
    const zoomRect = zoomControl.getBoundingClientRect();
    const toggleBarWidth = toggleBar.offsetWidth || 200;

    // Calculate available space between sidebar and zoom control
    const availableWidth = zoomRect.left - sidebarRect.right;
    const left = sidebarRect.right + (availableWidth / 2) - (toggleBarWidth / 2);

    // Apply positioning
    toggleBar.style.position = 'absolute';
    toggleBar.style.top = '10px';
    toggleBar.style.left = `${left}px`;

    // Debug logs if needed
    console.log({
      'Sidebar Right Edge': sidebarRect.right,
      'Zoom Left Edge': zoomRect.left,
      'Available Width': availableWidth,
      'ToggleBar Width': toggleBarWidth,
      'Final Left': left
    });
  }
});