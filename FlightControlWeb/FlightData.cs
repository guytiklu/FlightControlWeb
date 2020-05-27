using System;

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
            Random rnd = new Random();
            int a = rnd.Next(10);
            int b = rnd.Next(10);
            int c = rnd.Next(10);
            int d = rnd.Next(10);
            int e = rnd.Next(10);
            int f = rnd.Next(10);
            string serial1 = a.ToString() + b.ToString() + c.ToString() + d.ToString();
            string serial2 = e.ToString() + f.ToString();
            Id = "FLY" + serial1 + "NM" + serial2;
            this.fp = fp;
        }

        public FlightPlan Fp
        {
            get { return fp; }
            set { fp = value; }
        }

        public bool onAir(DateTime dt) // checks if flight is on air according to time
        {
            //calculate end time:
            DateTime landingTime = fp.Initial_location.Date_time;
            foreach (Segment s in fp.Segments)
            {
                landingTime = landingTime.AddSeconds(s.Timespan_seconds); //summing segmengs second to departure time = landing time
            }
            if (dt.CompareTo(fp.Initial_location.Date_time)>=0 && dt.CompareTo(landingTime)<=0)
            {
                return true;
            }
            return false;
        }

        public Location getAccuratePosition(DateTime dt) // returns position of flight according to time
        {
            DateTime a = fp.Initial_location.Date_time;
            DateTime b;
            Segment sa = new Segment(fp.Initial_location.Longitude, fp.Initial_location.Latitude, 0);
            Segment sb;

            foreach (Segment s in fp.Segments) // iterate over sergments
            {
                b = a;
                b = b.AddSeconds(s.Timespan_seconds);
                sb = s;

                if (dt.CompareTo(a) > 0 && dt.CompareTo(b) < 0)
                { // if time is between the adjacent segments a,b calcualte percise value
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
