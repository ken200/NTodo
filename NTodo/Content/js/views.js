if (window.ntodo === undefined)
    window.ntodo = {};
if (ntodo.views === undefined)
    ntodo.views = {};

/**
* 詳細ビューオブジェクト
*/
ntodo.views.taskDetailView = (function () {
    var _detailRoot = $("#task-detail");

    var _callIfNotDefined = function (action) {
        return function (val) {
            if (val !== undefined)
                action(val);
        };
    };

    var _setTitle = _callIfNotDefined(function (val) {
        $("li:eq(1)", _detailRoot).text(val);
    });

    var _getDetailHtml = _callIfNotDefined(function (detailOrg) {
        return _.reduce(detailOrg.split("\r\n"), function (memo, val) { return memo + val + "</br>"; }, "");
    });

    var _setDetail = _callIfNotDefined(function (val) {
        $("li:eq(3)", _detailRoot).html(_getDetailHtml(val));
    });

    var _setLimit = _callIfNotDefined(function (val) {
        $("li:eq(5)", _detailRoot).text(val);
    });

    var _createAddCommentAction = function (maxLength, afterAction) {
        var max = maxLength;
        var current = 0;
        return _callIfNotDefined(function (comment) {
            if (max >= current) {
                afterAction(current, comment);
                current++;
            } else {
                throw new Error("コメント上限オーバー");
            }
        });
    };

    var _addComments = function (comments) {
        var _addComment = _createAddCommentAction(10, function (idx, comment) {
            $("li:eq(" + (7 + idx) + ")", _detailRoot).text(comment.commentBody);
        });
        _.isArray(comments) ? _.each(comments, _addComment) : _addcomment(comments);
    };

    var _set = function (p) {
        _setTitle(p.title);
        _setDetail(p.detail);
        _setLimit(p.limit);
        _addComments(p.comments);
    };

    return {
        set: _set
    };
})();