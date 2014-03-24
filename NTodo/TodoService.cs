using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data.Common;
using System.Data.SqlClient;

namespace NTodo
{
    public interface INTodoService
    {
        IEnumerable<TodoItem> GetTodoItems();
        TodoItemDetail GetTodoDetail(int todoId);
        void AddComment(int todoId, string commentBody);
    }

    public class NTodoService : INTodoService
    {
        private string conString = @"Data Source=(LocalDB)\v11.0;AttachDbFilename=Z:\git_repo\ntodo\NTodo\App_Data\Database1.mdf;Integrated Security=True";

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(conString);
        }

        public IEnumerable<TodoItem> GetTodoItems()
        {
            var con = CreateConnection();
            return con.Query("select id, title, finished, limit, detail from todoitem order by id").Select((item) => 
            {
                string detail = item.detail;
                var summary = detail.Take(20).Aggregate<char, string>("", (memo, c) => memo + c);
                return new TodoItem()
                {
                    Id = item.id,
                    Title = item.title,
                    Finished = item.finished,
                    Limit = item.limit,
                    DetailSummary = summary + (detail == summary ? "" : "...")
                };
            });
        }

        public TodoItemDetail GetTodoDetail(int todoId)
        {
            var sql = @"
select id, detail as detailbody from todoitem where id = @TODO_ID;

select parentid, commentno, commentbody 
from (select c.* from TodoItem t inner join TodoComment c on t.id = c.parentid where t.id = @TODO_ID) as TodoComment;";

            var con = CreateConnection();
            using(var multi = con.QueryMultiple(sql, new{TODO_ID = todoId}))
            {
                var detail = multi.Read().First();
                var comments = multi.Read<TodoComment>().Take(20);

                return new TodoItemDetail()
                {
                    Id = detail.id,
                    DetailBody = detail.detailbody,
                    Comments = comments
                };
            }
        }

        public void AddComment(int todoId, string commentBody)
        {
            using(var con = CreateConnection())
            {
                con.Open();
                var tran = con.BeginTransaction();
                try
                {
                    //todo:これ同時更新したらやばくない？

                    var cnoSql = "select count(*) + 1 as nextno from todocomment where parentid = @ID;";
                    var nextCommentNo = con.Query<int>(cnoSql, new { ID = todoId }, tran).First();

                    var insSql = @"
insert into todocomment(parentid, commentno, commentbody, deleteflg)values(@ID, @COMMENT_NO, @BODY, 0);";
                    con.Execute(insSql, new { ID = todoId, COMMENT_NO = nextCommentNo, BODY = commentBody }, tran);
                }
                catch
                {
                    tran.Rollback();
                    throw;
                }
                tran.Commit();
            }
        }
    }
}