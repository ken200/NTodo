$(function () {
    $(".regist-task-list-item").click(function () {
        //todo: 詳細エリアに値設定

        /*
        コメントの取得

        url: /status/comment/{id}
        method: POST：追加・更新、GET：取得、DELETE：削除
        parameater: {commentbody : ＜コメント文＞}

        */

        var hiddenCtrl = $(":hidden", this);

        var data = function (dataName) {
            return function (ctrl) {
                return ctrl.data(dataName);

                $("li:eq(" + ele[0] + ")", detailRoot).text(ele[1](hidden));

            }
        };

        $.ajax({
            type: type,
            url: url,
            cache: false,
            async: false,
            data: data,
            timeout: 5000
        }).done(function (data) {

            var detail = function (idx) {
                return [idx,
                    function () {
                        return function (ctrl) { return "詳細詳細"; }
                    }
                ];
            };

            var comments = function () {
                
            };

            /**
            * タスク詳細情報に情報セットする
            */
            var setTaskDetailFromListHidden = function (hidden) {
                _.each([[1, data("title")], detail(3), [5, data("limit")], detail.getComments(7)], (function () {
                    var detailRoot = $("#task-detail");
                    return function (ele, idx, list) {
                        $("li:eq(" + ele[0] + ")", detailRoot).text(ele[1](hidden));
                    };
                })());
            };

            setTaskDetailFromListHidden(hiddenCtrl);
        });
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