(function () {
  'use strict';

  function initGoogleMap() {
    if (!window.google || !window.google.maps) {
      return;
    }

    var mapElement = document.getElementById('map');
    if (!mapElement) {
      return;
    }

    var center = new window.google.maps.LatLng(40.69847032728747, -73.9514422416687);
    var mapOptions = {
      zoom: 7,
      center: center,
      scrollwheel: false,
      styles: [
        {
          featureType: 'administrative.country',
          elementType: 'geometry',
          stylers: [
            { visibility: 'simplified' },
            { hue: '#ff0000' }
          ]
        }
      ]
    };

    var map = new window.google.maps.Map(mapElement, mapOptions);

    new window.google.maps.Marker({
      position: center,
      map: map,
      icon: 'images/loc.png'
    });
  }

  window.initGoogleMap = initGoogleMap;
})();
