$(function () {
    var check = false;
    $('.chatbox-body').hide();
    $('.chatbox-footer').hide();
    $('.chatbox-button').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
        $('.chatbox-button').toggleClass('rotated');
    });
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    });

    var chatHub = $.connection.chatHub;
    chatHub.client.loadAllMsgOfClient = function (msg) {
        var jsonMsg = JSON.parse(msg);
        for (var i = 0; i < jsonMsg.length; i++) {
            var DateJson = jsonMsg[i].DateSend;
            var dateFormart = new Date(parseInt(DateJson.substr(6)));

            var formatted2 = formatAMPM(dateFormart);
            //console.log(dateFormart);
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                $('.chatbox-body-msg').append(AddMsgOfClient(jsonMsg[i].Msg, formatted2));
            }
            //nguoc lai thi append ben phai
            else {
                $('.chatbox-body-msg').append('<li class="float-left mt-1 chatbox-body-msg-left">' + jsonMsg[i].Msg + '</br><div class="message-time-admin">' + formatted2 + '</div></li>');
            }
        }
        var lastMsg = jsonMsg.pop();
        console.log(lastMsg);

        $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
    };

    chatHub.client.adminSendMsg = function (msg) {
        DeleteOldSeen();
        $('.chatbox-body-msg').append('<li class="float-left mt-1 new-message chatbox-body-msg-left ">' + msg + '</li >');
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
    //chatHub.client.ClientReaded = function () {
    //    if ($('li:last-child').hasClass('new-message') && $('li:last-child').) {
    //        console.log("123");
    //    }
    //};
    chatHub.client.adminReaded = function () {
        var today = new Date();
        var timeSeen = formatAMPM(today);
        console.log("Nguyen");
        var lastLi = $('.chatbox-body-msg li:last-child');
        if (lastLi.hasClass('new-message')) {
            var codeHtml = '<li class="seen"><span class="message-seen"><i class="fas fa-check"></i>Đã xem ' + timeSeen + '</span></li>';
            $(codeHtml).insertAfter(lastLi);
            lastLi.removeClass('new-message');
        }
    }
    chatHub.client.sendConnection = function (id, email) {
        $('.chatbox-title').attr('value', id);
        console.log(id);
    }


    $.connection.hub.start().done(function () {
        var input = document.getElementById("txtMsg");
        var email;
        input.addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                if ($('#txtMsg').val() != false) {
                    var fromemail = document.getElementById("txtNameEmail").value;
                    var toemail = 'admin@gmail.com';
                    var time = new Date();
                    var timeformated2 = formatAMPM(time);
                    $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val(), timeformated2));
                    chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val());
                    $('#txtMsg').val('').focus();
                    $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
                }
            }
        });
        $('.chatbox').on('click', function () {
            if (email != null) {
                var lastLi = $('.chatbox-body-msg li:last-child');
                console.log(lastLi.hasClass('float-left'));
                if (lastLi.hasClass('new-message')) {
                    var connectionId = $('.chatbox-title').val().value;
                    chatHub.server.updateIsReadMessage(connectionId, email, false);
                    lastLi.removeClass('new-message');
                }


            }
        });

        $('.chatbox-footer-content').on('click', '#btn-Send', function () {
            if ($('#txtMsg').val() != false) {
                var fromemail = 'long@gmail.com';
                var toemail = 'admin@gmail.com';
                var time = new Date();
                var timeformated2 = formatAMPM(time);

                $('.chatbox-body-msg').append(AddMsgOfClient($('#txtMsg').val(), timeformated2));
                chatHub.server.sendMsg(fromemail, toemail, $('#txtMsg').val());
                $('#txtMsg').val('').focus();
                $('.chatbox-body').animate({ scrollTop: $('.chatbox-body').prop('scrollHeight') });
            }
        });
        $('.customer-info').submit(function (e) {
            e.preventDefault();
            var startEmail = $('.customer-info input').val();
            if (startEmail.length > 0) {
                email = startEmail;
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
function DeleteOldSeen() {
    $(".chatbox-body-msg .seen:last-child").remove();

}
function AddMsgOfClient(msg, date) {
    DeleteOldSeen();
    var code = '<li class="float-right mt-1 new-message chatbox-body-msg-right">' + msg + '</br>' + '<div class="message-time">' + date + '</div>' + '</li>';
    return code;
}
