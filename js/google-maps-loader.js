(function () {
  'use strict';

  function readMapsApiKey() {
    var fromMeta = '';
    var meta = document.querySelector('meta[name="google-maps-api-key"]');
    if (meta) {
      fromMeta = String(meta.getAttribute('content') || '').trim();
    }

    var fromWindow = String(window.GOOGLE_MAPS_API_KEY || '').trim();
    return fromMeta || fromWindow;
  }

  function loadGoogleMaps() {
    var apiKey = readMapsApiKey();
    if (!apiKey) {
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&callback=initGoogleMap';
    script.async = true;
    script.defer = true;
    script.onerror = function () {
      console.error('Google Maps script failed to load.');
    };

    document.head.appendChild(script);
  }

  loadGoogleMaps();
})();
