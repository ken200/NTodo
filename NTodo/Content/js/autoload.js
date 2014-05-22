(function () {
    var mod = angular.module("auto-load", []);
    mod.directive("autoLoad", ["$rootScope", "$parse", function ($rootScope, $parse) {

        var getConfig = function (scope, attr) {
            var config = $parse(attr.autoLoad || "getConfig()")(scope);
            /**
            * リストアイテムプロパティの取得
            * 未指定の場合はスコープがitemsプロパティを使用する。(未定義の場合は作成する)
            */
            var getItems = function () {
                if (_.isUndefined(config.items)) {
                    if (_.isUndefined(scope.items)) {
                        scope.items = [];
                    }
                    return scope.items;
                }
                else if (_.isString(config.items)) {
                    return $parse(config.items)(scope);
                }
                //Arrayの想定
                return config.items;
            };
            /**
            * 読み込み関数の取得
            * 未指定の場合は関数名"loadMore"の定義有無を確認する。
            * それも未定義の場合は例外発生させ、定義されている場合はそれを返す。
            */
            var getloadMore = function () {
                if (_.isUndefined(config.loadMore)) {
                    if (_.isUndefined(scope.loadMore)) {
                        throw new Error("Error: AutoLoadMethod Is Not Implemented.");
                    } else {
                        return scope.loadMore;
                    }
                }
                else if (_.isString(config.loadMore)) {
                    //文字列の場合は毎回パース＆実行することになる
                    return function callLoadMore() {
                        return $parse(config.loadMore)(scope);
                    };
                }
                //関数の想定
                return config.loadMore;
            };

            var isFullArea = config.box === undefined;
            var box = isFullArea ? $("body") : $("#" + config.box);
            var scrollTgt = isFullArea ? $(window) : box;

            return {
                box: box,
                scrollTgt: scrollTgt,
                items: getItems(),
                loadMore: getloadMore()
            }
        };

        var _link = function (scope, ele, attr) {
            var config = getConfig(scope, attr);
            var items = config.items;
            var box = config.box;
            var scrollTgt = config.scrollTgt;

            var getLastRow = (function () {
                var lastItemCount = 0;
                var cache = { size: 0 };
                return function (rootEle) {
                    if (lastItemCount !== items.length) {
                        cache = rootEle.children(":last");
                        lastItemCount = items.length;
                    }
                    return cache;
                };
            })();

            var addRows = function (afterAdded) {
                var loadMore = config.loadMore;
                var after = afterAdded || function () { };
                loadMore()
                .then(function (data) {
                    if(data.length > 0)
                        _.each(data, function (d) { items.push(d); });
                    after();
                })
                .catch(function (e) {
                    console.dir(e);
                });
            };

            var needNextData = function () {
                var getBoxBottomPos = function () {
                    //ページ内Divに対する自動スクロール
                    if(box.selector === scrollTgt.selector){
                        return box.position().top + box.height();
                    }
                    //ページスクロールに対する自動スクロール
                    return window.pageYOffset + scrollTgt.height();
                };
                var boxBottomPos = getBoxBottomPos();
                var lastRow = getLastRow(ele);
                var lastRowHeight = lastRow.height() / 2;
                var lastRowPos = lastRow.position().top + (lastRowHeight / 2);

                return boxBottomPos > lastRowPos;
            };

            var createScrollEventHandler = function () {
                return _.debounce(function () {
                    if (needNextData()) {
                        scrollTgt.off("scroll");
                        addRows(function () { scrollTgt.on("scroll", createScrollEventHandler()); });
                    }
                }, 1000);
            };

            scrollTgt.on("scroll", createScrollEventHandler());
            addRows();
        };
        return {
            restrict: 'A',
            compile: function (ele, attr) { return _link; }
        }
    }]);
})();