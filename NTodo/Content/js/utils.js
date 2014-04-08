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

})();