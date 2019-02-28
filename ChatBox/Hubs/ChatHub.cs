using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChatBox.DataBinding;
using System.Web.Script.Serialization;
using ChatBox.Models;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Threading;
using System.Diagnostics;

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        public static List<User> listUser = new List<User>();
        MessageDb messageDb = new MessageDb();
        Chater chater = new Chater();
        string emailAdmin = WebConfigurationManager.AppSettings["EmaillAdmin"];
        public void Connect(string email)
        {
            bool checkExist;
            /// id = lấy ra chuỗi kết nối hiện tại của trình duyệt
            var id = Context.ConnectionId;
            /// lấy ra tài khoản 
            var item = chater.GetUser(email);
            /// chưa có tài khoản , tạo mới
            if (item == null)
            {
                listUser.Add(new User
                {
                    Id = Guid.NewGuid().ToString(),
                    ConnectionId = id,
                    Email = email.ToLower(),
                    IsOnline = true
                });
                chater.AddUser(email, id);
                checkExist = false;
                Clients.User(emailAdmin).onConnected(id, email.ToLower(), checkExist);
                Clients.Client(Context.ConnectionId).SendConnection(id, email.ToLower());

            }
            /// đã có tài khoản
            else
            {
                ///nếu đang đăng nhập vào trình duyệt cũ , bật một tab mới
                if (item.ConnectionId != id && item.IsOnline == true)
                {
                    Clients.Caller.CheckIsOnline();
                }
                else
                ///có tài khoản email rồi và đang offline
                {
                    chater.UpdateConnectionId(email, id);
                    chater.UpdateIsOnlineOfUser(email, true);
                    //user.ConnectionId = id;
                    //user.IsOnline = true;
                    //var ModelMsg = db.messages.ToList().Where(x => x.FromEmail == email.ToLower());
                    //foreach (var itemMsg in ModelMsg)
                    //itemMsg.FromConnectionId = id;
                    messageDb.UpdateFromConnectionId(email, id);
                    checkExist = true;
                    //db.SaveChanges();
                    Clients.User(emailAdmin).onConnected(id, email.ToLower(), checkExist);
                    Clients.Client(Context.ConnectionId).SendConnection(id, email.ToLower());
                }
            }
        }

        public void ChangeTab(string email)
        {
            var id = Context.ConnectionId;
            var item = chater.GetUser(email);
            //var item = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            //item.ConnectionId = id;
            chater.UpdateConnectionId(email, id);
            //db.SaveChanges();
            Clients.User(emailAdmin).onConnected(item.ConnectionId, email.ToLower());
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
            var item = chater.GetUser(fromEmail);
            //var item = listUser.FirstOrDefault(x => x.Email == fromEmail);
            //var item = db.account.FirstOrDefault(x => x.Email == fromEmail);
            //kiem tra id ket noi hien tai co dung voi ConnectionId cua 1 email nhap vao khong
            if (id == item.ConnectionId)
            {
                MessageDb messageDb = new MessageDb();
                var createDate = DateTime.Now;                
                messageDb.AddMessage(fromEmail, toEmail, msg, id, createDate);
                var connectionId = Context.ConnectionId;
                Clients.User("admin@gmail.com").SendMsgForAdmin(msg, createDate, connectionId, fromEmail);
            }
            //truong hoi Id khong dung voi ConnectionId thi tra ve result va 'thong bao ket noi bi ngat'
            else
            {
                Clients.Client(Context.ConnectionId).SendError();
            }
        }

        /// <summary>
        /// Admin gửi mail cho client
        /// lưu vào cơ sở dữ liệu và gửi đến cho client
        /// </summary>
        /// <param name="toEmail">email nhận tin nhắn</param>
        /// <param name="msg">nội dung tin nhắn</param>
        /// <param name="connectionId">connectionId nhận tin nhắn</param>
        public void SendPrivateMessage(string toEmail, string msg, string connectionId)
        {
            var createDate = DateTime.Now;
            var fromEmail = "admin@gmail.com";
            messageDb.AddMessage(fromEmail.ToLower(), toEmail.ToLower(), msg, connectionId, createDate);
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
        /// <summary>
        /// Load tất cả các danh sách tin nhắn của email truyền vào và gửi về cho admin
        /// </summary>
        /// <param name="email"></param>
        public void LoadMsgByEmailOfAdmin(string email)
        {
            string listMsg = messageDb.GetMessagesByEmail(email.ToLower());
            Clients.User(emailAdmin).loadAllMsgByEmailOfAdmin(listMsg);
        }

        public void UpdateIsReadMessage(string connectionId, string email, bool adRead)
        {
            messageDb.UpdateIsReadMessage(email, adRead);
            if (adRead == true)
                Clients.Client(connectionId).AdminReaded();
            else
                Clients.User(emailAdmin).ClientReaded();
        }
        /// <summary>
        /// khi co su thay doi ConnectionID cua trinh duyet thi kiem tra
        /// Neu dung thi gan IsOnline == false de xu ly ben giao dien
        /// </summary>
        /// <param name="stopCalled"></param>
        /// <returns></returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            //var item = db.account.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            //var item = listUser.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            var item = chater.GetUserByConnectionId(Context.ConnectionId);
            if (item != null)
            {
                Clients.User(emailAdmin).OnUserDisconnected(item.Email.ToLower());
                //item.IsOnline = false;
                chater.UpdateIsOnlineOfUser(item.Email, false);
            }
            return base.OnDisconnected(stopCalled);
        }
    }
}