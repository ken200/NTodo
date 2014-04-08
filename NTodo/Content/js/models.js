var models = {};

models.LimitInfos = (function () {

    //memo:プロトタイプ定義とStatic定義を分けるために即時関数のネストを利用した

    var LI = (function () {
        function LimitInfos() {
            this.infos = [];
        }

        /**
        *登録にはLimitInfosのStaticメソッドを使用する想定
        */
        LimitInfos.prototype.registInfo = function (i) {
            this.infos.push(i);
        };

        LimitInfos.prototype.clearInfo = function () {
            this.infos = [];
        };

        /**
        *残期間に一致する期限情報の取得
        *何れにも一致しない場合はundefinedを返す
        */
        LimitInfos.prototype.find = function (limit) {
            var info;
            for (var i = 0; i < this.infos.length; i++) {
                info = this.infos[i](limit);
                if (info)
                    break;
            }
            return info;
        };

        return LimitInfos;
    })();

    LI._calcLimit = function (limit) {
        return utils.getLastDay(limit);
    };

    var curryingMathAbs = function (ld) {
        return function () { return Math.abs(ld); }
    };

    var getLastDay = function () { };

    /**
    *期限切れ時情報の作成
    */
    LI.registInfoWhenLimitOver = function (info, css, msgHeader) {
        info.registInfo(function is(limit) {
            var ld = LI._calcLimit(limit);
            if (ld < 0) {
                return { css: css, message: msgHeader + "(" + Math.abs(ld) + "日経過)" };
            } else {
                return undefined;
            }
        });
    };

    /**
    *期限日当日情報の登録
    */
    LI.registInfoWhenLimitToday = function (info, css, msg) {
        info.registInfo(function is(limit) {
            var ld = LI._calcLimit(limit);
            if (ld === 0) {
                return { css: css, message: msg || "今日が期限日です！！" };
            } else {
                return undefined;
            }
        });
    };

    /**
    *期限日までN日以上ある場合の情報の登録
    */
    LI.registInfoWhenLimitGreaterThan = function (info, n, css, msgHeader) {
        info.registInfo(function is(limit) {
            var ld = LI._calcLimit(limit);
            if (ld >= n) {
                return { css: css, message: msgHeader + "あと" + Math.abs(ld) + "日です。" };
            } else {
                return undefined;
            }
        });
    };

    /**
    *期限日までN日より少ない場合の情報の登録
    */
    LI.registInfoWhenLimitLessThan = function (info, n, css, msgHeader) {
        info.registInfo(function is(limit) {
            var ld = LI._calcLimit(limit);
            if (ld < n) {
                return { css: css, message: msgHeader + "あと" + Math.abs(ld) + "日です。。お早目に！" };
            } else {
                return undefined;
            }
        });
    };

    return LI;
})();