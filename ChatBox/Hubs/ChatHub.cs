using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChatBox.Models;
using Microsoft.AspNet.SignalR;
using System;

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        /// <summary>
        /// gui tin nhan cho admin
        /// </summary>
        public void SendMsg(string fromEmail, string toEmail, string msg)
        {
            var item = new Message
            {
                Id = Guid.NewGuid().ToString(),
                FromEmail = fromEmail,
                ToEmail = toEmail,
                Msg = msg,
                DateSend = DateTime.Today
            };
            db.messages.Add(item);
            db.SaveChanges();
            Clients.User("admin@gmail.com").SendMsgForAdmin();
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