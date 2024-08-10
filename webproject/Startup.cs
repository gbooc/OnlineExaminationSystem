using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(webproject.Startup))]
namespace webproject
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
