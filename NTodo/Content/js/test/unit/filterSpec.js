//'use strict';

describe("抽出フィルタ", function () {

    describe("フィルタ情報", function () {

        var infos = filters.taskFilters.allInfos;
        var getFilter = filters.taskFilters.getFilter;


        it("フィルタ情報数は3件", function () {
            expect(infos.length).toBe(3);
        });


        it("フィルタ情報のプロパティは name order type のみ", function () {
            for (var i = 0; i < infos.length; i++) {
                expect(infos[i].name).not.toBeUndefined();
                expect(infos[i].order).not.toBeUndefined();
                expect(infos[i].type).not.toBeUndefined();
                expect(infos[i].isTarget).toBeUndefined();
                expect(infos[i].exec).toBeUndefined();
            }
        });


        it("フィルタ情報はorderの昇順に整列されている", function () {
            expect(infos[0].order < infos[1].order < infos[2].order).toBe(true);
        });


        it("フィルタ情報 - ALL", function () {
            expect(infos[0].name === "すべて").toBe(true);
            expect(infos[0].type === "ALL").toBe(true);

        });


        it("フィルタ情報 - ProcessingOnly", function () {
            expect(infos[1].name === "未完了のみ").toBe(true);
            expect(infos[1].type === "ProcessingOnly").toBe(true);
        });


        it("フィルタ情報 - FinishedOnly", function () {
            expect(infos[2].name === "完了済のみ").toBe(true);
            expect(infos[2].type === "FinishedOnly").toBe(true);
        });


        it("'ALL'指定でgetFilterすると全対象フィルタが取得できる", function () {
            expect(getFilter("all")).not.toBeUndefined();
            expect(getFilter("ALL")).not.toBeUndefined();
        });


        it("全対象フィルタの動作検証 - 何も行わない。", function () {
            var filter = getFilter("ALL");

            var chkOrderAndVal = function (ary1, ary2, chkFnc) {
                if (ary1.length === ary2.length) {
                    for (var i = 0; i < ary1.length; i++) {
                        if (!chkFnc(ary1[i], ary2[i]))
                            return false;
                    }
                    return true;
                }
                return false;
            };

            var orgAry1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expect(chkOrderAndVal(filter(orgAry1), orgAry1, function (a1, a2) { return a1 === a2; })).toBe(true);

            var orgAry2 = [
                { a: "a", b: 5, c: false },
                { a: "b", b: 4, c: true },
                { a: "c", b: 3, c: false },
                { a: "d", b: 2, c: true },
                { a: "e", b: 1, c: false }
            ];
            expect(chkOrderAndVal(filter(orgAry2), orgAry2, function (a1, a2) { return a1.a === a2.a && a1.b === a2.b && a1.c === a1.c; })).toBe(true);
        });


        it("完了済のみフィルタの動作検証 - 配列内オブジェクトのfinishdプロパティがtrueの要素のみ抽出する。", function () {

            var filter = getFilter("FinishedOnly");

            expect(filter).not.toBeUndefined();

            var chkOrderAndVal = function (ary1, ary2) {
                if (ary1.length === ary2.length) {
                    for (var i = 0; i < ary1.length; i++) {
                        if (!ary1.finished || !ary2.finished)
                            return false;
                        if (ary1.a !== ary2.a || ary1.b !== ary2.b || ary1.c !== ary2.c)
                            return false;
                    }
                    return true;
                }
                return false;
            };

            var orgAry = [
                { a: 1, b: "あ", c: "a", finished: true },
                { a: 2, b: "い", c: "b", finished: false },
                { a: 3, b: "う", c: "c", finished: false },
                { a: 4, b: "え", c: "d", finished: false },
                { a: 5, b: "お", c: "e", finished: false },
                { a: 6, b: "か", c: "g", finished: true }
            ];

            var filterdExpectAry = [
                { a: 1, b: "あ", c: "a", finished: true },
                { a: 6, b: "か", c: "g", finished: true }
            ];

            var result = filter(orgAry);
            expect(result.length).toBe(2);
            expect(result[0].a).toBe(1);
            expect(result[0].b).toBe("あ");
            expect(result[0].c).toBe("a");
            expect(result[0].finished).toBe(true);
            expect(result[1].a).toBe(6);
            expect(result[1].b).toBe("か");
            expect(result[1].c).toBe("g");
            expect(result[1].finished).toBe(true);

            expect(chkOrderAndVal(result, filterdExpectAry)).toBe(true);
        });


    });

});