$(function () {
    var chatHub = $.connection.chatHub;
    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId) {
        var codeHtml = '<li class="cy">\
            <div class="msg_cotainer" >'+msg+' \
            <span class="msg_time">'+date+'</span>\
            </div ></li >';
        $('.list-msg').append(codeHtml);
    }
})