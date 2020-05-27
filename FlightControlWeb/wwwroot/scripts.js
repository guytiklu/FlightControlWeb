let map;
var markers = [];
var clicked = null;
var flightPath;
var landing_longi;
var landing_lati;
var segmantLocations = [];
var flags;
var flightPlanCoordinates = [];
var flightPath;
var counter = 0;
var init_loc;

function run() { // this function runs when body loads, initializes stuff & listeners

	// drop component :
	var dropbox = document.getElementById("list_in");
	dropbox.addEventListener('dragenter', dragEnter, false);
	dropbox.addEventListener('dragleave', dragExit, false);
	dropbox.addEventListener('dragover', noopHandler, false);
	dropbox.addEventListener('drop', drop, false);

	function dragEnter(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		document.getElementById('internal_header').style.display = 'none';
		document.getElementById('internal_list').style.display = 'none';
		document.getElementById("list_in").style.backgroundColor = '#e6e6ff';
		var dropText = document.createElement("h3");
		dropText.innerHTML = "Drop Here";
		dropText.id = "drop";
		dropText.style.position = "relative";
		dropText.style.left = "0%";
		dropText.style.top = "40%";
		dropText.style.pointerEvents = 'none';
		document.getElementById("list_in").appendChild(dropText);
	}
	function dragExit(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var element = document.getElementById("drop");
		element.parentNode.removeChild(element);
		document.getElementById("list_in").style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
		document.getElementById('internal_header').style.display = 'inherit';
		document.getElementById('internal_list').style.display = 'inherit';
	}
	function noopHandler(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	function drop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var element = document.getElementById("drop");
		element.parentNode.removeChild(element);
		document.getElementById("list_in").style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
		document.getElementById('internal_header').style.display = 'inherit';
		document.getElementById('internal_list').style.display = 'inherit';

		var files = evt.dataTransfer.files; // Get array of files dropped

		for (var i = 0, file; file = files[i]; i++) { // For each file caught, send to server
			var extension = file.name.split('.').pop();
			if (extension == 'json' || extension == 'txt') {
				var reader = new FileReader();
				reader.onload = function (event) {
					var data = event.target.result;
					(async function () {
						var response = await fetch("/api/FlightPlan", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: data
						});
						if (response.status !== 200) {
							alert('Looks like there was a problem. Status Code: ' +
								response.status);
							console.log('Looks like there was a problem. Status Code: ' +
								response.status);
							return;
						}
					})();
					
				};
				reader.readAsText(file);
			}
		}
	}

	var intervalID = window.setInterval(get_flights_service, 3000); // run flights service every 3000 ms
}

function get_flights_service() { // function will run every fixed amount of time and brings data from server to client
	var xmlhttp = new XMLHttpRequest();

	//calculate current date utc :
	var d = new Date();
	var hrs = d.getUTCHours();
	var mins = d.getUTCMinutes();
	var secs = d.getUTCSeconds();
	if (hrs < 10) {
		hrs = "0" + hrs.toString();
	} else { hrs = hrs.toString(); }
	if (mins < 10) {
		mins = "0" + mins.toString();
	} else { mins = mins.toString(); }
	if (secs < 10) {
		secs = "0" + secs.toString();
	} else { secs = secs.toString(); }

	var date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + hrs + ":" + mins + ":" + secs + "Z";

	fetch("/api/Flights?relative_to=" + date + "&sync_all") // send request to server
		.then(
			function (response) {
				if (response.status !== 200) {
					alert('Looks like there was a problem. Status Code: ' +
						response.status);
					console.log('Looks like there was a problem. Status Code: ' +
						response.status);
					return;
				}
				response.json().then(function (data) {
					var arr = data;

					$("#internal_list").empty();
					$("#external_list").empty();
					deleteMarkers();
					for (var i in arr) { // for each flight caught
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

						// add icon to map
						var image = {
							url: "planeicon.png",
							// This marker is 20 pixels wide by 32 pixels high.
							size: new google.maps.Size(40, 40),
							// The origin for this image is (0,0)
							origin: new google.maps.Point(0, 0),
							// The anchor for this image is the base of the flagpole at (0, 32).
							anchor: new google.maps.Point(0, 0)
						};

						addMarker({
							coords: { lat: f.get_latitude(), lng: f.get_longitude() },
							iconImage: image,
							animation: google.maps.Animation.BOUNCE,
							id: f.get_flight_id(),
						});
					}

					if (clicked != null) { // if flight is clicked, mark it
						var elem = document.getElementById(clicked);
						elem.style.border = "thin solid #0000ff";
					}
				});
			}
		)
}

function clearClicked() { // clears all signs of clicked flight
	if (clicked != null) {
		//remove info
		document.getElementById("info_flight_id").innerHTML = "";
		document.getElementById("info_air_company").innerHTML = "";
		document.getElementById("info_passengers").innerHTML = "";
		document.getElementById("info_departure_loc").innerHTML = "";
		document.getElementById("info_departure_time").innerHTML = "";
		document.getElementById("info_landing_loc").innerHTML = "";
		document.getElementById("info_landing_time").innerHTML = "";

		//remove border
		var elem = document.getElementById(clicked);
		elem.style.border = "";

		//remove path
		removeLine();


	}
	clicked = null;
}

function add_onclick(id) { // on click for any flight
	var elem = document.getElementById(id);
	elem.setAttribute('onclick', "show_more_details(\"" + id + "\")"); // show more detail at info

	elem.addEventListener("mouseenter", function (event) { //highlight list item when hover
		if (clicked != id) {
			event.target.style.border = "thin solid #ff0000";
		}
	});
	elem.addEventListener("mouseleave", function (event) {
		if (clicked != id) {
			event.target.style.border = "";
		}
	});
}

function highlightFlight(id) {
	var elem = document.getElementById(id);
	elem.style.border = "thin solid #0000ff";
}

function show_more_details(id) { //shows info for flight id, and path on map
	if (clicked != null) { clearClicked(); }
	clicked = id;
	highlightFlight(id);
	segmantLocations = [];
	flightPlanCoordinates = [];

	fetch("/api/FlightPlan/" + id) //get flight plan from server
		.then(
			function (response) {
				if (response.status !== 200) {
					alert('Looks like there was a problem. Status Code: ' +
						response.status);
					console.log('Looks like there was a problem. Status Code: ' +
						response.status);
					return;
				}
				response.json().then(function (data) {
					var plan = new FlightPlan(data);
					document.getElementById("info_flight_id").innerHTML = id;
					document.getElementById("info_air_company").innerHTML = plan.get_company_name();
					document.getElementById("info_passengers").innerHTML = plan.get_passengers();
					init_loc = new InitialLocation(plan.get_initial_location());
					document.getElementById("info_departure_loc").innerHTML = "(" + init_loc.get_latitude() + "," + init_loc.get_longitude() + ")";
					segmantLocations.push(init_loc.get_latitude());
					segmantLocations.push(init_loc.get_longitude());
					var departure_time = new Date(init_loc.get_date_time());
					var split = departure_time.toString().split('+');
					document.getElementById("info_departure_time").innerHTML = split[0];
					var seconds = 0;
					var landing_time = new Date(init_loc.get_date_time());
					var segments = plan.get_segments();
					for (var i in segments) {
						var s = new Segment(segments[i]);
						landing_lati = s.get_latitude();

						segmantLocations.push(landing_lati);
						landing_longi = s.get_longitude();
						segmantLocations.push(landing_longi);
						seconds += s.get_timespan_seconds();
					}

					drawLine();

					document.getElementById("info_landing_loc").innerHTML = "(" + landing_lati + "," + landing_longi + ")";
					landing_time.setSeconds(landing_time.getSeconds() + seconds);
					var split = landing_time.toString().split('+');
					document.getElementById("info_landing_time").innerHTML = split[0];
				});
			}
		)
}

function delete_from_list(id) { //delete flight from server

	event.stopPropagation();
	//remove from server

	(async function () {
		var response = await fetch("/api/Flights/" + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.status !== 200) {
			alert('Looks like there was a problem. Status Code: ' +
				response.status);
			console.log('Looks like there was a problem. Status Code: ' +
				response.status);
			return;
		}
	})();

	//remove manually
	if (id == clicked) {
		clearClicked();
	}

	get_flights_service();

}

function initMap() { // initialize map
	// The location of Uluru
	var uluru = { lat: 31.771959, lng: 35.217018 };
	// The map, centered at Uluru
	map = new google.maps.Map(
		document.getElementById('map'), { zoom: 5, center: uluru });

	google.maps.event.addListener(map, "click", function () {
		//event.preventDefault();
		if (clicked != null) {
			get_flights_service();
			clearClicked();
		}
	});

}

function addMarker(props) { // add marker to map
	var marker = new google.maps.Marker({
		position: props.coords,
		map: map,
	});


	if (props.iconImage) { // check for icon change
		marker.setIcon(props.iconImage);
	}

	if (clicked == props.id) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	google.maps.event.addListener(marker, "click", function () { //icon jupms on click
		event.preventDefault();
		get_flights_service();
		marker.setAnimation(google.maps.Animation.BOUNCE);
		show_more_details(props.id);
	});

	markers.push(marker);

}

function drawLine() { // draws path on map
	for (i = 0; i < segmantLocations.length; i += 2) {
		var point = new google.maps.LatLng(segmantLocations[i], segmantLocations[i + 1]);
		flightPlanCoordinates.push(point);
	}

	flightPath = new google.maps.Polyline({
		path: flightPlanCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	flightPath.setMap(map);
	addLine();

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

// Classes representation:
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