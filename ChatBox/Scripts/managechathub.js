$(function () {
    alert("hello")
    var chatHub = $.connection.chatHub;
    debugger;
    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId) {
        console.log(msg + ' - ' + date);
        var codeHtml = '<li class="cy">\
            <div class="msg_cotainer" >'+msg+' \
            <span class="msg_time">'+date+'</span>\
            </div ></li >';
        $('.list-msg').append(codeHtml);
        $('input[name="connectionIdActive"').val(connectionId);
    }
    $.connection.hub.start().done(function () {

        function sendMessge() {
            var msg = $('textarea').val();
            var connectionId = $('input[name="connectionIdActive"').val();
        }

    })
})