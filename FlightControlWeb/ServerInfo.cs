using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class ServerInfo
    {
        string serverId;
        string serverURL;
        public ServerInfo()
        {

        }
        public ServerInfo(string serverId, string serverURL)
        {
            ServerId = serverId;
            ServerURL = serverURL;
        }
        public string ServerId
        {
            get { return serverId; }
            set { serverId = value; }
        }
        public string ServerURL
        {
            get { return serverURL; }
            set { serverURL = value; }
        }

    }
}