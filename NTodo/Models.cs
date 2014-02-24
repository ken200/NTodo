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
        /// <summary>
        /// 対応するTodoItemのID
        /// </summary>
        public long Id { get; set; }

        public string DetailBody { get; set; }

        public IEnumerable<TodoComment> Comments { get; set; }
    }

    public class TodoComment
    {
        public int CommentNo { get; set; }

        public string CommentBody { get; set; }
    }
}