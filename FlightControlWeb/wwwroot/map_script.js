function initMap() {
    // The location of Uluru
    var uluru = { lat: 31.771959, lng: 35.217018 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 5, center: uluru });

    var image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    var flightPlanCoordinates = [
        { lat: 30, lng: 30 },
        { lat: 35, lng: 32 },
        { lat: 40, lng: 42 },
        { lat: 45, lng: 35 }
    ];
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map)


    addMarker({
        coords: { lat: 30, lng: 30 },
        iconImage: image,
        content: '<h1>Los Angels</h1>',
    });
    addMarker({
        coords: { lat: 35, lng: 32 },
        iconImage: image,
        content: '<h1>Vegas</h1>',
    });
    addMarker({
        coords: { lat: 40, lng: 42 },
        iconImage: image,
        content: '<h1>Chigao</h1>',

    });
    addMarker({
        coords: { lat: 45, lng: 35 },
        iconImage: image,
        content: '<h1>Okland</h1>',

    });

    ///Add marker Function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            animation: google.maps.Animation.DROP,
            map: map,
        });

        if (props.iconImage) { // check for icon change
            marker.setIcon(props.iconImage);
        }
        if (props.content) { //check for content change
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });
            marker.addListener('click', function () { ///popping the info window
                infoWindow.open(map, marker);
            });
        }
        marker.addListener('click', function () { /// make the marker jump
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });

    }

}
function addLine() {
    flightPath.setMap(map);
}
function removeLine() {
    flightPath.setMap(null);
}