var services = {};

/**
* DataReaderオブジェクトの生成
* 
* @param {int} pageSize 1ページのレコード件数
* @param {object} ds データソース
* @param {function} readPage 1ページ分の読み込み処理を行う関数。
*                            前回の読み込み位置を記憶しておく必要あり。
*                            また、シグネチャは右記の通り readPage(ds:object, pageSize:int, success:function, error:function) : void
* @param {object} $q $qサービスオブジェクト
* @return {object} readプロパティを持つDataReaderオブジェクト
*/
services.generateDataReader = function (pageSize, ds, readPage, $q) {

    function DataReader() {};
    var obj = new DataReader();

    /**
    * 1ページ分の情報読み込み
    */
    obj.read= function () {
        var defer = $q.defer();
        readPage(ds, pageSize, function (data) {/* success */ defer.resolve(data); }, function (e) {/* error */ derer.reject(e); });
        return defer.promise;
    };

    return obj;
};

services.TaskService = (function () {
    function TaskService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    };

    TaskService.prototype.getTaskList = function (count, id) {
        var idParam = _.isUndefined(id) ? "" : ("&id=" + id);
        return this.$http.get("/api/status?count=" + count + idParam);
    };

    TaskService.prototype.getDetail = function (taskId) {
        return this.$http.get("/api/status/" + taskId + "?t=" + new Date().getTime());  //キャッシュ無効化
    };

    TaskService.prototype.addComment = function (taskId, comment) {
        return this.$http.post("/api/status/" + taskId + "/comments", { commentBody: comment });
    };

    TaskService.prototype.createDataReader = function (pageSize) {
        var readPage = (function () {
            var nextId = undefined;
            return function (ds, pageSize, success, error) {
                ds.getTaskList(pageSize,nextId).success(function (data, code) {
                    nextId = _.last(data).id;
                    success(data);
                }).error(function (e) {
                    error(e);
                });
            };
        })();

        return services.generateDataReader(pageSize, this, readPage, this.$q);
    };

    return TaskService;
})();


services.LimitInfoService = (function () {

    function LimitInfoService() {
        this.infos = new models.LimitInfos();
        //期限切れ
        models.LimitInfos.registInfoWhenLimitOver(this.infos, { color: '#E8105F' });
        //当日
        models.LimitInfos.registInfoWhenLimitToday(this.infos, { color: '#AC41F2' });
        //期限日5日より前
        models.LimitInfos.registInfoWhenLimitGreaterThan(this.infos, 5, { color: '#034EFF' });
        //期限日5日以内
        models.LimitInfos.registInfoWhenLimitLessThanEq(this.infos, 5, { color: '#0A7318' });
    }

    LimitInfoService.prototype.find = function (limit) {
        return this.infos.find(limit);
    };

    return LimitInfoService;

})();
