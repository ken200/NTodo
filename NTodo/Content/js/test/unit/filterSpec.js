//'use strict';

describe("抽出フィルタ", function () {

    describe("フィルタ情報", function () {

        var infos = filters.taskFilters.allInfos;

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

        var getFilter = filters.taskFilters.getFilter;

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


        /**
        * フィルタの動作確認
        *
        * @param {object} filter 確認対象フィルタ
        * @param {bool} expectFinsiedState フィルタ対象となるfinished値
        *
        */
        var expectFilterResult = function (filter, expectFinsiedState) {
            expect(filter).not.toBeUndefined();

            var chkOrderAndVal = function (ary1, ary2) {
                if (ary1.length === ary2.length) {
                    for (var i = 0; i < ary1.length; i++) {
                        if (ary1.finished === !expectFinsiedState || ary2.finished === !expectFinsiedState)
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
            var filterdExpectAry = _.filter(orgAry, function (i) { return i.finished === expectFinsiedState;});

            expect(chkOrderAndVal(filter(orgAry), filterdExpectAry)).toBe(true);
        };

        it("完了済のみフィルタの動作検証 - 配列内オブジェクトのfinishdプロパティがtrueの要素のみ抽出する。", function () {
            expectFilterResult(getFilter("FinishedOnly"), true);
        });

        it("未完了フィルタの動作検証 - 配列内オブジェクトのfinishdプロパティがfalseの要素のみ抽出する。", function () {
            expectFilterResult(getFilter("ProcessingOnly"), false);
        });

    });

});