using System;

namespace FlightControlWeb
{
    public class Flight
    {
        string flight_id;
        double longitude;
        double latitude;
        int passengers;
        string company_name;
        DateTime date_time;
        bool is_external;

        public Flight()
        {

        }
        public Flight(string flight_id, double longitude, double latitude, int passengers,
            string company_name, DateTime date_time, bool is_external)
        {
            Flight_id = flight_id;
            Longitude = longitude;
            Latitude = latitude;
            Passengers = passengers;
            Company_name = company_name;
            Date_time = date_time;
            Is_external = is_external;
        }
        public string Flight_id
        {
            get { return flight_id; }
            set { flight_id = value; }
        }
        public double Longitude
        {
            get { return longitude; }
            set { longitude = value; }
        }
        public double Latitude
        {
            get { return latitude; }
            set { latitude = value; }
        }
        public int Passengers
        {
            get { return passengers; }
            set { passengers = value; }
        }
        public string Company_name
        {
            get { return company_name; }
            set { company_name = value; }
        }
        public DateTime Date_time
        {
            get { return date_time; }
            set { date_time = value; }
        }
        public bool Is_external
        {
            get { return is_external; }
            set { is_external = value; }
        }

    }

}