

function initializeWorldMap() {
  var mapOptions = {
    center: {lat: 59.323, lng: 18.03},
    zoom: 4,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('worldMap'),
    mapOptions);

  var styles =[
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 13
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#144b53"
        },
        {
          "lightness": 14
        },
        {
          "weight": 1.4
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#08304b"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0c4152"
        },
        {
          "lightness": 5
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#0b434f"
        },
        {
          "lightness": 25
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#0b3d51"
        },
        {
          "lightness": 16
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "color": "#146474"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#021019"
        }
      ]
    }
  ];

  map.setOptions({styles: styles});

  var placeMarker = function(element) {
    var icon = (!!element.thisIsUs)? 'img/pin.png':'img/pin-small.png';
    new google.maps.Marker({
      position: new google.maps.LatLng(element.lat, element.long),
      map: map,
      icon: icon
    });
  };

  var markerData = [
      {
        "lat": 56.152759,
        "long": 10.195402
      },
      {
        "lat": 56.218600,
        "long": 10.145964
      },
      {
        "lat": 55.684649,
        "long": 12.586092
      },
      {
        "lat": 55.527404,
        "long": 8.449280
      },
      {
        "lat": 52.516903,
        "long": 13.389893
      },
      {
        "lat": 47.481089,
        "long": 19.065776
      },
      {
        "lat": 52.347796,
        "long": 4.850765
      },
      {
        "lat": 51.445583,
        "long": 5.460362
      },
      {
        "lat": 52.366384,
        "long": 4.877263
      },
      {
        "lat": 50.064152,
        "long": 19.942219
      },
      {
        "thisIsUs": true,
        "lat": 59.323125,
        "long": 18.075935
      },
      {
        "lat": 47.177497,
        "long": 8.710227
      },
      {
        "lat": 53.790796,
        "long": -1.552236
      },
      {
        "lat": 51.512893,
        "long": -0.067163
      },
      {
        "lat": 51.505091,
        "long": -0.100208
      },
      {
        "lat": 37.787191,
        "long": -122.399027
      }
    ];

  markerData.forEach(function(element) {
    placeMarker(element);
  });

}

google.maps.event.addDomListener(window, 'load', initializeWorldMap);


var sendLetter = function() {
  $(".letter").addClass("letter--send");
  return false;
};
