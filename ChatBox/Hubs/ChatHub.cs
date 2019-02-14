using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using ChatBox.Models;
using Microsoft.AspNet.SignalR;

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> ConnectedUser = new List<User>();
        public ApplicationDbContext db = new ApplicationDbContext();

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
            }
            else
            {
                item.ConnectionId = id;
                db.SaveChanges();
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
                FromConnectionId = Context.ConnectionId,
                FromEmail = fromEmail,
                ToEmail = toEmail,
                Msg = msg,
                DateSend = DateTime.Today
            };
            db.messages.Add(item);
            db.SaveChanges();
            Clients.User("admin@gmail.com").SendMsgForAdmin(msg, item.FromConnectionId);
        }

        public void SendPrivateMessage(string from)
        {

        }
        public void LoadMsgOfClient(string email)
        {
            var item = db.account.FirstOrDefault(x => x.Email == email);
            if (item != null)
            {
                var msg = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email);
                string listMsg = new JavaScriptSerializer().Serialize(msg);
                Clients.Caller.LoadAllMsgOfClient(listMsg);
            }
        }
    }
}