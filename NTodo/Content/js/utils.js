var utils = {};

(function(){

    /**
    * yyyy/MM/dd 00:00:00 なDateオブジェクトを生成する
    * パラメーターが未指定の場合は現在日付を返す
    */
    utils.getYMD = function (date) {
        var d = date || new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    /**
    * 期限までの残日数を取得
    * パラメーター日付 - 現在日付 で求める
    */
    utils.getLastDay = function (limit, now) {
        var limitYMD = utils.getYMD(new Date(limit));
        var nowYMD = utils.getYMD(now ? new Date(now) : new Date());
        return (limitYMD.getTime() - nowYMD.getTime()) / (1000 * 60 * 60 * 24);
    };

    /**
    * タスクの期限切れ確認
    * 現在日付がリミット日付を超えている場合に期限切れと判定する。現在日付=リミット日付の場合は期限内と判定する。
    *
    * @param {date} limit タスクのリミット日付
    * @param {date} now 現在日時。 ※ユニットテスト用パラメーター。通常使用では指定しない。
    */
    utils.isLimitOver = function (limit, now) {
        var limitYMD = utils.getYMD(new Date(limit));
        var nowYMD = utils.getYMD(now ? new Date(now) : undefined);
        return nowYMD.getTime() < limitYMD.getTime();
    };

})();