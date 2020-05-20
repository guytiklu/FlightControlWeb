var ip ="http://localhost";
var port="52018";

function run() {
	get_flights_service();
	var intervalID = window.setInterval(get_flights_service, 3000);
}

function get_flights_service() {
	var xmlhttp = new XMLHttpRequest();
	//var url = "http://ronyut.atwebpages.com/ap2/api/Flights?relative_to=2020-12-26T23:56:26Z";  //external server
	//var url = "http://localhost:52018/api/Flights?relative_to=2020-12-26T23:56:26Z&sync_all";  //my server
	var url = ip + ":" + port + "/api/Flights?relative_to=2020-12-26T23:56:26Z&sync_all";

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var arr = JSON.parse(this.responseText);

			$("#internal_list").empty();
			$("#external_list").empty();
			for (var i in arr) {
				var f = new Flight(arr[i]);
				//put flight in list
				var id = f.get_flight_id();
				if (f.get_is_external()==true) {
					$("<li id='" + id + "'><div class='text'>" + id + "</div></li>").appendTo("#external_list");
				}
				else {
					$("<li id='" + id + "'><div class='text'>" + id + "</div><button class='x' onclick=\"delete_from_list('" + id + "')\">X</button></li>").appendTo("#internal_list");
				}




				//put icon on map
				// take f and make icon on the map according to its longi at lati

			}


		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function setInternal() { }

function setExternal() { }

function delete_from_list(id) {
	elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);
	//remove from server

	//remove from map
	//remove from active
}

function show_more_details(id) {

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