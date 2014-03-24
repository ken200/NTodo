var filters = {};

/**
* タスクフィルター
*/
filters.taskFilter = function (expected) {

    var _filterAction = undefined;

    if (expected === "All") {
        _filterAction = function (finished) { return true; }
    } else if (expected === "FinishedOnly") {
        _filterAction = function (finished) { return finished === true; }
    } else if (expected === "ProcessingOnly") {
        _filterAction = function (finished) { return finished !== true; }
    }

    //デフォルトのフィルター(全部NG)
    if (_filterAction === undefined)
        _filterAction = function (finished) { return false; }

    /**
    * 実際のタスクフィルター
    * タスクの進捗状態でフィルタリングを行う。
    *
    * @param input {Object} タスクアイテムの配列  ※タスクアイテム： ここではfinishedプロパティ(bool)が定義されていればよい。
    *
    */
    return function (input) {
        return _.filter(input, function (i) { return _filterAction(i.finished); })
    };
};

/**
* ソートフィルター
*/
filters.sortFilter = function (sorttype) {

    var _sortAction = undefined;

    if (sorttype === "Default") {
        _sortAction = function (i) {
            return new Date(i.limit).getTime();
        }
    } else{
        _sortAction = function (i) {
            return new Date(i.limit).getTime() * -1;
        }
    }

    /**
    * 実際のソートフィルター
    * タスクの期限でフィルタリングを行う。
    *
    * @param input {Object} タスクアイテムの配列 ※タスクアイテム： ここではlimitプロパティ(date)が定義されていればよい。
    *
    */
    return function (input) {
        return _.sortBy(input, _sortAction);
    };

};