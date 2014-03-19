var utils = {};

(function(){

    /**
    * yyyy/MM/dd 00:00:00 なDateオブジェクトを生成する
    */
    utils.getYMD = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    /**
    * 期限までの残日数を取得
    * パラメーター日付 - 現在日付 で求める
    */
    utils.getLastDay = function (limit) {
        var limitYMD = utils.getYMD(new Date(limit));
        var nowYMD = utils.getYMD(new Date());
        return (limitYMD.getTime() - nowYMD.getTime()) / (1000 * 60 * 60 * 24);
    };

})();