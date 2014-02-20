using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace NTodo
{
    public class MainBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
            container.Register<INTodoService>(new NTodoServiceForTest());
        }
    }
}