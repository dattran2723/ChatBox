$(function () {
    var chatHub = $.connection.chatHub;
    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId, email) {
        var connectionIdActive = $('input[name="connectionIdActive"').val();
        if (connectionId == connectionIdActive) {
            appendListMsg(msg, date, 'cy');
        } else {

        }

        //appendListMsg(msg, date, 'cy');
        //$('#name-chat').html(email);
        //$('input[name="connectionIdActive"').val(connectionId);
    }

    function appendListMsg(msg, date, className) {
        var codeHtml = '<li class="' + className + '">\
            <div class="msg_cotainer" >'+ msg + ' \
            <span class="msg_time">'+ date + '</span>\
            </div ></li >';
        $('.list-msg').append(codeHtml);
        $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
    }

    chatHub.client.loadAllMsgByEmailOfAdmin = function (listMsg) {
        $('.list-msg').html('');
        var jsonMsg = JSON.parse(listMsg);
        for (var i = 0; i < jsonMsg.length; i++) {
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                appendListMsg(jsonMsg[i].Msg, jsonMsg[i].DateSend,'cy')
            }
            else {
                appendListMsg(jsonMsg[i].Msg, jsonMsg[i].DateSend, 'cm')
            }
        }
        $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
    }

    $.connection.hub.start().done(function () {

        function sendMessge() {
            var email = $('#name-chat').text();
            var msg = $('textarea').val();
            if (msg == "") {
                return false;
            }
            var connectionId = $('input[name="connectionIdActive"').val();
            appendListMsg(msg, "11h", 'cm');
            chatHub.server.sendPrivateMessage(email, msg, connectionId);
            $('textarea').val(null);
        }

        $('.input-group').on('click', '.send', function () {
            sendMessge();
        });

        $(window).on('keydown', function (e) {
            if (e.which == 13) {
                sendMessge();
            }
        });
        $('.left ul').on('click', 'li', function () {
            var email = $(this).find('.name').text();
            chatHub.server.loadMsgByEmailOfAdmin(email);
        });
    })
})