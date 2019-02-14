using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChatBox.DataBinding;
using System.Web.Script.Serialization;
using ChatBox.Models;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        static List<User> ConnectedUser = new List<User>();
        MessageDb messageDb = new MessageDb();
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
                Clients.User("admin@gmail.com").onConnected(id, email, "true");
            }
            else
            {
                if (item.ConnectionId != id && item.IsOnline == true)
                {
                    var a = true;
                    Clients.Caller.removeOldTab();
                    item.ConnectionId = id;
                    db.SaveChanges();
                    Clients.Caller.sameEmail(a, id);
                }
                item.ConnectionId = id;
                item.IsOnline = true;
                var itemMsg = db.messages.ToList().Where(x => x.FromEmail == email);
                foreach (var i in itemMsg)
                {
                    i.FromConnectionId = id;
                }
                db.SaveChanges();
            }



        }

        /// <summary>
        /// gui tin nhan cho admin
        /// </summary>
        public void SendMsg(string fromEmail, string toEmail, string msg)
        {
            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == fromEmail);
            if (id == item.ConnectionId)
            {
                MessageDb messageDb = new MessageDb();
                var createDate = DateTime.Now;
                messageDb.AddMessage(fromEmail, toEmail, msg, createDate);

                var connectionId = Context.ConnectionId;

                Clients.User("admin@gmail.com").SendMsgForAdmin(msg, createDate, connectionId, fromEmail);
            }
            
        }

        public void SendPrivateMessage(string toEmail, string msg, string connectionId)
        {
            var createDate = DateTime.Now;
            var fromEmail = "admin@gmail.com";
            messageDb.AddMessage(fromEmail, toEmail, msg, createDate);
            Clients.Client(connectionId).AdminSendMsg(msg);
        }
        public void LoadMsgOfClient(string email)
        {
            string listMsg = messageDb.GetMessagesByEmail(email);
            Clients.Caller.LoadAllMsgOfClient(listMsg);
        }

        public void LoadMsgByEmailOfAdmin(string email)
        {

            string listMsg = messageDb.GetMessagesByEmail(email);
            Clients.User("admin@gmail.com").loadAllMsgByEmailOfAdmin(listMsg);
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = db.account.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                item.IsOnline = false;
                db.SaveChanges();
                Clients.User("admin@gmail.com").OnUserDisconnected(item.Email, item.IsOnline, item.ConnectionId);
            }
            // Add your own code here.
            // For example: in a chat application, mark the user as offline, 
            // delete the association between the current connection id and user name.
            return base.OnDisconnected(stopCalled);
        }
    }
}