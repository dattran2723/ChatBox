using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Hosting;

namespace ChatBox.DataBinding
{
    public class Chater
    {
        public static List<User> listUser = new List<User>();
        public ApplicationDbContext db = new ApplicationDbContext();


        public void AddUser(string email, string id)
        {
            User user = new User
            {
                Id = Guid.NewGuid().ToString(),
                ConnectionId = id,
                Email = email.ToLower(),
                IsOnline = true,
                DateOnline = DateTime.Now
            };
            listUser.Add(user);
            if(listUser.Count() ==1)
                HostingEnvironment.QueueBackgroundWorkItem(ct => AddListUserIntoDb());

        }

        public void AddListUserIntoDb()
        {
            Thread.Sleep(30000);
            List<User> list = listUser;
            listUser = new List<User>();

            foreach (var item in list)
            {
                db.account.Add(item);
                db.SaveChanges();
            }
        }

        public List<User> GetAllUser()
        {
            List<User> users = new List<User>();
            var listFromList = listUser.ToList().OrderByDescending(x => x.DateOnline);
            if (listFromList.Count() > 0)
                foreach (var item in listFromList)
                {
                    users.Add(item);
                }
            var listFromDb = db.account.ToList().OrderByDescending(x => x.DateOnline);
            if (listFromDb.Count() > 0)
                foreach (var item in listFromDb)
                {
                    users.Add(item);
                }
            return users;
        }

        public User GetUser(string email)
        {
            User user;
            user = listUser.FirstOrDefault(x => x.Email == email.ToLower());
            if (user == null)
                user = db.account.FirstOrDefault(x => x.Email == email.ToLower());
            return user;
        }

        public void UpdateIsOnlineOfUser(string email, bool isOnline)
        {
            User user;
            user = listUser.FirstOrDefault(x => x.Email == email.ToLower());
            if(user != null)
            {
                user.IsOnline = isOnline;
                user.DateOnline = isOnline == true ? DateTime.Now : user.DateOnline; 
            }
            else
            {
                user = db.account.FirstOrDefault(x => x.Email == email.ToLower());
                if (user != null)
                {
                    user.IsOnline = isOnline;
                    user.DateOnline = isOnline == true ? DateTime.Now : user.DateOnline;
                    db.SaveChanges();
                }
            }

        }

        public void UpdateConnectionId(string email, string id)
        {
            User user;
            user = listUser.FirstOrDefault(x => x.Email == email.ToLower());
            if (user != null)
            {
                user.ConnectionId = id;
            }
            else
            {
                user = db.account.FirstOrDefault(x => x.Email == email.ToLower());
                if (user != null)
                {
                    user.ConnectionId = id;
                    db.SaveChanges();
                }
            }
        }

        public User GetUserByConnectionId(string id)
        {
            User user;
            user = listUser.FirstOrDefault(x => x.ConnectionId == id);
            if (user == null)
                user = db.account.FirstOrDefault(x => x.ConnectionId == id);
            return user;
        }
    }
}