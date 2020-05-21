var ip ="http://localhost";
var port = "52018";
let map;
var markers = [];
var flightPlanCoordinates = [
	{ lat: 45, lng: 45 },
];
var flightPath;

function run() {
	get_flights_service();

	var dropbox = document.getElementById("list_in");

	dropbox.addEventListener('dragenter', noopHandler, false);
	dropbox.addEventListener('dragexit', noopHandler, false);
	dropbox.addEventListener('dragover', noopHandler, false);
	dropbox.addEventListener('drop', drop, false);

	function noopHandler(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	function drop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files; // Array of all files

		for (var i = 0, file; file = files[i]; i++) {
			var extension = file.name.split('.').pop();
			if (extension == 'json' || extension == 'txt') {
				var reader = new FileReader();
				reader.onload = function (event) {

					var data = event.target.result;
					var url = ip + ":" + port + "/api/FlightPlan";
					$.ajax({
						type: 'POST',
						url: url,
						data: data,
						dataType: 'text',
						contentType: 'application/json'
					});
				};
				reader.readAsText(file);
			}
		}
	}

	var intervalID = window.setInterval(get_flights_service, 3000);
}

function get_flights_service() {
	var xmlhttp = new XMLHttpRequest();

	var d = new Date();
	var hrs = d.getHours();
	var mins = d.getMinutes();
	var secs = d.getSeconds();
	if (hrs < 10) {
		hrs = "0" + hrs.toString();
	} else { hrs = hrs.toString(); }
	if (mins < 10) {
		mins = "0" + mins.toString();
	} else { mins = mins.toString(); }
	if (secs < 10) {
		secs = "0" + secs.toString();
	} else { secs = secs.toString(); }
	var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "T" + hrs + ":" + mins + ":" + secs + "Z";
	var url = ip + ":" + port + "/api/Flights?relative_to=" + date + "&sync_all";
	$.get(url, function (data) {
		var arr = data;

		$("#internal_list").empty();
		$("#external_list").empty();
		for (var i in arr) {
			var f = new Flight(arr[i]);
			//put flight in list
			var id = f.get_flight_id();
			if (f.get_is_external() == true) {
				$("<li id='" + id + "'><div class='text'>" + id + "</div></li>").appendTo("#external_list");
			}
			else {
				$("<li id='" + id + "'><div class='text'>" + id + "</div><button class='x' onclick=\"delete_from_list('" + id + "')\">X</button></li>").appendTo("#internal_list");
			}
			add_onclick(id);

			clearMarkers();

			var point = new google.maps.LatLng(f.get_latitude(), f.get_longitude());
			flightPlanCoordinates.push(point);
			flightPath = new google.maps.Polyline({
				path: flightPlanCoordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			flightPath.setMap(map)
			addLine();

			var image = {
				url: "planeicon.png",
				// This marker is 20 pixels wide by 32 pixels high.
				size: new google.maps.Size(50, 50),
				// The origin for this image is (0, 0).
				origin: new google.maps.Point(0, 0),
				// The anchor for this image is the base of the flagpole at (0, 32).
				anchor: new google.maps.Point(0, 32)
			};
			addMarker({
				coords: { lat: f.get_latitude(), lng: f.get_longitude() },
				iconImage: image,
			});
		}
	});
}

function add_onclick(id) {
	//add show_more_details to onclick
	var elem = document.getElementById(id);
	elem.setAttribute('onclick', "show_more_details(\"" + id + "\")");
}

function show_more_details(id) {
	var url = ip + ":" + port + "/api/FlightPlan/"+id;
	$.get(url, function (data) {
		var plan = new FlightPlan(data);
		document.getElementById("info_flight_id").innerHTML = id;
		document.getElementById("info_air_company").innerHTML = plan.get_company_name();
		document.getElementById("info_passengers").innerHTML = plan.get_passengers();
		var init_loc = new InitialLocation(plan.get_initial_location());
		document.getElementById("info_departure_loc").innerHTML = "("+init_loc.get_latitude() + "," + init_loc.get_longitude()+")";
		var departure_time = new Date(init_loc.get_date_time());
		var split = departure_time.toString().split('+');
		document.getElementById("info_departure_time").innerHTML = split[0];
		var landing_longi;
		var landing_lati;
		var seconds=0;
		var landing_time = new Date(init_loc.get_date_time());

		var segments = plan.get_segments();
		for (var i in segments) {
			var s = new Segment(segments[i]);
			landing_lati = s.get_latitude();
			landing_longi = s.get_longitude();
			seconds += s.get_timespan_seconds();
		}

		document.getElementById("info_landing_loc").innerHTML = "(" + landing_lati + "," + landing_longi + ")";
		landing_time.setSeconds(landing_time.getSeconds() + seconds);
		var split = landing_time.toString().split('+');
		document.getElementById("info_landing_time").innerHTML = split[0];
	});
}

function delete_from_list(id) {

	//remove from server
	var xmlhttp = new XMLHttpRequest();
	//var url = "http://ronyut.atwebpages.com/ap2/api/Flights?relative_to=2020-12-26T23:56:26Z";  //external server
	//var url = "http://localhost:52018/api/Flights?relative_to=2020-12-26T23:56:26Z&sync_all";  //my server
	var url = ip + ":" + port + "/api/Flights/"+id;

	xmlhttp.open("DELETE", url, true);
	xmlhttp.send();

	//remove manually
	elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);

	//remove from map @@@@@@eldad

	//remove from active @@@@@eldad

}

function initMap() {
			// The location of Uluru
			var uluru = { lat: 31.771959, lng: 35.217018 };
			// The map, centered at Uluru
			map = new google.maps.Map(
				document.getElementById('map'), { zoom: 5, center: uluru });
			/*var image = {
			 url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
			 // This marker is 20 pixels wide by 32 pixels high.
			 size: new google.maps.Size(20, 32),
			 // The origin for this image is (0, 0).
			 origin: new google.maps.Point(0, 0),
			 // The anchor for this image is the base of the flagpole at (0, 32).
			 anchor: new google.maps.Point(0, 32)
			};*/

			/* flightPlanCoordinates = [
			 {  },
			];*/
			/*  flightPath = new google.maps.Polyline({
			  path: flightPlanCoordinates,
			  geodesic: true,
			  strokeColor: '#FF0000',
			  strokeOpacity: 1.0,
			  strokeWeight: 2
			 });
			 flightPath.setMap(map)
			 addLine();*/

			/* addMarker({
			  coords: { lat: 30, lng: 30 },
			  iconImage: image,
			  content: '<h1>Los Angels</h1>',
			 });
			 addMarker({
			  coords: { lat: 35, lng: 32 },
			  //iconImage: image,
			  //content: '<h1>Vegas</h1>',
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
			
			 });*/
		}
///Add marker Function

function addMarker(props) {
			//alert("im at the add marker");
			var marker = new google.maps.Marker({
				position: props.coords,
				//animation: google.maps.Animation.DROP,
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
			markers.push(marker);
		}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
			setMapOnAll(null);
		}
// Shows any markers currently in the array.
function showMarkers() {
			setMapOnAll(map);
		}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {

			clearMarkers();
			markers = [];
		}

function addLine() {
			flightPath.setMap(map);
		}

function removeLine() {
			flightPath.setMap(null);
		}


class Flight {
	constructor(obj) {
		Object.assign(this,obj)
	}
	get_flight_id() { return this.flight_id; }
	get_longitude() { return this.longitude; }
	get_latitude() { return this.latitude; }
	get_passengers() { return this.passengers; }
	get_company_name() { return this.company_name; }
	get_date_time() { return this.date_time; }
	get_is_external() { return this.is_external; }
}

class FlightPlan {
	constructor(obj) {
		Object.assign(this, obj)
	}
	get_passengers() { return this.passengers; }
	get_company_name() { return this.company_name; }
	get_initial_location() { return this.initial_location; }
	get_segments() { return this.segments; }
}

class InitialLocation {
	constructor(obj) {
		Object.assign(this, obj)
	}
	get_longitude() { return this.longitude; }
	get_latitude() { return this.latitude; }
	get_date_time() { return this.date_time; }
}

class Segment {
	constructor(obj) {
		Object.assign(this, obj)
	}
	get_longitude() { return this.longitude; }
	get_latitude() { return this.latitude; }
	get_timespan_seconds() { return this.timespan_seconds; }
}