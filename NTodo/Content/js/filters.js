var filters = {};

(function () {
    var _createFilter = function (_type, _name, _order, _exec, _default) {
        var _isTarget = function (type) { return _default ? true : type === _type; };
        return {
            name: _name,
            order: _order,
            type: _type,
            isTarget: _isTarget,
            exec: _exec
        }
    };

    var _createAllInfos = function (filters) {
        return _.sortBy(_.map(filters, function (f) { return _.pick(f, "name", "type", "order"); }), function (f) { return f.order; });
    };

    //memo:即時関数のネストってしてもいいの？？

    (function initTaskFilters() {
        filters.taskFilters = {};
        var _filters = [];
        _filters.push(_createFilter("FinishedOnly", "完了済のみ", 3, function (i) { return i.finished === true; }, false));
        _filters.push(_createFilter("ProcessingOnly", "未完了のみ", 2, function (i) { return i.finished !== true; }, false));
        _filters.push(_createFilter("ALL", "すべて", 1, function (finished) { return true; }, true));

        /* 全フィルタ情報 */
        filters.taskFilters.allInfos = _createAllInfos(_filters);

        /* フィルターの取得 */
        filters.taskFilters.getFilter = function (type) {
            var filter = _.find(_filters, function (f) { return f.isTarget(type); });
            return function (input) {
                return _.filter(input, filter.exec);
            };
        };
    })();

    (function initTaskSorters() {
        filters.taskSorters = {};
        var _filters = [];
        _filters.push(_createFilter("LimitDesc", "期限の新しい順", 2, function (i) { return new Date(i.limit).getTime() * -1; }, false));
        _filters.push(_createFilter("LimitAsc", "期限の古い順", 1, function (i) { return new Date(i.limit).getTime(); }, true));

        /* 全フィルタ情報 */
        filters.taskSorters.allInfos = _createAllInfos(_filters);

        /* フィルターの取得 */
        filters.taskSorters.getSorter = function (type) {
            var sorter = _.find(_filters, function (f) { return f.isTarget(type); });
            return function (input) {
                return _.sortBy(input, sorter.exec);
            };
        };
    })();
})();

(function initDefaultFilterSorter() {
    var _getFirstFilter = function (infos) {
        return _.first(_.sortBy(infos, function (i) { return i.order * -1; }));
    };
    var _getDefaultSorter = function () {
        return filters.taskSorters.getSorter(_getFirstFilter(filters.taskSorters.allInfos));
    };
    var _getDefaultFilter = function () {
        return filters.taskFilters.getFilter(_getFirstFilter(filters.taskFilters.allInfos));
    };
    filters.execDefaultFilterAndSort = function (items) {
        var sorter = _getDefaultSorter();
        var filter = _getDefaultFilter();
        return sorter(filter(items));
    };
})();

