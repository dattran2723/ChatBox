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
    chatHub.client.loadAllMsgOfClient = function (msg) {
        var jsonMsg = JSON.parse(msg);
        for (var i = 0; i < jsonMsg.length; i++) {
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                $('.chatbox-body-msg').append(AddMsgOfClient(jsonMsg[i].Msg));
            }
            else {
                $('.chatbox-body-msg').append('<li class="float-left mt-1 chatbox-body-msg-left">' + jsonMsg[i].Msg + '</li >');
            }
        }
        $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
    };

    chatHub.client.adminSendMsg = function (msg) {
        $('.chatbox-body-msg').append('<li class="float-left mt-1 chatbox-body-msg-left">' + msg + '</li >');
    };
    chatHub.client.sendA = function (a) {
        if (a == true) {
            if (confirm('Bạn có muốn ngắt kết nối ở trình duyệt cũ không ?')) {
                chatHub.client.sameEmail = function () {}
            } else {
                $('.customer-info').show();
                $('.chatbox-body').hide();
                $('.chatbox-footer').hide();
            }
        }


    };
    chatHub.client.sendError = function (b) {
        if (b == true) {
            alert("Kết nối đã bị ngắt");
        }
    };

    $.connection.hub.start().done(function () {

        var input = document.getElementById("txtMsg");
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                if ($('#txtMsg').val() != false) {
                    var fromemail = document.getElementById("txtNameEmail").value;
                    var toemail = 'admin@gmail.com';
                    $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val()));
                    chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val())
                    $('#txtMsg').val('').focus();
                    $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
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
                $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
            }
        });
        $('.customer-info').submit(function (e) {
            e.preventDefault();
            var email = $('.customer-info input').val();
            if (email.length > 0) {
                chatHub.server.connect(email);
                chatHub.server.loadMsgOfClient(email);
                document.getElementById("txtNameEmail").value = email;
            }
            $('.customer-info').hide();
            $('.chatbox-body').show();
            $('.chatbox-footer').show();
            //chatHub.connection.connect(email);
        });
    });

});
//code using append when client send message
function AddMsgOfClient(msg) {
    var code = '<li class="float-right mt-1 chatbox-body-msg-right">' + msg + '</li>';
    return code;
}
