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

namespace ChatBox.Hubs
{
    public class ChatHub : Hub
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        MessageDb messageDb = new MessageDb();
        string emailAdmin = WebConfigurationManager.AppSettings["EmaillAdmin"];
        /// <summary>
        /// Hàm kết nối , để tạo mới hoặc đăng nhập vào email để chat
        /// </summary>
        /// <param name="email">email nhập vào từ form submit</param>
        public void Connect(string email)
        {
            bool checkExist;
            ///id = lấy ra chuỗi kết nối hiện tại của trình duyệt
            var id = Context.ConnectionId;                                      
            /// lấy ra tài khoản 
            var item = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            /// chưa có tài khoản , tạo mới
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
                checkExist = false;
                Clients.User(emailAdmin).onConnected(id, email.ToLower(), checkExist);
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
                    item.ConnectionId = id;
                    item.IsOnline = true;
                    var ModelMsg = db.messages.ToList().Where(x => x.FromEmail == email.ToLower());
                    foreach (var itemMsg in ModelMsg)
                        itemMsg.FromConnectionId = id;
                    db.SaveChanges();
                    checkExist = true;
                    Clients.User(emailAdmin).onConnected(id, email.ToLower(), checkExist);
                }
            }
        }
        public void ChangeTab(string email)
        {
            var id = Context.ConnectionId;
            var item = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            item.ConnectionId = id;
            db.SaveChanges();
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

        /// <summary>
        /// Load tất cả các danh sách tin nhắn của email truyền vào và gửi về cho admin
        /// </summary>
        /// <param name="email"></param>
        public void LoadMsgByEmailOfAdmin(string email)
        {

            string listMsg = messageDb.GetMessagesByEmail(email.ToLower());
            Clients.User(emailAdmin).loadAllMsgByEmailOfAdmin(listMsg);
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
                Clients.User(emailAdmin).OnUserDisconnected(item.Email.ToLower());
            }
            return base.OnDisconnected(stopCalled);
        }
    }
}