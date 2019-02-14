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
    }
    $.connection.hub.start().done(function () {
        console.log('ss')
    })
})