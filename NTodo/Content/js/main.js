(function () {

    var app = angular.module("myapp", ["ngRoute"]);

    /**
    * サービス登録 - TaskService
    */
    app.factory("taskService", ["$http", function ($http) {
        return new services.TaskService($http);
    }]);

    /**
    * サービス登録 - LimitInfoService
    */
    app.factory("limitInfoService", [function () {
        return new services.LimitInfoService();
    }]);

    /**
    * 検索条件コントローラー
    */
    app.controller("searchFilterController", ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.sortFilterTypes = filters.taskSorters.allInfos;
        $scope.listFilterTypes = filters.taskFilters.allInfos;
        $scope.updateFilters = function () {
            var sorter = filters.taskSorters.getSorter($scope.sortFilter.type);
            var filter = filters.taskFilters.getFilter($scope.listFilter.type);
            $rootScope.$broadcast("UPDATE_FILTER", function(items){
                return sorter(filter(items));
            });
        };
    }]);

    /**
    * タスクリストコントローラー
    */
    app.controller("tasklistCtrl", ["taskService", "limitInfoService", "$rootScope", "$scope", function (taskService, limitInfoService, $rootScope, $scope) {

        var _allItems = [];

        taskService.getAll().success(function (data, code) {
            _allItems = data;
            $scope.items = filters.execDefaultFilterAndSort(data);
        }).error(function (error) {
            alert("エラー");
            console.dir(error);
        });

        /**
        * タスクの期限切れ確認
        * @param {date} limit タスクのリミット日時
        * @param {string} ifOverStyle 期限切れ時のスタイル
        * @param {string} ifNotOverStyle 期限切れではない場合のスタイル
        * @param {date} now この日時がリミット日時を超えている・いないで期限切れを判定する。未指定の際には現在日時を使う。
        */
        $scope.isLimitOver = function (limit, ifOverStyle, ifNotOverStyle, now) {
            var limitYMD = utils.getYMD(new Date(limit));
            var nowYMD = utils.getYMD(now ? new Date(now) : undefined);
            return nowYMD.getTime() < limitYMD.getTime() ? ifOverStyle : ifNotOverStyle;
        };

        /**
        * 期限までの残日数に対応したスタイルの取得
        */
        $scope.getLastDayStyle = function (limit) {
            return limitInfoService.find(limit || new Date()).css;
        };

        /**
        * 期限までの残日数に対応したメッセージの取得
        */
        $scope.getLastDayMessage = function (limit) {
            return limitInfoService.find(limit || new Date()).message;
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