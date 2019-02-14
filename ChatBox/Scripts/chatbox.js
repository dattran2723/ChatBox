$(function () {
    $('.chatbox-body').hide();
    $('.chatbox-footer').hide();
    $('.chatbox-title').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
    });
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    });

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
        });
    });
    console.log($('.chatbox-body > .chatbox-body-msg-right').length);
    $('.customer-info').submit(function (e) {
        e.preventDefault();
        var email = $('.customer-info input').val();
        if (email.length > 0) {
            chatHub.server.connect(email);
        }
        $('.customer-info').hide();
        $('.chatbox-body').show();
        $('.chatbox-footer').show();
        //chatHub.connection.connect(email);
    });
    
});
//code using append when client send message
function AddMsgOfClient(msg) {
    var code = '<li class="float-right mt-1 chatbox-body-msg-right">' + msg + '</li>';
    return code;
}
    //var chatHub = $.connection.myHub;
    //$.connection.hub.start().done(function () {
    //    if ($('#btn-StartChat').click(function () {
    //        chatHub.server.connected($('#txtEmail').val());
    //        $('.login').hide();
    //    }));
    //})
