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
        }
    }
}