using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatBox.Models
{
    public class User
    {
        public string Id { get; set; }
        public string ConnectionId { get; set; }
        public string Email { get; set; }
        public bool IsOnline { get; set; }
    }
}