using System;
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

            Get["/status/{id:int}"] = p =>
            {
                int todoId = p.id;
                return Response.AsJson<TodoItemDetail>(service.GetTodoDetail(todoId), HttpStatusCode.OK);
            };

            //今は「コメントの更新用API」を設けているが、
            //他項目のAPIが必要になれば「TODOアイテムの更新用API」に集約する方向で考えている。

            Post["/status/{id:int}/comments"] = p =>
            {
                ////パラメーターの取得
                //int todoId = p.id;
                //string comment = Request.Form.comment;
                return HttpStatusCode.OK;
            };
        }
    }

    public interface INTodoService
    {
        IEnumerable<TodoItem> GetTodoItems();
        TodoItemDetail GetTodoDetail(int todoId);
    }

    public class NTodoServiceForTest : INTodoService
    {
        private Random rnd = new Random();

        public IEnumerable<TodoItem> GetTodoItems()
        {
            return Enumerable.Range(1, 20)
                    .Select<int, TodoItem>((i) => {
                        var item = new TodoItem()
                        {
                            Id = i,
                            Title = string.Format("Todoアイテムその{0}", i),
                            Limit = new DateTime(2014, 2, 1).AddDays(i),
                        };
                        return item;
                    });
        }

        public TodoItemDetail GetTodoDetail(int todoId)
        {
            return new TodoItemDetail()
            {
                Id = todoId,
                DetailBody = @"タスク詳細タスク詳細タスク詳細
 タスク詳細タスク詳細
  タスク詳細
   タスク詳細タスク詳細
    タスク詳細タスク詳細タスク詳細ｓ
     タスク詳細タスク詳細タスク詳細タスク詳細
",
                Comments = Enumerable.Range(1, 8)
                        .Select<int, TodoComment>((i) =>
                        {
                            var item = new TodoComment()
                            {
                                CommentNo = i,
                                CommentBody = string.Format("タスク{0}のコメント{1}", todoId, i)
                            };
                            return item;
                        })
            };
        }
    }
}