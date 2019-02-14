using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatBox.ViewModel
{
    public class UserViewModel
    {
        public string ConnectionId { get; set; }
        public string Email { get; set; }
        public bool IsOnline { get; set; }
        public string LastMsg { get; set; }
    }
}