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
            models.LimitInfos.registInfoWhenLimitOver(infos, { background: "red" }, "期限切れ");
            expect(infos.find(new Date(2014, 3, 20))).toBeUndefined();  //期限日: 2014/4/20
            expect(infos.find(new Date(2014, 3, 19))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 18))).toBeUndefined();
            expect(infos.find(new Date(2014, 3, 17))).not.toBeUndefined();
            expect(infos.find(new Date(2014, 3, 16))).not.toBeUndefined();
        });

        it("値内容の確認", function () {
            var createLimitInfo = function (limit) {
                var infos = new models.LimitInfos();
                models.LimitInfos.registInfoWhenLimitOver(infos, { background: "red" }, "期限切れ");
                return infos.find(limit);
            };

            var expect3DaysAfter = function () {
                var info = createLimitInfo(new Date(2014, 3, 8));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("期限切れ(10日経過)");
            };
            expect3DaysAfter();

            var expect1DayAfter = function () {
                var info = createLimitInfo(new Date(2014, 3, 17));
                expect(info.css.background).toBe("red");
                expect(info.message).toBe("期限切れ(1日経過)");
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
});