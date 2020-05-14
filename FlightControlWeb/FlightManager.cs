using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class FlightManager
    {
        static List<FlightPlan> internalFlights = new List<FlightPlan>();
        static List<ServerInfo> externalFlights = new List<ServerInfo>();
    }
}
