using ChatBox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
                IsOnline = true
            };
            listUser.Add(user);
            db.account.Add(user);
            db.SaveChanges();

        }

        public List<User> GetAllUser()
        {
            var list = listUser.OrderByDescending(x => x.IsOnline).ToList();
            return list;
        }

        public User GetUser(string email)
        {
            var user = listUser.FirstOrDefault(x => x.Email == email.ToLower());
            return user;
        }

        public void UpdateIsOnlineOfUser(string email, bool isOnline)
        {
            var user = GetUser(email);
            user.IsOnline = isOnline;
        }

        public void UpdateConnectionId(string email, string id)
        {
            var user = GetUser(email);
            user.ConnectionId = id;

            
        }

        public User GetUserByConnectionId(string id)
        {
            var user = listUser.FirstOrDefault(x => x.ConnectionId == id);
            return user;
        }
    }
}