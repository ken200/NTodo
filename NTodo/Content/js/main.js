//$(function () {
//    var taskDetailView = ntodo.views.taskDetailView;

//    $(".regist-task-list-item").click(function () {
//        taskDetailView.clear();
//        var hidden = $(":hidden", this);
//        $.ajax({
//            type: "GET",
//            url: "/status/" + hidden.val(),
//            timeout: 5000,
//            cache: false
//        }).done(function (data) {
//            taskDetailView.init({
//                title: hidden.data("title"),
//                detail: data.detailBody,
//                limit: hidden.data("limit"),
//                comments: data.comments,
//                id : hidden.val()
//            });
//        }).fail(function () {
//            console.log("エラー");
//        });
//    });

//    $("#dialog-form").dialog({
//        autoOpen: false,
//        height: 180,
//        width: 280,
//        modal: true,
//        buttons: [
//            {
//                text: "OK",
//                click: function () {
//                    var val = $("#comment", this).val();
//                    if (_.isEmpty(val)) {
//                        alert("未入力です。");
//                        return;
//                    }

//                    $.ajax({
//                        type: "POST",
//                        url: "/status/" + taskDetailView.bag.id + "/comments",
//                        timeout: 5000,
//                        data : {
//                            comment : val
//                        }
//                    }).done(function (data) {
//                        taskDetailView.addComments(val);
//                    }).fail(function () {
//                        alert("エラー");
//                    });

//                    $("#comment", this).val("");
//                    $(this).dialog("close");
//                }
//            },
//            {
//                text: "Cancel",
//                click: function () {
//                    $(this).dialog("close");
//                }
//            }
//        ]
//    });

//    $("#comment-add-button").click(function () {
//        $("#dialog-form").dialog("open");
//    });
//});


var app = angular.module("app", ["ngRoute"]);


app.controller("tasklistCtrl", ["$scope", "$http", function ($scope, $http) {
    $http.get("/api/status/all").success(function (data, code) {
        $scope.items = data;
    }).error(function (error) {
        alert("エラー：" + error);
    });

    /**
    * タスクの期限切れ確認
    * @param {date} limit
    * @return {bool} true:現在日付より前、false:現在日付と同じかそれ以降
    */
    $scope.isLimitOver = function (limit) {

        console.log("リミットオーバー:", limit);

        var getYMD = function (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };
        var limitYMD = getYMD(limit);
        var nowYMD = getYMD(new Date("2013/4/26"));  //memo: テスト用
        return nowYMD.getTime() > limitYMD.getTime();
    };

}]);
