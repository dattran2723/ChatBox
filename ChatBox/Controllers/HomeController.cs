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
    public class HomeController : Controller
    {
        public ApplicationDbContext db = new ApplicationDbContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult ManageChat()
        {
            var user = db.account.OrderByDescending(x => x.IsOnline).ToList();
            List<UserViewModel> listUser = new List<UserViewModel>();
            MessageDb messageDb = new MessageDb();
            foreach (var item in user)
            {
                UserViewModel userView = new UserViewModel();
                userView.ConnectionId = item.ConnectionId;
                userView.Email = item.Email;
                userView.IsOnline = item.IsOnline;
                userView.LastMsg = messageDb.GetLastMessageByEmail(item.Email);
                listUser.Add(userView);
            }
            return View(listUser);
        }

    }
}