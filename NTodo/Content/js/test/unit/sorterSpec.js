describe("ソートフィルタ", function () {

    var infos = filters.taskSorters.allInfos;

    var chkOrderAndVal = function (ary1, ary2) {
        if (ary1.length === ary2.length) {
            for (var i = 0; i < ary1.length; i++) {
                if (ary1.a !== ary2.a || ary1.b !== ary2.b || ary1.limit !== ary2.limit)
                    return false;
            }
            return true;
        }
        return false;
    };

    it("フィルタ情報数は2件", function () {
        expect(infos.length).toBe(2);
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
        expect(infos[0].order < infos[1].order).toBe(true);
    });

    it("フィルタ情報 - Defalt", function () {
        expect(infos[0].name === "期限の古い順").toBe(true);
        expect(infos[0].type === "Default").toBe(true);
    });

    it("フィルタ情報 - LimitDesc", function () {
        expect(infos[1].name === "期限の新しい順").toBe(true);
        expect(infos[1].type === "LimitDesc").toBe(true);
    });

    var getSorter = filters.taskSorters.getSorter;

    it("Defaultフィルタの動作検証 - 期限の古い順にソート（先頭に最古期限レコード、末尾に最新期限レコードとなる）", function () {
        var sorter = getSorter("Default");
        var orgAry = [
            { a: 1, b: "す", limit: "2014-12-01T00:00:00" },
            { a: 2, b: "し", limit: "2014-11-01T00:00:00" },
            { a: 3, b: "さ", limit: "2014-10-01T00:00:00" },
            { a: 4, b: "こ", limit: "2014-02-11T00:00:00" },
            { a: 5, b: "け", limit: "2014-02-10T00:00:00" },
            { a: 6, b: "く", limit: "2014-02-03T00:00:00" },
            { a: 7, b: "き", limit: "2014-02-02T00:00:00" },
            { a: 8, b: "か", limit: "2014-02-01T00:00:00" },
            { a: 9, b: "お", limit: "2014-01-11T00:00:00" },
            { a: 10, b: "え", limit: "2014-01-10T00:00:00" },
            { a: 11, b: "う", limit: "2014-01-03T00:00:00" },
            { a: 12, b: "い", limit: "2014-01-02T00:00:00" },
            { a: 13, b: "あ", limit: "2014-01-01T00:00:00" }
        ];
        var expectSortedAry = _.sortBy(orgAry, function (i) { return i.a; });
        var result = sorter(orgAry);
        expect(chkOrderAndVal(result, expectSortedAry)).toBe(true);
    });

    it("LimitDescフィルタの動作検証 - 期限の新しい順にソート（先頭に最新期限レコード、末尾に最古期限レコードとなる）", function () {
        var sorter = getSorter("LimitDesc");
        var orgAry = [
            { a: 13, b: "あ", limit: "2014-01-01T00:00:00" },
            { a: 12, b: "い", limit: "2014-01-02T00:00:00" },
            { a: 11, b: "う", limit: "2014-01-03T00:00:00" },
            { a: 10, b: "え", limit: "2014-01-10T00:00:00" },
            { a: 9, b: "お", limit: "2014-01-11T00:00:00" },
            { a: 8, b: "か", limit: "2014-02-01T00:00:00" },
            { a: 7, b: "き", limit: "2014-02-02T00:00:00" },
            { a: 6, b: "く", limit: "2014-02-03T00:00:00" },
            { a: 5, b: "け", limit: "2014-02-10T00:00:00" },
            { a: 4, b: "こ", limit: "2014-02-11T00:00:00" },
            { a: 3, b: "さ", limit: "2014-10-01T00:00:00" },
            { a: 2, b: "し", limit: "2014-11-01T00:00:00" },
            { a: 1, b: "す", limit: "2014-12-01T00:00:00" }
        ];
        var expectSortedAry = _.sortBy(orgAry, function (i) { return i.a; });
        var result = sorter(orgAry);
        expect(chkOrderAndVal(result, expectSortedAry)).toBe(true);
    });

});