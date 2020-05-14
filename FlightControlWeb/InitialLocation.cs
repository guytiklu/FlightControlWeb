﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb
{
    public class InitialLocation
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

		private DateTime date_time;

		public InitialLocation(double longitude, double latitude, DateTime date_time)
		{
			Longitude = longitude;
			Latitude = latitude;
			Date_time = date_time;
		}

		public DateTime Date_time
		{
			get { return date_time; }
			set { date_time = value; }
		}

	}
}