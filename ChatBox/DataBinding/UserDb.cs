using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Configuration;

namespace ChatBox.DataBinding
{
    public class UserDb
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        string emailAdmin = WebConfigurationManager.AppSettings["EmaillAdmin"];

        public void ChangeConnection(string connectionId, string id)
        {
            connectionId = id;
        }
        

    }
}