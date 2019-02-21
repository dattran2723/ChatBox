$(document).ready(function () {
    var chatHub = $.connection.chatHub;
    var item;
    chatHub.client.onConnected = function (id, email, checkExist) {
        if (checkExist == false) {
            AddUser(email, id);
        }
        else {
            $(".contact").each(function () {
                var check = $(this).is('.active');
                if ($(this).find('.name').text() == email) {
                    this.remove();
                    item = $(this);
                    item.find('input').val(id);
                    item.find('span').removeClass('offline');
                    item.find('span').addClass('online');
                    var code;
                    if (check == true) {
                        code = '<li class="contact active">' + item.html() + '</li>';
                        $('input[name="connectionIdActive"').val(id);
                    }
                    else
                        code = '<li class="contact">' + item.html() + '</li>';
                    var p01 = document.getElementsByClassName("contact");
                    $(code).insertBefore(p01[0]);
                }
            });
        }
        //AddUser(email, id);
    };
    //OnDisconnected
    chatHub.client.onUserDisconnected = function (email) {
        console.log(email)
        $(".contact").each(function () {
            var check = $(this).is('.active');
            if ($(this).find('.name').text() == email) {
                this.remove();
                item = $(this);
                item.find('span').removeClass('online');
                item.find('span').addClass('offline');
                var code;
                if (check == true)
                    code = '<li class="contact active">' + item.html() + '</li>';
                else
                    code = '<li class="contact">' + item.html() + '</li>';
                console.log(code);
                $('.listUser').append(code);
            }
        });
    };

    function AddUser(email, connectionId) {
        var code = $('<li class="contact">\
                <input type = "hidden" name = "connectionId" value = "'+ connectionId + '" />\
                <div class="wrap row">\
                    <div class="col-2 contact-status">\
                        <span class="online"></span>\
                    </div>\
                    <div class="col-10 meta">\
                        <p class="name">'+ email + '</p>\
                        <small class="preview"></small>\
                    </div>\
                </div>\
            </li >');
        var p01 = document.getElementsByClassName("contact");
        if (p01.length == "0") {
            $('.listUser').append(code);
        } else {
            $(code).insertBefore(p01[0]);
        }
    }

    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId, email) {
        var connectionIdActive = $('input[name="connectionIdActive"').val();
        if (connectionId == connectionIdActive) {
            var d = new Date(date);
            var dateSend = d.getHours() + ':' + d.getMinutes() + ' ' + ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + d.getFullYear();
            appendListMsg(msg, dateSend, 'cy');
            $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
        }
        addMsgInListContact(email, msg);
    };

    //Code append tin nhắn mới nhất vào dưới email trong list contact
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

    //Code append a message to list messages
    function appendListMsg(msg, date, className) {
        var codeHtml = '<li class="msg ' + className + '">\
            <div class="msg_cotainer" >'+ msg + ' \
            <span class="msg_time d-none">'+ date + '</span>\
            </div ></li >';
        $('.list-msg').append(codeHtml);
    }

    //Load all messeges of email
    chatHub.client.loadAllMsgByEmailOfAdmin = function (listMsg) {
        $('.list-msg').html('');
        var jsonMsg = JSON.parse(listMsg);
        console.log(jsonMsg);
        var codeHtml = '';
        for (var i = 0; i < jsonMsg.length; i++) {
            //formart datetime 
            var DateJson = jsonMsg[i].DateSend;
            var dateFormart = new Date(parseInt(DateJson.substr(6)));
            var formatted = dateFormart.getHours() + ":" +
                dateFormart.getMinutes() + " " +
                ("0" + dateFormart.getDate()).slice(-2) + "-" +
                ("0" + (dateFormart.getMonth() + 1)).slice(-2) + "-" +
                dateFormart.getFullYear();
            if (jsonMsg[i].FromEmail != 'admin@gmail.com') {
                appendListMsg(jsonMsg[i].Msg, formatted, 'cy');
            }
            else {
                appendListMsg(jsonMsg[i].Msg, formatted, 'cm');
            }
        }
        $('.list-msg').append(codeHtml);
        $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
    }
    $.connection.hub.start().done(function () {
        //Send message from admin to client
        function sendMessge(email, msg) {
            var connectionId = $('input[name="connectionIdActive"').val();
            var d = new Date();
            var dateSend = d.getHours() + ':' + d.getMinutes() + ' ' + ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + d.getFullYear();
            appendListMsg(msg, dateSend, 'cm');
            $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
            chatHub.server.sendPrivateMessage(email, msg, connectionId);
            $('textarea').val(null);
        }

        //event click button send message
        $('.input-group').on('click', '.send', function () {
            var email = $('#name-chat').text();
            var msg = $('textarea').val();
            if (msg == false) {
                return false;
            }
            sendMessge(email, msg);
            addMsgInListContact(email, msg);
        });

        //event press enter
        $(window).on('keydown', function (e) {
            if (e.which == 13) {
                var email = $('#name-chat').text();
                var msg = $('textarea').val();
                if (msg == false) {
                    return false;
                }
                sendMessge(email, msg);
                addMsgInListContact(email, msg);
            }
        });

        //event click a li (a contact) in ul (list contact)
        $('.left ul').on('click', 'li', function () {
            if ($(this).hasClass('active') == false) {
                $('.left ul').children('li').removeClass('active');
                $(this).addClass('active');

                var name = $(this).find('.name').text();
                var connectionId = $(this).find('input[name="connectionId"]').val();

                $('#name-chat').html(name);
                $('input[name="connectionIdActive"').val(connectionId);
                $('.input-group').removeClass('d-none');

                var email = $(this).find('.name').text();
                chatHub.server.loadMsgByEmailOfAdmin(email);
            }

        });

        //event click a li (a message) in ul (list messages) show datetime
        $('.list-msg').on('click', 'li', function () {
            $(".msg").each(function (index) {
                if ($(this).find('span').hasClass('d-none') == false) {
                    $(this).find('span').addClass('d-none');
                }
            });
            $(this).find('span').removeClass('d-none');
        })
    });

});