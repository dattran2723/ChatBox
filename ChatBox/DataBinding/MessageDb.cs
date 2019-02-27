using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Script.Serialization;

namespace ChatBox.DataBinding
{
    public class MessageDb
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        public static List<Message> listMessages = new List<Message>();
        public Chater chater = new Chater();
        /// <summary>
        /// 
        /// </summary>
        /// <param name="fromEmail"></param>
        /// <param name="toEmail"></param>
        /// <param name="msg"></param>
        /// <param name="id"></param>
        /// <param name="createDate"></param>
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
            if (listMessages.Count() == 1)
                HostingEnvironment.QueueBackgroundWorkItem(ct => AddListMessageIntoDb());
        }
        /// <summary>
        /// tao 1 list de chua cac msg co FromEmail hay ToEmail == email truyen vao do
        /// </summary>
        /// <param name="email">email truyen vao</param>
        /// <returns>list tin nhan da tra ve kieu JSON</returns>
        public string GetMessagesByEmail(string email)
        {
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

        /// <summary>
        /// lấy tin nhắn cuối cùng của email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public string GetLastMessageByEmail(string email)
        {
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

        public void AddListMessageIntoDb()
        {
            Thread.Sleep(30000);
            List<Message> list = listMessages;
            listMessages = new List<Message>();

            foreach (var item in list)
            {
                db.messages.Add(item);
                db.SaveChanges();
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

        public void UpdateIsReadMessage(string email, bool adRead)
        {
            //update in database
            IEnumerable<Message> messages;
            if (adRead == true)
                messages = db.messages.ToList().Where(x => x.FromEmail == email && x.IsRead == false);
            else
                messages = db.messages.ToList().Where(x => x.ToEmail == email && x.IsRead == false);
            foreach (var item in messages)
            {
                item.IsRead = true;
                item.DateRead = DateTime.Now;
            }
            db.SaveChanges();
            //update in list messages
            if (adRead == true)
                messages = listMessages.ToList().Where(x => x.FromEmail == email && x.IsRead == false);
            else
                messages = listMessages.ToList().Where(x => x.ToEmail == email && x.IsRead == false);
            foreach (var item in messages)
            {
                item.IsRead = true;
                item.DateRead = DateTime.Now;
            }

        }
    }
}