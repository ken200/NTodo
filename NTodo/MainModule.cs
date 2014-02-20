using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace NTodo
{
    public class MainModule :NancyModule
    {
        private INTodoService service;

        public MainModule(INTodoService service) : base()
        {
            this.service = service;

            Get["/"] = _ =>
            {
                return View["Index", service.GetTodoItems()];
            };


            Get["/status/comment/{id:int}"] = p =>
            {
                int todoId = p.id;
                return Response.AsJson<IEnumerable<TodoComment>>(service.GetTodoComments(todoId), HttpStatusCode.OK);
            };
        }
    }

    public interface INTodoService
    {
        IEnumerable<TodoItem> GetTodoItems();
        IEnumerable<TodoComment> GetTodoComments(int todoId);
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
                            Detail = string.Format("詳細その{0}", i),
                            Limit = new DateTime(2014, 2, 1).AddDays(i),
                        };
                        return item;
                    });
        }

        public IEnumerable<TodoComment> GetTodoComments(int todoId)
        {
            return Enumerable.Range(1, todoId)
                    .Select<int, TodoComment>((i) =>
                    {
                        var item = new TodoComment()
                        {
                            ParentId = todoId,
                            CommentNo = i,
                            CommentBody = string.Format("コメント{0}",i)
                        };
                        return item;
                    });   
        }
    }
}