function initializeMap() {
  var mapOptions = {
    center: {lat: 59.323, lng: 18.03},
    zoom: 13,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  var styles = [
    {
      stylers: [
        {hue: "#F47821"},
        {saturation: 70}
      ]
    }, {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {visibility: "off"}
      ]
    }
  ];

  map.setOptions({styles: styles});

  var image = 'img/pin.png';
  var myLatLng = new google.maps.LatLng(59.323, 18.07433);
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image
  });
}

if (window.google) {
  google.maps.event.addDomListener(window, 'load', initializeMap);
}
