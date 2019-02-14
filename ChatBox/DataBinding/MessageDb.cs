using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
    }
}