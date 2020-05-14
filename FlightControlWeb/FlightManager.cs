using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class FlightManager
    {
        static List<FlightData> internalFlights = new List<FlightData>();
        static List<ServerInfo> externalFlightsServers = new List<ServerInfo>();

        public List<Flight> getInternal(DateTime time)
        {
            List<Flight> list = new List<Flight>();
            foreach (FlightData x in internalFlights){
                if (x.onAir(time))
                {
                    Location loc = x.getAccuratePosition(time);
                    Flight f = new Flight(x.Id, loc.Longitude, loc.Latitude, x.Fp.Passengers, x.Fp.Company_name, time, false);
                    list.Add(f);
                }
            }
            return list;
        }

        public List<Flight> getAllFlights(DateTime time)
        {
            List<Flight> list = getInternal(time);
            //add to list from external servers

            return list ;
        }

        public void addInternal(FlightPlan fp)
        {
            FlightData fd = new FlightData(fp);
            internalFlights.Add(fd);
        }

        public void addExternalServer(ServerInfo si)
        {
            externalFlightsServers.Add(si);
        }

        public FlightPlan GetFlightPlan(string id)
        {
            FlightPlan fp = null;
            foreach (FlightData x in internalFlights)
            {
                if (x.Id == id)
                {
                    fp = x.Fp;
                }
            }
            if (fp == null)
            {
                //get fp from external
            }

            return fp;
        }

        public void deleteInternal(string id)
        {
            foreach (FlightData x in internalFlights)
            {
                if (x.Id == id)
                {
                    internalFlights.Remove(x);
                }
            }
        }

        public void deleteServer(string id)
        {
            foreach (ServerInfo x in externalFlightsServers)
            {
                if (x.ServerId == id)
                {
                    externalFlightsServers.Remove(x);
                }
            }
        }
    }
}
