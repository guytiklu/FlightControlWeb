using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;

namespace FlightControlWeb
{
    public class FlightData
    {


        private string id;
        public string Id
        {
            get { return id; }
            set { id = value; }
        }

        private FlightPlan fp;

        public FlightData(FlightPlan fp)
        {
            //generate id
            this.fp = fp;
        }

        public FlightPlan Fp
        {
            get { return fp; }
            set { fp = value; }
        }

        public bool onAir(DateTime dt)
        {
            //calculate end time:
            DateTime landingTime = fp.Initial_location.Date_time;
            foreach (Segment s in fp.Segments)
            {
                landingTime.AddSeconds(s.Timespan_seconds); //summing segmengs second to departure time = landing time
            }
            if (dt.CompareTo(fp.Initial_location.Date_time)>0 && dt.CompareTo(landingTime)< 0)
            {
                return true;
            }
            return false;
        }

        public Location getAccuratePosition(DateTime dt)
        {
            DateTime a = fp.Initial_location.Date_time;
            DateTime b;
            Segment sa = new Segment(fp.Initial_location.Longitude, fp.Initial_location.Latitude, 0);
            Segment sb;

            foreach (Segment s in fp.Segments)
            {
                b = a;
                b.AddSeconds(s.Timespan_seconds);
                sb = s;

                if (dt.CompareTo(a) > 0 && dt.CompareTo(b) < 0)
                {
                    TimeSpan secondsOnAirFromA = dt.Subtract(a);
                    double partialTimeOnAir = secondsOnAirFromA.TotalSeconds / s.Timespan_seconds;
                    double startLongitude = sa.Longitude;
                    double startLatitude = sa.Latitude ;
                    double endLongitude = sb.Longitude;
                    double endLatitude = sb.Latitude;

                    double ansLongitude = sa.Longitude + (endLongitude - startLongitude) * partialTimeOnAir;
                    double ansLatitude = sa.Latitude + (endLatitude - startLatitude) * partialTimeOnAir;

                    return new Location(ansLongitude, ansLatitude);
                }

                sa = sb;
                a = b;
            }

            return null;
        }
    }
}
