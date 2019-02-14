$(function () {
    var chatHub = $.connection.chatHub;
    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId, email) {
        var connectionIdActive = $('input[name="connectionIdActive"').val();
        if (connectionId == connectionIdActive) {
            appendListMsg(msg, date, 'cy');
        }
        addMsgInListContact(email, msg);
        //appendListMsg(msg, date, 'cy');
        //$('#name-chat').html(email);
        //$('input[name="connectionIdActive"').val(connectionId);
    }
    function addMsgInListContact(email, msg) {
        $(".contact").each(function () {
            if ($(this).find('.name').text() == email) {
                if (msg.length > 20) {
                    $(this).find('.preview').html(msg.slice(0, 20) + '...');
                }
                else {
                    $(this).find('.preview').html(msg);
                }
            }
        });
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
        var codeHtml = '';
        for (var i = 0; i < jsonMsg.length; i++) {
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                codeHtml = codeHtml + '<li class="cy">\
                            <div class="msg_cotainer" >'+ jsonMsg[i].Msg + ' \
                            <span class="msg_time">'+ jsonMsg[i].DateSend + '</span>\
                            </div ></li >';
            }
            else {
                codeHtml = codeHtml + '<li class="cm">\
                            <div class="msg_cotainer" >'+ jsonMsg[i].Msg + ' \
                            <span class="msg_time">'+ jsonMsg[i].DateSend + '</span>\
                            </div ></li >';
            }
        }
        $('.list-msg').append(codeHtml);
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
            if ($(this).hasClass('active') == false) {
                $('.left ul').children('li').removeClass('active');
                $(this).addClass('active');

                var name = $(this).find('.name').text();
                var connectionId = $(this).find('input[name="connectionId"]').val();

                $('#name-chat').html(name);
                $('input[name="connectionIdActive"').val(connectionId);

                var email = $(this).find('.name').text();
                chatHub.server.loadMsgByEmailOfAdmin(email);
            }

        });
    })
})