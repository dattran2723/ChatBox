using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChatBox.Models;
using Microsoft.AspNet.SignalR;

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> ConnectedUser = new List<User>();
        public void Connect(string email)
        {
            var id = Context.ConnectionId;
            if (ConnectedUser.Count(x => x.Email == email) == 0)
            {
                ConnectedUser.Add(new User { ConnectionId = id, Email = email });
            }
            else
            {
                var connetedUser = new User { Email = email };
                connetedUser.ConnectionId = id;
            }
        }
        public void SendPrivateMessage(string from)
        {

        }

    }
}