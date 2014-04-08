describe('タスクコントローラー', function () {

    var createTodoItems = function (count, title, summary) {
        return _.map(_.range(count), function (i) {
            var id = i + 1;
            return {
                id: id,
                title: title + "_" + id,
                detailSummary: summary + "_" + id,
                finished: id % 2 === 0,
                limit: "2015-05-01T00:00:00"
            };
        });
    };

    var initHttpBackEnd = function ($hb, initCalback) {
        if (_.isUndefined(initCalback)) {
            $hb.expectGET("/api/status/all").respond(500, "エラーですね")
        } else {
            initCalback($hb);
        }
        return $hb;
    };

    beforeEach(module("myapp"));

    describe("コントローラー生成後のタスクアイテムリスト", function () {
        it("期限までの残日数の有無関係なく、期限の古いもの順でソートされている。", inject(function (_$httpBackend_, $rootScope, $controller) {
            var httpBackend = initHttpBackEnd(_$httpBackend_, function ($hb) {
                $hb.expectGET("/api/status/all").respond(createTodoItems(10, "タイトル", "サマリー"));
            });
            var scope = $rootScope.$new();
            var ctrl = $controller("tasklistCtrl", { $scope: scope });
            httpBackend.flush();
            expect(scope.items.length).toBe(10);
        }));

        it("リストの取得失敗時にはitemsプロパティが存在しない。", inject(function (_$httpBackend_, $rootScope, $controller) {
            var httpBackend = initHttpBackEnd(_$httpBackend_);
            var scope = $rootScope.$new();
            var ctrl = $controller("tasklistCtrl", { $scope: scope });
            httpBackend.flush();
            expect(scope.items).toBeUndefined();
        }));
    });

    describe("isLimitOverメソッド", function () {

        var ctrl, scope, httpBackend;

        beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
            httpBackend = initHttpBackEnd(_$httpBackend_);
            scope = $rootScope.$new();
            ctrl = $controller("tasklistCtrl", { $scope: scope });
            httpBackend.flush();
        }));

        it("期限日付 < 現在日付の場合は、ifNotOverStyleが適用される。", function () {
            var limit = "2015-05-01T00:00:00";
            var now = "2015-05-05T00:00:00";
            expect(scope.isLimitOver(limit, "over", "not over", now)).toBe("not over");
        });

        it("期限日付 = 現在日付の場合は、ifNotOverStyleが適用される。", function () {
            var limit = "2015-05-01T00:10:00";
            var now = "2015-05-01T00:10:00";
            expect(scope.isLimitOver(limit, "over", "not over", now)).toBe("not over");
        });

        it("期限日付 > 現在日付の場合は、ifOverStyleが適用される。", function () {
            var limit = "2015-05-05T00:00:00";
            var now = "2015-05-01T00:00:00";
            expect(scope.isLimitOver(limit, "over", "not over", now)).toBe("over");
        });
    });

    //getLastDayStyleをテスト容易となるようにリファクタリングする

});
