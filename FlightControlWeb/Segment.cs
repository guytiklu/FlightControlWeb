using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class Segment
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

		private int timespan_seconds;

		public Segment(double longitude, double latitude, int timespan_seconds)
		{
			Longitude = longitude;
			Latitude = latitude;
			Timespan_seconds = timespan_seconds;
		}
		public Segment()
		{
		}

		public int Timespan_seconds
		{
			get { return timespan_seconds; }
			set { timespan_seconds = value; }
		}

	}
}
