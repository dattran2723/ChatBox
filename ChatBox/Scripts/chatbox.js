$(function () {
    $('.chatbox-title').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
    })
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    })

    var chatHub = $.connection.chatHub;
    $.connection.hub.start().done(function () {
        var input = document.getElementById("txtMsg");
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                if ($('#txtMsg').val() != false) {
                    var fromemail = 'long@gmail.com';
                    var toemail = 'admin@gmail.com';
                    $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val()));
                    chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val())
                    $('#txtMsg').val('').focus();
                }
            }
        });
        $('.chatbox-footer-content').on('click', '#btn-Send', function () {
            if ($('#txtMsg').val() != false) {
                var fromemail = 'long@gmail.com';
                var toemail = 'admin@gmail.com';
                var codeImg = '<img src="/Imgs/avatar5.png"/>';
                $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val()));
                chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val());
                $('#txtMsg').val('').focus();
            }
        })
    })
    console.log($('.chatbox-body > .chatbox-body-msg-right').length)
})
//code using append when client send message
function AddMsgOfClient(msg) {
    var code = '<li class="float-right mt-1 chatbox-body-msg-right">' + msg + '</li>';
    return code;
}