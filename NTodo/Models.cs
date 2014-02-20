using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NTodo
{
    public class TodoComment
    {
        public long ParentId { get; set; }

        public int CommentNo { get; set; }

        public string CommentBody { get; set; }
    }

    public class TodoItem
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Detail { get; set; }

        public bool Finished { get; set; }

        public DateTime Limit { get; set; }
    }
}