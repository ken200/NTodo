$(function () {
    var taskDetailView = ntodo.views.taskDetailView;

    $(".regist-task-list-item").click(function () {
        taskDetailView.clear();
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
        width: 280,
        modal: true,
        buttons: [
            {
                text: "OK",
                click: function () {
                    var val = $("#comment", this).val();
                    if (_.isEmpty(val)) {
                        alert("未入力です。");
                        return;
                    }
                    taskDetailView.set({ comments: val });
                    $("#comment", this).val("");
                    $(this).dialog("close");
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