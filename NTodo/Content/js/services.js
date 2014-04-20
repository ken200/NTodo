var services = {};

services.TaskService = (function () {
    function TaskService($http) {
        this.$http = $http;
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
