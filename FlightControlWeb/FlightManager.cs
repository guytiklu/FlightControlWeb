using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class FlightManager
    {
        public static List<FlightData> internalFlights = new List<FlightData>();
        public static List<ServerInfo> externalFlightsServers = new List<ServerInfo>();

        public List<Flight> getInternal(DateTime time) // get list of internal flights according to time
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

        public async Task<List<Flight>> getAllFlights(DateTime time) // get list of all flights according to time
        {
            List<Flight> list = getInternal(time); // first get internals
            //add to list from external servers
            foreach (ServerInfo si in externalFlightsServers.ToList<ServerInfo>())
            {
                List<Flight> exList = new List<Flight>();
                
                // Create a New HttpClient object.
                HttpClient client = new HttpClient();

                // Call asynchronous network methods in a try/catch block to handle exceptions
                try
                {
                    HttpResponseMessage response = await client.GetAsync(si.ServerURL+ "/api/Flights?relative_to="+
                        time.ToString("yyyy-MM-ddTHH:mm:ssZ") );
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    try
                    {
                        exList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Flight>>(responseBody);
                    }
                    catch
                    {
                        exList = new List<Flight>();
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine("\nException Caught!");
                    Console.WriteLine("Message :{0} ", e.Message);
                }

                // Need to call dispose on the HttpClient object
                // when done using it, so the app doesn't leak resources
                client.Dispose();
                
                foreach (Flight f in exList.ToList())
                {
                    f.Is_external = true;
                }
                list.AddRange(exList); // add the external list got from server to total list
            }

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

        public async Task<FlightPlan> GetFlightPlan(string id)
        {
            FlightPlan fp = null;
            foreach (FlightData x in internalFlights) // first search in internals
            {
                if (x.Id == id)
                {
                    fp = x.Fp;
                }
            }
            if (fp == null) // if not found search in externals
            {
                foreach (ServerInfo si in externalFlightsServers.ToList<ServerInfo>())
                {
                    // Create a New HttpClient object.
                    HttpClient client = new HttpClient();

                    // Call asynchronous network methods in a try/catch block to handle exceptions
                    try
                    {
                        HttpResponseMessage response = await client.GetAsync(si.ServerURL + "/api/FlightPlan/" + id);
                        response.EnsureSuccessStatusCode();
                        string responseBody = await response.Content.ReadAsStringAsync();

                        Console.WriteLine(responseBody);
                        fp = Newtonsoft.Json.JsonConvert.DeserializeObject<FlightPlan>(responseBody);

                    }
                    catch (HttpRequestException e)
                    {
                        Console.WriteLine("\nException Caught!");
                        Console.WriteLine("Message :{0} ", e.Message);
                    }

                    // Need to call dispose on the HttpClient object
                    // when done using it, so the app doesn't leak resources
                    client.Dispose();

                    //responseBody now holds info that came from server
                    //convert from Json to list:

                    if (fp.Company_name != null)
                    {
                        return fp;
                    }
                }
            }
            else
            {
                return fp;
            }
            return null;
        }

        public void deleteInternal(string id)
        {
            foreach (FlightData x in internalFlights.ToList<FlightData>())
            {
                if (x.Id == id)
                {
                    internalFlights.Remove(x);
                }
            }
        }

        public void deleteServer(string id)
        {
            foreach (ServerInfo x in externalFlightsServers.ToList<ServerInfo>())
            {
                if (x.ServerId == id)
                {
                    externalFlightsServers.Remove(x);
                }
            }
        }

    }

}
