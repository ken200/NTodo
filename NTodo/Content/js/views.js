if (window.ntodo === undefined)
    window.ntodo = {};
if (ntodo.views === undefined)
    ntodo.views = {};

/**
* 詳細ビューオブジェクト
*/
ntodo.views.taskDetailView = (function () {

    var _getLi = (function () {
        var dRoot = undefined;
        return function (idx) {
            if (_.isUndefined(dRoot))
                dRoot = $("#task-detail");
            return $("li:eq(" + idx + ")", dRoot);
        }
    })();

    var _callIfNotDefined = function (action) {
        return function (val) {
            if (val !== undefined)
                return action(val);
        };
    };

    var _setTitle = _callIfNotDefined(function (val) {
        _getLi(1).text(val);
    });

    var _getDetailHtml = _callIfNotDefined(function (detailOrg) {
        return _.reduce(detailOrg.split("\r\n"), function (memo, val) { return memo + val + "</br>"; }, "");
    });

    var _setDetail = _callIfNotDefined(function (val) {
        _getLi(3).html(_getDetailHtml(val));
    });

    var _setLimit = _callIfNotDefined(function (val) {
        _getLi(5).text(val);
    });

    var _commentMax = 10;
    var _commentCount = 0;

    var _addCommentCore = function (idx, comment) {
        var body = _.isUndefined(comment.commentBody) ? comment : comment.commentBody;
        _getLi(7+idx).text(body);
    };

    var _addComment = _callIfNotDefined(function (comment) {
        if (_commentMax >= _commentCount) {
            _addCommentCore(_commentCount, comment);
            _commentCount++;
        } else {
            throw new Error("コメント上限オーバー");
        }
    });

    var _addComments = function (comments) {
        _.isArray(comments) ? _.each(comments, _addComment) : _addComment(comments);
    };

    var _set = function (p) {
        _setTitle(p.title);
        _setDetail(p.detail);
        _setLimit(p.limit);
        _addComments(p.comments);
    };

    //var _clearTitle = function () { _getLi(1).text(""); };
    //var _clearDetail = function () { _getLi(3).html(""); };
    //var _clearLimit = function () { _getLi(5).text(""); };

    var _clearComments = function () {
        _commentCount = 0;
        _.each(_.range(7, _commentMax+7), function (v) {
            _getLi(v).text("");
        });
    };

    var _clear = function () {
        //_clearTitle();
        //_clearDetail();
        //_clearLimit();
        _clearComments();
    };

    return {
        set: _set,
        clear : _clear
    };
})();