using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
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
    }
}
