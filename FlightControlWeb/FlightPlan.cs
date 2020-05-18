using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;

namespace FlightControlWeb
{
    public class FlightPlan
    {

        private int passengers;
        public int Passengers
        {
            get { return passengers; }
            set { passengers = value; }
        }

        private string company_name;

        public string Company_name
        {
            get { return company_name; }
            set { company_name = value; }
        }

        private InitialLocation initial_location;

        public InitialLocation Initial_location
        {
            get { return initial_location; }
            set { initial_location = value; }
        }

        private List<Segment> segments;

        public List<Segment> Segments
        {
            get { return segments; }
            set { segments = value; }
        }

        public FlightPlan(int passengers, string company_name, InitialLocation initial_location, List<Segment> segments)
        {
            this.passengers = passengers;
            this.company_name = company_name;
            this.initial_location = initial_location;
            this.segments = segments;
        }
        public FlightPlan()
        {
        }
    }
}
