using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using NTodo;

namespace NTodoTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var todoService = new NTodoService();
            var detail = todoService.GetTodoDetail(1);

            foreach (var item in detail.Comments)
            {
                Console.WriteLine("id:" + item.CommentNo);
            }

            Assert.AreEqual(0, 0);
        }

        [TestMethod]
        public void パラメーター付GetTodoItemsメソッドの動作確認()
        {
            var todoService = new NTodoService();
            foreach (var item in todoService.GetTodoItems(10, "1"))
            {
                System.Diagnostics.Trace.WriteLine("id:" + item.Id);
            }
            Assert.AreEqual(0, 0);
        }
    }
}
