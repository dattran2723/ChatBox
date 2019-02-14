using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace ChatBox.DataBinding
{
    public class MessageDb
    {

        public ApplicationDbContext db = new ApplicationDbContext();
        
        public void AddMessage(string fromEmail, string toEmail, string msg, DateTime createDate)
        {
            var item = new Message
            {
                Id = Guid.NewGuid().ToString(),
                FromEmail = fromEmail,
                ToEmail = toEmail,
                Msg = msg,
                DateSend = createDate
            };
            db.messages.Add(item);
            db.SaveChanges();
        }
        public string GetMessagesByEmail(string email)
        {
            string listMsg = string.Empty;
            var item = db.account.FirstOrDefault(x => x.Email == email);
            if (item != null)
            {
                var msg = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x=>x.DateSend);
                listMsg = new JavaScriptSerializer().Serialize(msg);
            }
            return listMsg;
        }

        public string GetLastMessageByEmail(string email)
        {
            var message = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
            var last = message.LastOrDefault();
            var msg = "";
            if (last != null)
                msg = last.Msg;
            return msg;
        }
    }
}