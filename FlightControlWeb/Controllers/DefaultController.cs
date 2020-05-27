using System;
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
            string html = System.IO.File.ReadAllText("wwwroot/mainView.html");
            return Content(html, "text/html");
        }
    }
}