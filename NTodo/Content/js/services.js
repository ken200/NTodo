var services = {};

services.TaskService = (function () {
    function TaskService($http) {
        this.$http = $http;
    };

    TaskService.prototype.getAll = function () {
        return this.$http.get("/api/status/all");
    };

    TaskService.prototype.getDetail = function (taskId) {
        return this.$http.get("/api/status/" + taskId);
    };

    TaskService.prototype.addComment = function (taskId, comment) {
        return this.$http().post("/api/status/" + taskId + "/comments", { data: { commentBody: comment }, cache : false });
    };

    return TaskService;
})();