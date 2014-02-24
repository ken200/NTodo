$(function () {
    var taskDetailView = ntodo.views.taskDetailView;

    $(".regist-task-list-item").click(function () {
        var hidden = $(":hidden", this);
        $.ajax({
            type: "GET",
            url: "/status/" + hidden.val(),
            timeout: 5000
        }).done(function (data) {
            taskDetailView.set({
                title : hidden.data("title"),
                detail : data.detailBody,
                limit : hidden.data("limit"),
                comments : data.comments});
        });
    });

    $("#dialog-form").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: [
            {
                text: "OK",
                click: function () {
                    if (_.isEmpty($("#comment", this).val())) {
                        alert("未入力です。");
                        return;
                    }
                    taskDetailView.set({ comments: "コメント" });
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });

    $("#comment-add-button").click(function () {
        $("#dialog-form").dialog("open");
    });
});