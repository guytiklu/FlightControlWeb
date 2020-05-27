using FlightControlWeb;
using Microsoft.AspNetCore.Mvc.Formatters.Xml;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace UnitTestFlightControlWeb
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {

            // @@@Arrange@@@

            //create fp = (pass,name,init_loc,segments)
            int passengers = 250;
            string companyName = "El-Down";
            InitialLocation init = new InitialLocation(30, 30, "2020-05-27T00:00:00Z");
            Segment a = new Segment(33, 33, 10);
            Segment b = new Segment(40, 40, 20);
            List<Segment> segments = new List<Segment>();
            segments.Add(a);
            segments.Add(b);
            FlightPlan fp = new FlightPlan(passengers, companyName, init, segments);
            FlightData fd = new FlightData(fp);

            DateTime dateA = DateTime.Parse("2020-05-27T00:00:00Z").ToUniversalTime(); // on start
            bool expectedA = true;
            DateTime dateB = DateTime.Parse("2020-05-27T00:00:30Z").ToUniversalTime(); // on end
            bool expectedB = true;
            DateTime dateC = DateTime.Parse("2020-05-27T00:00:07Z").ToUniversalTime(); // on middle
            bool expectedC = true;
            DateTime dateD = DateTime.Parse("2020-05-27T00:00:10Z").ToUniversalTime(); // on segment
            bool expectedD = true;
            DateTime dateE = DateTime.Parse("2020-05-27T00:00:31Z").ToUniversalTime(); // after flight
            bool expectedE = false;
            DateTime dateF = DateTime.Parse("2020-05-26T00:00:00Z").ToUniversalTime(); // before flight
            bool expectedF = false;

            // @@@Act@@@

            bool actualA = fd.onAir(dateA);
            bool actualB = fd.onAir(dateB);
            bool actualC = fd.onAir(dateC);
            bool actualD = fd.onAir(dateD);
            bool actualE = fd.onAir(dateE);
            bool actualF = fd.onAir(dateF);

            // @@@Assert@@@

            Assert.AreEqual(expectedA, actualA);
            Assert.AreEqual(expectedB, actualB);
            Assert.AreEqual(expectedC, actualC);
            Assert.AreEqual(expectedD, actualD);
            Assert.AreEqual(expectedE, actualE);
            Assert.AreEqual(expectedF, actualF);
        }
    }
}
