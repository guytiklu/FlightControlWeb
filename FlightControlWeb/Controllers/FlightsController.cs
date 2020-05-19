﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<Flight>> GetInternal([FromQuery(Name = "relative_to")] DateTime time)
        {
            time = time.AddHours(-2);
            FlightManager fm = new FlightManager();
            if (Request.Query.ContainsKey("sync_all"))
            {
                return fm.getAllFlights(time).Result;
            }
            return fm.getInternal(time);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete(string id)
        {
            FlightManager fm = new FlightManager();
            fm.deleteInternal(id);
        }
    }
}