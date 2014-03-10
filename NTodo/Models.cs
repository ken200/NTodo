using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NTodo
{
    public class TodoItem
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public bool Finished { get; set; }

        public DateTime Limit { get; set; }
    }

    public class TodoItemDetail
    {
        public long Id { get; set; }

        public string DetailBody { get; set; }

        public IEnumerable<TodoComment> Comments { get; set; }
    }

    public class TodoComment
    {
        public long ParentId { get; set; }

        public int CommentNo { get; set; }

        public string CommentBody { get; set; }
    }
}