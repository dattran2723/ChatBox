using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;

namespace ChatBox.DataBinding
{
    public class UserDb
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        public void ChangeConnection(string connectionId,string id)
        {
            connectionId = id;
        }
        
    }
}