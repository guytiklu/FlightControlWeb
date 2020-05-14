using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb
{
    public class Test
    {
        public string str;
        int i;
        public string Str   // property
        {
            get { return str; }   // get method
            set { str = value; }  // set method
        }
        public int I   // property
        {
            get { return i; }   // get method
            set { i = value; }  // set method
        }
        public Test(int i, string str)
        {
            Debug.WriteLine("building");
            this.I = i;
            this.Str = str;
        }
        public Test()
        {
            Debug.WriteLine("default building");
            I = 22;
            Str = "default constructor";
        }
    }
}
