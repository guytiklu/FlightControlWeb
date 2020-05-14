using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class Location
    {
		private double longitude;

		public double Longitude
		{
			get { return longitude; }
			set { longitude = value; }
		}

		private double latitude;

		public double Latitude
		{
			get { return latitude; }
			set { latitude = value; }
		}

		public Location(double longitude, double latitude)
		{
			this.longitude = longitude;
			this.latitude = latitude;
		}
	}
}
