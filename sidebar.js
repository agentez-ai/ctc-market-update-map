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
    }
  };

  const footerPositions = {
    state: { bottom: 20, left: '50%' },
    metro: { bottom: 30, left: '45%' },
    county: { bottom: 40, left: '40%' },
    city: { bottom: 50, left: '35%' },
    zip: { bottom: 60, left: '30%' }
  };

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rtamayo7/cm8sape5r00jc01s354wd73jd',
    center: settings.desktop.default.center,
    zoom: settings.desktop.default.zoom,
    attributionControl: false
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

  const footer = document.querySelector('footer');
  function setFooterPosition(bottom, left) {
    footer.style.bottom = `${bottom}px`;
    footer.style.left = `${left}`;
    footer.style.transform = 'translateX(-50%)';
  }

  function toggleLayerVisibility(selectedLayer) {
    const footerPosition = footerPositions[selectedLayer];
    if (footerPosition) {
      setFooterPosition(footerPosition.bottom, footerPosition.left);
    }
  }

  map.on('load', () => {
    toggleLayerVisibility('county');
    document.querySelectorAll('input[name="layer"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        toggleLayerVisibility(e.target.value);
      });
    });
  });
});