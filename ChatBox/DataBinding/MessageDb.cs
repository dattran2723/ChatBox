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
        public static List<Message> listMessages = new List<Message>();
        public Chater chater = new Chater();

        public void AddMessage(string fromEmail, string toEmail, string msg, string id, DateTime createDate)
        {
            var item = new Message
            {
                Id = Guid.NewGuid().ToString(),
                FromConnectionId = id,
                FromEmail = fromEmail.ToLower(),
                ToEmail = toEmail.ToLower(),
                Msg = msg,
                DateSend = createDate,
                IsRead = false
            };
            listMessages.Add(item);
            //db.messages.Add(item);
            //db.SaveChanges();
        }
        /// <summary>
        /// tao 1 list de chua cac msg co FromEmail hay ToEmail == email truyen vao do
        /// </summary>
        /// <param name="email">email truyen vao</param>
        /// <returns>list tin nhan da tra ve kieu JSON</returns>
        public string GetMessagesByEmail(string email)
        {
            //string listMsg = string.Empty;
            ////var item = db.account.FirstOrDefault(x => x.Email == email);
            //var item = chater.GetUser(email);
            //List<Message> messages = new List<Message>();
            //if (item != null)
            //{
            //    var msg = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
            //    listMsg = new JavaScriptSerializer().Serialize(msg);
            //    foreach (var ms in msg)
            //    {
            //        messages.Add(ms);
            //    }
            //}
            //var m = listMessages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
            //listMsg += new JavaScriptSerializer().Serialize(m);
            //return listMsg;
            List<Message> listMsg = new List<Message>();
            var user = chater.GetUser(email);
            if (user != null)
            {
                var Msgs = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
                if (Msgs.Count() > 0)
                {
                    foreach (var message in Msgs)
                    {
                        listMsg.Add(message);
                    }
                }

                var messages = listMessages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
                if (messages.Count() > 0)
                {
                    foreach (var message in messages)
                    {
                        listMsg.Add(message);
                    }
                }
            }

            return new JavaScriptSerializer().Serialize(listMsg);
        }

        public string GetLastMessageByEmail(string email)
        {
            //var message = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
            //var last = message.LastOrDefault();
            //var msg = "";
            //if (last != null)
            //    msg = last.Msg;
            //return msg;
            Message message = new Message();
            var messages = listMessages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
            if (messages.Count() > 0)
            {
                message = messages.LastOrDefault();
            }
            else
            {
                var msgs = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email).OrderBy(x => x.DateSend);
                if (msgs.Count() > 0)
                    message = msgs.LastOrDefault();
            }
            return message.Msg;
        }

        public void AddListMessageIntoDb(string email)
        {
            List<Message> list = new List<Message>();
            foreach (var item in listMessages)
            {
                if (item.FromEmail == email || item.ToEmail == email)
                {
                    var d = db.messages.Add(item);
                    db.SaveChanges();
                    list.Add(item);
                }
            }
            foreach (var item in list)
            {
                listMessages.Remove(item);
            }

        }
        public void UpdateFromConnectionId(string email, string id)
        {
            var messages = db.messages.ToList().Where(x => x.FromEmail == email || x.ToEmail == email);
            foreach (var item in messages)
            {
                item.FromConnectionId = id;
            }
            db.SaveChanges();
        }

    }
}