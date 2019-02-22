﻿$(function () {
    $('.chatbox-body').hide();
    $('.chatbox-footer').hide();
    $('.chatbox-button').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
        $('.chatbox-button').toggleClass('rotated');
        var src = $('.chatbox-button img').attr('src');
        //if ($('.chatbox-button img').attr('src') === src) {
        //    $('.chatbox-button img').attr('src', '~/Imgs/Group 41.png');
        //} else {
        //    $('.chatbox-button img').attr('src', src);
        //}
    });
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    });
    var chatHub = $.connection.chatHub;
    chatHub.client.loadAllMsgOfClient = function (msg) {
        var jsonMsg = JSON.parse(msg);
        for (var i = 0; i < jsonMsg.length; i++) {
            var DateJson = jsonMsg[i].DateSend;
            var dateFormart = new Date(parseInt(DateJson.substr(6)));
            var formatted = dateFormart.getHours() + ":" +
                dateFormart.getMinutes();
            //kiem tra for, neu msg do FromEmail khac admin@gmail.com thi append ben trai
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                $('.chatbox-body-msg').append(AddMsgOfClient(jsonMsg[i].Msg, formatted));
            }
            //nguoc lai thi append ben phai
            else {
                $('.chatbox-body-msg').append('<li class="float-left mt-1 chatbox-body-msg-left">' + jsonMsg[i].Msg + '</br><div class="message-time-admin">' + formatted + '</div></li>');
            }
        }
        $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
    };

    chatHub.client.adminSendMsg = function (msg) {
        $('.chatbox-body-msg').append('<li class="float-left mt-1 chatbox-body-msg-left">' + msg + '</li >');
        $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
    };
    chatHub.client.checkIsOnline = function () {
        var fromemail = document.getElementById("txtNameEmail").value;
        if (confirm('Bạn có muốn ngắt kết nối ở trình duyệt cũ không ?')) {
            chatHub.server.changeTab(fromemail);
        } else {
            $('.customer-info').show();
            $('.chatbox-body').hide();
            $('.chatbox-footer').hide();
        }
    };
    chatHub.client.sendError = function () {
        alert("Kết nối đã bị ngắt");
    };

    $.connection.hub.start().done(function () {
        var input = document.getElementById("txtMsg");
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                if ($('#txtMsg').val() != false) {
                    var fromemail = document.getElementById("txtNameEmail").value;
                    var toemail = 'admin@gmail.com';
                    var time = new Date();
                    var timeformated = time.getHours() + ":" + time.getMinutes();
                    $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val(), timeformated));
                    chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val());
                    $('#txtMsg').val('').focus();
                    $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
                }
            }
        });

        $('.chatbox-footer-content').on('click', '#btn-Send', function () {
            if ($('#txtMsg').val() != false) {
                var fromemail = 'long@gmail.com';
                var toemail = 'admin@gmail.com';
                var time = new Date();
                var timeformated = time.getHours() + ":" + time.getMinutes();
                console.log(timeformated);
                $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val(), timeformated));
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
            $('.chatbox-title span').text(email);
            $('.customer-info').hide();
            $('.chatbox-body').show();
            $('.chatbox-footer').show();

            //chatHub.connection.connect(email);
        });
    });

});
//code using append when client send message
function AddMsgOfClient(msg, date) {
    var code = '<li class="float-right mt-1 chatbox-body-msg-right">' + msg + '</br>' + '<div class="message-time">' + date + '</div>' + '</li>';
    return code;
}
