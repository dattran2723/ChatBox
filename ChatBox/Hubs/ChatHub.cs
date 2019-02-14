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
        public ApplicationDbContext db = new ApplicationDbContext();
        static List<User> ConnectedUser = new List<User>();
        public void Connect(string email)
        {

            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == email);
            if (item == null)
            {
                db.account.Add(new User
                {
                    Id = Guid.NewGuid().ToString(),
                    ConnectionId = id,
                    Email = email,
                    IsOnline = true
                });
                db.SaveChanges();
                Clients.Caller.onConnected(id, email, ConnectedUser);
            }
            else
            {
                item.ConnectionId = id;
                db.SaveChanges();
                Clients.Caller.onConnected(id, email, ConnectedUser);

            }



        }

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


        }

        public void SendPrivateMessage(string from)
        {

        }
    }
}