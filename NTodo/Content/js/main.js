(function () {

    var app = angular.module("app", ["ngRoute"]);

    /**
    * サービス登録 - TaskService
    */
    app.factory("taskService", ["$http", function ($http) {
        return new services.TaskService($http);
    }]);

    /**
    * 検索条件コントローラー
    */
    app.controller("searchFilterController", ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.sortFilterTypes = [
            {name : "期限の古い順", value : "Default", selected : true},
            { name: "期限の新しい順", value: "LimitDesc" }
        ];

        $scope.listFilterTypes = [
            { name: "すべて", value: "All", selected : true },
            { name: "完了済のみ", value: "FinishedOnly" },
            { name: "未完了のみ", value: "ProcessingOnly" }
        ];

        $scope.updateFilters = function () {
            $rootScope.$broadcast("UPDATE_FILTER", function(items){
                var sorter = filters.sortFilter($scope.sortFilter.value);
                var filter = filters.taskFilter($scope.listFilter.value);
                return sorter(filter(items));
            });
        };
    }]);

    /**
    * タスクリストコントローラー
    */
    app.controller("tasklistCtrl", ["taskService", "$rootScope", "$scope", function (taskService, $rootScope, $scope) {

        var _allItems = [];

        taskService.getAll().success(function (data, code) {
            _allItems = data;
            $scope.items = data;
        }).error(function (error) {
            alert("エラー");
            console.dir(error);
        });

        /**
        * タスクの期限切れ確認
        * @param {date} limit
        * @param {date} ifOverStyle 期限切れ時のスタイル
        * @param {date} ifNotOverStyle 期限切れではない場合のスタイル
        */
        $scope.isLimitOver = function (limit, ifOverStyle, ifNotOverStyle) {
            var limitYMD = utils.getYMD(new Date(limit));
            var nowYMD = utils.getYMD(new Date("2013/4/26"));  //memo: テスト用
            return nowYMD.getTime() > limitYMD.getTime() ? ifOverStyle : ifNotOverStyle;
        };

        /**
        * 期限までの残日数毎の各種定義
        * 「期限切れ」、「当日」、「期限切れが5日無い(残4日以下)」、「期限切れが5日以上あり」 でそれぞれ変えている
        */
        var limitInfos = (function () {
            var _find = function (limit) {
                var ld = utils.getLastDay(limit);
                var infos = [
                    { is: ld < 0, css: { color: "#E8105F" }, message: "期限切れ(" + Math.abs(ld) + "日経過)" },
                    { is: ld === 0, css: { color: "#AC41F2" }, message: "今日が期限日です！！" },
                    { is: ld >= 5, css: { color: "#034EFF" }, message: "あと" + ld + "日です。" },
                    { is: ld < 5, css: { color: "#0A7318" }, message: "あと" + ld + "日です。お早目に！" }
                ];
                return _.find(infos, function (i) { return i.is; });
            };
            return {
                find: _find
            };
        })();

        /**
        * 期限までの残日数に対応したスタイルの取得
        */
        $scope.getLastDayStyle = function (limit) {
            return limitInfos.find(limit || new Date()).css;
        };

        /**
        * 期限までの残日数に対応したメッセージの取得
        */
        $scope.getLastDayMessage = function (limit) {
            return limitInfos.find(limit || new Date()).message;
        };


        /**
        * タスクの詳細情報を表示
        * 「SHOW_TASKDETAIL」メッセージをブロードキャスト送信する
        *
        * @param {int} idx タスクIndex
        */
        $scope.showDetail = function (idx) {
            var item = $scope.items[idx];
            $rootScope.$broadcast("SHOW_TASKDETAIL", item);
        };

        $scope.$on("UPDATE_FILTER", function (event, filter) {
            $scope.items = filter(_allItems);
        });
    }]);


    /**
    * タスク詳細コントローラー
    */
    app.controller("taskDetailCtrl", ["taskService", "$scope", function (taskService, $scope) {

        console.log("init taskDetailCtrl");

        /**
        * 「SHOW_TASKDETAIL」メッセージ受信時処理（タスク詳細の表示）
        */
        $scope.$on("SHOW_TASKDETAIL", function (event, data) {
            taskService.getDetail(data.id).success(function (data, code) {
                $scope.taskId = data.id;
                $scope.taskDetail = data.detailBody;
                $scope.comments = data.comments;
            }).error(function (error) {
                alert("エラー");
                console.dir(error);
            });
        });

        /**
        * 「UPDATE_COMMENTS」メッセージ受信時処理（コメントの再取得）
        */
        $scope.$on("UPDATE_COMMENTS", function (event, data) {
            taskService.getDetail(data.id).success(function (data, code) {
                $scope.comments = data.comments;
            }).error(function (error) {
                alert("エラー");
                console.dir(error);
            });
        });
    }]);


    /**
    * 独自ディレクティブ - コメントダイアログ経由で入力・処理をする。
    */
    app.directive("viaCommentDialog", ["taskService", "$rootScope", function (taskService, $rootScope) {

        var _target = (function () {

            function Target() {
                this.scope = {};
            }

            Target.prototype.clear = function () {
                this.scope = undefined;
                this.scope = { $index: -1 };  //ダミースコープオブジェクトのセット
            };

            var tgtObj = new Target();
            tgtObj.clear();
            return tgtObj;
        })();

        return {
            restrict: 'A',
            compile: function (element, attrs) {
                var okClick = function () {
                    var dialog = $("#comment-dialog");
                    var value = $("input[name='comment']", dialog).val();

                    if (_.isEmpty(value)) {
                        alert("コメントが未入力です");
                        return;
                    }

                    var taskId = _target.scope.taskId;
                    taskService.addComment(taskId, value)
                    .success(function (data, code) {
                        dialog.val("");
                        dialog.dialog("close");
                        _target.clear();
                        $rootScope.$broadcast("UPDATE_COMMENTS", { id: taskId });
                    })
                    .error(function (error) {
                        alert("エラー発生");
                        console.dir(error);
                    });
                };

                var cancelClick = function () {
                    dialog.dialog("close");
                    _target.clear();
                };

                $("#comment-dialog").dialog({
                    autoOpen: false,
                    height: 210,
                    width: 350,
                    modal: true,
                    buttons: [
						{
						    text: "OK",
						    click: okClick
						},
						{
						    text: "Cancel",
						    click: cancelClick
						}
                    ]
                });

                return function (scope, element, attrs) {
                    $(element).click(function () {
                        _target.scope = scope;
                        $("#comment-dialog").dialog("open");
                    });
                };
            }
        };
    }]);

})();