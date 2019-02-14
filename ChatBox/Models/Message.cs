﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ChatBox.Models
{
    public class Message
    {
        [Key]
        public string Id { get; set; }
        public string FromEmail { get; set; }
        public string ToEmail { get; set; }
        public string Msg { get; set; }
        public DateTime DateSend { get; set; }
    }
}