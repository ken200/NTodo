$(function () {
    $(".regist-task-list-item").click(function () {
        //todo: 詳細エリアに値設定

        /*
        コメントの取得

        url: /status/comment/{id}
        method: POST：追加・更新、GET：取得、DELETE：削除
        parameater: {commentbody : ＜コメント文＞}

        */


        //<li class="regist-task-list-item">
        //    <p>
        //    <input type="checkbox" style="margin-right:30px;" />
        //    <span style="@(overLimitCSS)">@(item.Title)</span>
        //    </p>
        //    <input type="hidden" name="taskid" value="@(item.Id)"></input>
        //</li>




    });

    $("#dialog-form").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: [
            {
                text: "OK",
                click: function () {
                    if (_.isEmpty($("#comment", this).val())) {
                        alert("未入力です。");
                        return;
                    }
                    /*
                    todo: コメントの追加

                    url: /status/comment/{id}
                    method: POST：追加・更新、GET：取得、DELETE：削除
                    parameater: {commentbody : ＜コメント文＞}
                    */
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });

    $("#comment-add-button").click(function () {
        $("#dialog-form").dialog("open");
    });
});