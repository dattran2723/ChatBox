using ChatBox.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ChatBox.Startup))]
namespace ChatBox
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateAccountDefault();
            app.MapSignalR();
        }
        public void CreateAccountDefault()
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            var existUser = userManager.FindByEmail("admin@gmail.com");
            if (existUser == null)
            {
                var user = new ApplicationUser();
                user.UserName = "admin@gmail.com";
                user.EmailConfirmed = true;
                user.PhoneNumberConfirmed = true;
                user.Email = "admin@gmail.com";
                string password = "admin123";

                userManager.Create(user, password);
            }
        }
    }
}
