describe("タスクサービステスト", function () {

    var initHttpBackEnd = function ($hb, initCalback) {
        if (_.isUndefined(initCalback)) {
            $hb.expectGET(/^.*$/).respond(500, "エラーですね")
        } else {
            initCalback($hb);
        }
        return $hb;
    };

    var createRespond = function (pageSize) {
        var lastId = 0;

        /**
        * urlからidパラメーター値を抽出してそれを返す。
        * 該当パラメーターが存在しなかった場合は0を返す。
        */
        var getIdFromUrl = function (url) {
            var id = url.replace(/^.+(id=)(\d+).*$/, "$2");
            return id === url ? 0 : parseInt(id,10);
        };

        /**
        * 連続したリストかどうかの確認
        * 前回リクエスト時の最新IDとidパラメーター値を比較する。一致すればOK。
        *
        * @param {int} id urlのidパラメーター値
        */
        var isSeriesList = function (id) {
            if (lastId === 0 && id === 0)
                return true;
            else if (lastId > 0 && id > 0 && lastId === id)
                return true;
            else
                return false;
        };

        return function (method, url, data, headers) {
            var startId = getIdFromUrl(url);
            if (isSeriesList(startId)) {
                var retData = _.map(_.range(pageSize), function (i) { return { id: startId + i + 1, } });
                lastId = startId + pageSize;
                return [200, retData, headers, undefined];
            } else {
                return [500, [], headers, undefined];
            }
        };
    };

    var createDataReader = function (_$httpBackend_, $http, $q) {
        var pageSize = 10;
        var httpBackend = initHttpBackEnd(_$httpBackend_, function ($hb) {
            var respod = createRespond(pageSize);
            $hb.expectGET("/api/status?count=10").respond(respod);
            $hb.expectGET("/api/status?count=10&id=10").respond(respod);
            $hb.expectGET("/api/status?count=10&id=20").respond(respod);
        });
        var s = new services.TaskService($http, $q);
        return s.createDataReader(pageSize);
    };

    it("データリーダーテスト", inject(function (_$httpBackend_, $http, $q) {
        var dataReader = createDataReader(_$httpBackend_, $http, $q);
        dataReader.read()
        .then(dataReader.read)
        .then(dataReader.read)
        .then(function (data) {
            console.dir(data);
            expect(1).toBe(1);
        })
        .catch(function (e) { console.dir(e); expect(1).toBe(0); });
        _$httpBackend_.flush();
    }));

    it("データリーダーテスト(読み込み途中でエラー発生)", inject(function (_$httpBackend_, $http, $q) {
        var dataReader = createDataReader(_$httpBackend_, $http, $q);
        dataReader.read()
        .then(dataReader.read)
        .then(dataReader.read)
        .then(function () {
            //memo: 普通のfunctionで例外発生しても$qでは補足されない。(必ず、処理成功時はresolve()、失敗時はreject()を呼び出し、戻り値はpromiseとすること！)
            var defer = $q.defer();
            defer.reject("読み取りエラー発生");
            return defer.promise;
        })
        .then(function () {
            console.log("ここは通らない");
            expect(1).toBe(0);
        })
        .catch(function (e) { console.log(e); expect(1).toBe(1); });
        _$httpBackend_.flush();
    }));

});