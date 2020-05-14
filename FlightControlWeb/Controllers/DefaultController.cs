using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{
    [Route("api")]
    [Route("")]
    [ApiController]
    public class DefaultController : ControllerBase
    {
        [HttpGet]
        public ActionResult<String> Get()
        {
            string html = System.IO.File.ReadAllText("wwwroot/main.html");
            return Content(html, "text/html");
        }
        [HttpPost]
        public ActionResult<String> Post([FromBody] Test t)
        {
            return t.str;
        }
    }
}