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
        public void Connect(string email)
        {

            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == email);
            var isOnline = db.account.FirstOrDefault(x => x.IsOnline);
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
                Clients.User("admin@gmail.com").onConnected(id, email,ConnectedUser);
            }
            else
            {
                item.ConnectionId = id;
                var itemMsg = db.messages.ToList().Where(x => x.FromEmail == email);
                foreach (var i in itemMsg)
                {
                    i.FromConnectionId = id;
                }
                db.SaveChanges();
                Clients.User("admin@gmail.com").onConnected(id, email, ConnectedUser);

            }
            
        }

        /// <summary>
        /// gui tin nhan cho admin
        /// </summary>
        public void SendMsg(string fromEmail, string toEmail, string msg)
        {
            MessageDb messageDb = new MessageDb();
            var createDate = DateTime.Today;
            messageDb.AddMessage(fromEmail, toEmail, msg, createDate);

            var connectionId = Context.ConnectionId;

            Clients.User("admin@gmail.com").SendMsgForAdmin(msg, createDate, connectionId);


        }

        public void SendPrivateMessage(string from)
        {

        }
        public void LoadMsgOfClient(string email)
        {
            var item = db.account.FirstOrDefault(x => x.Email == email);
            if (item != null)
            {
                var msg = db.messages.ToList().Where(x => x.FromConnectionId == Context.ConnectionId || x.ToEmail == email);
                string listMsg = new JavaScriptSerializer().Serialize(msg);
                Clients.Caller.LoadAllMsgOfClient(listMsg);
            }
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = db.account.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                item.IsOnline = false;
                db.SaveChanges();
            }
            // Add your own code here.
            // For example: in a chat application, mark the user as offline, 
            // delete the association between the current connection id and user name.
            return base.OnDisconnected(stopCalled);
        }
    }
}