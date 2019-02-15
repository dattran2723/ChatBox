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
            var item = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            if (item == null)
            {
                db.account.Add(new User
                {
                    Id = Guid.NewGuid().ToString(),
                    ConnectionId = id,
                    Email = email.ToLower(),
                    IsOnline = true
                });
                db.SaveChanges();
                Clients.User("admin@gmail.com").onConnected(id, email.ToLower(), "true");
            }
            else
            {
                if (item.ConnectionId != id && item.IsOnline == true)
                {
                    var a = true;
                    Clients.Caller.CheckIsOnline(a);                    
                }
                else
                {
                    item.ConnectionId = id;
                    item.IsOnline = true;
                    var itemMsg = db.messages.ToList().Where(x => x.FromEmail == email.ToLower());
                    foreach (var i in itemMsg)
                    {
                        i.FromConnectionId = id;
                    }
                    db.SaveChanges();
                }
            }
        }
        public void ChangeTab(string email)
        {
            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            item.ConnectionId = id;
            db.SaveChanges();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fromEmail">tu 1 email nguoi dung nhap vao</param>
        /// <param name="toEmail">gui den email cua admin</param>
        /// <param name="msg">tin nhan nguoi dung nhap vao</param>
        public void SendMsg(string fromEmail, string toEmail, string msg)
        {
            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == fromEmail);
            //kiem tra id ket noi hien tai co dung voi ConnectionId cua 1 email nhap vao khong
            if (id == item.ConnectionId)
            {
                MessageDb messageDb = new MessageDb();
                var createDate = DateTime.Now;
                messageDb.AddMessage(fromEmail, toEmail, msg, createDate);

                var connectionId = Context.ConnectionId;

                Clients.User("admin@gmail.com").SendMsgForAdmin(msg, createDate, connectionId, fromEmail);
            }
            //truong hoi Id khong dung voi ConnectionId thi tra ve result va 'thong bao ket noi bi ngat'
            else
            {
                var check = true;
                Clients.Client(Context.ConnectionId).SendError(check);
            }
            
        }

        public void SendPrivateMessage(string toEmail, string msg, string connectionId)
        {
            var createDate = DateTime.Now;
            var fromEmail = "admin@gmail.com";
            messageDb.AddMessage(fromEmail.ToLower(), toEmail.ToLower(), msg, createDate);
            Clients.Client(connectionId).AdminSendMsg(msg);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="email">email nguoi dung truyen vao</param>
        public void LoadMsgOfClient(string email)
        {
            string listMsg = messageDb.GetMessagesByEmail(email.ToLower());
            Clients.Caller.LoadAllMsgOfClient(listMsg);
        }

        public void LoadMsgByEmailOfAdmin(string email)
        {

            string listMsg = messageDb.GetMessagesByEmail(email.ToLower());
            Clients.User("admin@gmail.com").loadAllMsgByEmailOfAdmin(listMsg);
        }
        /// <summary>
        /// khi co su thay doi ConnectionID cua trinh duyet thi kiem tra
        /// Neu dung thi gan IsOnline == false de xu ly ben giao dien
        /// </summary>
        /// <param name="stopCalled"></param>
        /// <returns></returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = db.account.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                item.IsOnline = false;
                db.SaveChanges();
                Clients.User("admin@gmail.com").OnUserDisconnected(item.Email.ToLower(), item.IsOnline, item.ConnectionId);
            }
            return base.OnDisconnected(stopCalled);
        }
    }
}