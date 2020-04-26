using System;
using System.Collections.Generic;
using System.Text;

namespace TimeTriggers
{
    public class Link
    {
        public string Url { get; set; }
        public LinkType Type { get; set; }
    }

    public enum LinkType
    {
        Hls,
        Dash,
        Smooth
    }
}
