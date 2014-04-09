describe("LimitInfosテスト", function () {

    var NOW_DATE = "2014-04-18T12:12:12";

    beforeEach(function () {
        models.LimitInfos._calcLimit = function (limit) {
            return utils.getLastDay(limit, NOW_DATE);
        };
    });

    describe("LimitInfos.registInfoWhenLimitOver()", function () {
        it("期限切れの判定確認", function () {
            var infos = new models.LimitInfos();
            models.LimitInfos.registInfoWhenLimitOver(infos, { background: "red" });
            expect(infos.find(new Date(2014, 3, 20))).toBeUndefined();  //期限日: 2014/4/20
            expect(infos.find(new Date(2014, 3, 19))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 18))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 17))).not.toBeUndefined();
            expect(infos.find(new Date(2014, 3, 16))).not.toBeUndefined();
        });

        it("値内容の確認", function () {
            var createLimitInfo = function (limit) {
                var infos = new models.LimitInfos();
                models.LimitInfos.registInfoWhenLimitOver(infos, { background: "red" });
                return infos.find(limit);
            };

            var expect3DaysAfter = function () {
                var info = createLimitInfo(new Date(2014, 3, 8));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("期限切れ (10日経過)");
            };
            expect3DaysAfter();

            var expect1DayAfter = function () {
                var info = createLimitInfo(new Date(2014, 3, 17));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("期限切れ (1日経過)");
            };
            expect1DayAfter();
        });
    });

    describe("LimitInfos.registInfoWhenLimitToday()", function () {
        it("期限当日の判定確認", function () {
            var infos = new models.LimitInfos();
            models.LimitInfos.registInfoWhenLimitToday(infos, {});
            expect(infos.find(new Date(2014, 3, 20))).toBeUndefined();  //期限日: 2014/4/20
            expect(infos.find(new Date(2014, 3, 19))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 18))).not.toBeUndefined();
            expect(infos.find(new Date(2014, 3, 17))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 16))).toBeUndefined();
        });

        it("値内容の確認", function () {
            var createLimitInfo = function (limit) {
                var infos = new models.LimitInfos();
                models.LimitInfos.registInfoWhenLimitToday(infos, { background: "red" });
                return infos.find(limit);
            };
            var info = createLimitInfo(new Date(2014, 3, 18));
            expect(info.css.background).toBe("red");
            expect(info.message).toBe("今日が期限日です！！");
        });
    });

    describe("LimitInfos.registInfoWhenLimitGreaterThan()", function () {

        /**
        *期限日まで3日より多い場合に情報取得できる。
        *当日が「2014/04/18」の場合、期限日が「2014/04/22」以降である場合に情報取得できる。
        */
        it("期限の判定確認", function () {

            var infos = new models.LimitInfos();
            models.LimitInfos.registInfoWhenLimitGreaterThan(infos, 3, {});
            expect(infos.find(new Date(2014, 3, 23))).not.toBeUndefined(); //期限は5日後
            expect(infos.find(new Date(2014, 3, 22))).not.toBeUndefined(); //期限は4日後
            expect(infos.find(new Date(2014, 3, 21))).toBeUndefined();     //期限は3日後
            expect(infos.find(new Date(2014, 3, 20))).toBeUndefined();     //期限は2日後
            expect(infos.find(new Date(2014, 3, 19))).toBeUndefined();     //期限は1日後
            expect(infos.find(new Date(2014, 3, 18))).toBeUndefined();     //期限当日
            expect(infos.find(new Date(2014, 3, 17))).toBeUndefined();
        });

        it("値内容の確認", function () {
            var createLimitInfo = function (limit) {
                var infos = new models.LimitInfos();
                models.LimitInfos.registInfoWhenLimitGreaterThan(infos, 3, { background: "red" });
                return infos.find(limit);
            };

            var getLast5Day = function () {
                var info = createLimitInfo(new Date(2014, 3, 23));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("あと5日です。");
            };
            getLast5Day();

            var getLast4Day = function () {
                var info = createLimitInfo(new Date(2014, 3, 22));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("あと4日です。");
            };
            getLast4Day();
        });
    });

    describe("LimitInfos.registInfoWhenLimitLessThanEq()", function () {

        /**
        *期限日まで3日以下の場合に情報取得できる。
        *当日が「2014/04/18」の場合、期限日が「2014/04/19」～「2014/04/21」である場合に情報取得できる。
        *また、当日が期限日の場合は取得できない。
        */
        it("期限の判定確認", function () {
            var infos = new models.LimitInfos();
            models.LimitInfos.registInfoWhenLimitLessThanEq(infos, 3, {});

            expect(infos.find(new Date(2014, 3, 23))).toBeUndefined();     //期限は5日後
            expect(infos.find(new Date(2014, 3, 22))).toBeUndefined();     //期限は4日後
            expect(infos.find(new Date(2014, 3, 21))).not.toBeUndefined(); //期限は3日後
            expect(infos.find(new Date(2014, 3, 20))).not.toBeUndefined(); //期限は2日後
            expect(infos.find(new Date(2014, 3, 19))).not.toBeUndefined(); //期限は1日後
            expect(infos.find(new Date(2014, 3, 18))).toBeUndefined();     //期限当日
            expect(infos.find(new Date(2014, 3, 17))).toBeUndefined();
        });

        it("値内容の確認", function () {
            var createLimitInfo = function (limit) {
                var infos = new models.LimitInfos();
                models.LimitInfos.registInfoWhenLimitLessThanEq(infos, 4, { background: "red" });
                return infos.find(limit);
            };

            var getLast3Day = function () {
                var info = createLimitInfo(new Date(2014, 3, 21));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("あと3日です。お早目に！");
            };
            getLast3Day();

            var getLast2Day = function () {
                var info = createLimitInfo(new Date(2014, 3, 20));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("あと2日です。お早目に！");
            };
            getLast2Day();

            var getLast1Day = function () {
                var info = createLimitInfo(new Date(2014, 3, 19));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("あと1日です。お早目に！");
            };
            getLast1Day();
        });
    });

});