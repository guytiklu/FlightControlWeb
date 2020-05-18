using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class serversController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<ServerInfo>> Get()
        {
            return FlightManager.externalFlightsServers;
        }

        [HttpPost]
        public void Post([FromBody] ServerInfo si)
        {
            FlightManager fm = new FlightManager();
            fm.addExternalServer(si);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete(string id)
        {
            FlightManager fm = new FlightManager();
            fm.deleteServer(id);
        }
    }
}