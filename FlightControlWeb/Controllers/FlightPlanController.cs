using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightPlanController : ControllerBase
    {
        [HttpGet]
        [Route("{id}")]
        public ActionResult<FlightPlan> Get(string id)
        {
            Console.WriteLine(id);
            Debug.WriteLine(id);
            FlightManager fm = new FlightManager();
            return fm.GetFlightPlan(id).Result;
        }
        [HttpPost]
        public void Post([FromBody] FlightPlan fp)
        {
            FlightManager fm = new FlightManager();
            fm.addInternal(fp);
        }
    }
}
