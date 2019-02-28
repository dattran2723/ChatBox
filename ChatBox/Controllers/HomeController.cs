using ChatBox.DataBinding;
using ChatBox.Models;
using ChatBox.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChatBox.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        [AllowAnonymous]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
        public ActionResult ManageChat()
        {
            //var user = db.account.OrderByDescending(x => x.IsOnline).ToList();
            Chater chater = new Chater();
            List<User> list = chater.GetAllUser();
            List<UserViewModel> listUser = new List<UserViewModel>();
            MessageDb messageDb = new MessageDb();
            foreach (var item in list)
            {
                UserViewModel userView = new UserViewModel();
                userView.ConnectionId = item.ConnectionId;
                userView.Email = item.Email;
                userView.IsOnline = item.IsOnline;
                userView.LastMsg = messageDb.GetLastMessageByEmail(item.Email).Msg;
                listUser.Add(userView);
            }
            return View(listUser);
        }
        [AllowAnonymous]
        public ActionResult Test()
        {
            return View();
        }

        public ActionResult Chat()
        {
            Chater chater = new Chater();
            List<User> list = chater.GetAllUser();
            List<UserViewModel> listUser = new List<UserViewModel>();
            MessageDb messageDb = new MessageDb();
            foreach (var item in list)
            {
                UserViewModel userView = new UserViewModel();
                Message message = messageDb.GetLastMessageByEmail(item.Email);

                userView.ConnectionId = item.ConnectionId;
                userView.Email = item.Email;
                userView.IsOnline = item.IsOnline;
                userView.LastMsg = message.Msg;
                userView.DateSend = messageDb.GetStringDateOfLastMessage(message);
                userView.IsRead = message.IsRead;
                listUser.Add(userView);
            }
            return View(listUser);
        }
    }
}