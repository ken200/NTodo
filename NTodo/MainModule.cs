﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using Nancy.ModelBinding;

namespace NTodo
{
    public class MainModule :NancyModule
    {
        private INTodoService service;

        private void TraceLog(string msg)
        {
            Context.Trace.TraceLog.WriteLog((sb) => sb.Append(msg));
        }

        private void TraceLog(string format, params char[] p)
        {
            Context.Trace.TraceLog.WriteLog((sb) => sb.AppendFormat(format, p));
        }

        public MainModule(INTodoService service) : base()
        {
            this.service = service;

            Get["/"] = _ =>
            {
                return View["Index", service.GetTodoItems()];
            };
        }
    }

    public class ApiModule : NancyModule
    {
        public ApiModule(INTodoService service) : base("/api")
        {
            Get["status/all"] = _ =>
            {
                int top = 100;  //todo:パラメーター指定できるようにする
                return Response.AsJson<IEnumerable<TodoItem>>(service.GetTodoItems().Take(top), HttpStatusCode.OK);
            };

            Get["/status/{id:int}"] = p =>
            {
                int todoId = p.id;
                return Response.AsJson<TodoItemDetail>(service.GetTodoDetail(todoId), HttpStatusCode.OK);
            };

            //今は「コメントの更新用API」を設けているが、
            //他項目のAPIが必要になれば「TODOアイテムの更新用API」に集約する方向で考えている。

            Post["/status/{id:int}/comments"] = p =>
            {
                int todoId = p.id;
                var comment = this.Bind<TodoComment>();
                service.AddComment(todoId, comment.CommentBody);
                return HttpStatusCode.OK;
            };
        }
    }
}