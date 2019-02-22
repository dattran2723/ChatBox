$(document).ready(function () {
    $('.list-contacts').hover(function () {

    });
    $('.list-contacts').on('click', 'li', function () {
        if ($(this).hasClass('active') == false) {
            $('.list-contacts').children('li').removeClass('active');
            $(this).addClass('active');

            var name = $(this).find('.user-name').text();
            var connectionId = $(this).find('input[name="connectionId"]').val();

            $('.user-active').text(name);
            $('input[name="connectionIdActive"]').val(connectionId);
        }
    });

    function UpdateContact(codeHtml, active, isConnect) {
        var isOnline = codeHtml.find('.img_cont span').hasClass('online');
        if (isConnect == true) {
            if (isOnline == false)
                codeHtml.find('.img_cont span').addClass('online');
        }
        else {
            if (isOnline == true)
                codeHtml.find('.img_cont span').removeClass('online');
        }
        var code = '<li class="box-item contact ' + active + '" >' + codeHtml.html() + '</li >';
        if (isConnect == true) {
            var p01 = document.getElementsByClassName("contact");
            if (p01.length == "0") {
                $('.list-contacts').append(code);
            } else {
                $(code).insertBefore(p01[0]);
            }
        }
        else {
            $('.list-contacts').append(code);
        }

    };

    var chatHub = $.connection.chatHub;
    var item;

    chatHub.client.onConnected = function (id, email, checkExist) {
        debugger
        console.log(email == "y@gmail.com" ? "yes" : "no");
        if (checkExist == false) {
            AddUser(email, id);
        }
        else {
            $(".contact").each(function () {
                var check = $(this).is('.active');
                if ($(this).find('.user_info .user-name').text() == email) {
                    this.remove();
                    item = $(this);
                    item.find('.user_info input').val(id);
                    UpdateContact(item, check == true ? 'active' : '', true);
                }
            });
        }
    };
    //OnDisconnected
    chatHub.client.onUserDisconnected = function (email) {
        console.log(email)
        $(".contact").each(function () {
            var check = $(this).is('.active');
            console.log($(this).find('.user_info .user-name').text());
            if ($(this).find('.user_info .user-name').text() == email) {
                item = $(this);
                this.remove();
                console.log(item);
                UpdateContact(item, check == true ? 'active' : '', false);
            }
        });
    }
    function AddUser(email, connectionId) {
        var code = '<li class="box-item contact">\
                        <div class="d-flex bd-highlight w-100" >\
                            <div class="img_cont">\
                                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img">\
                                    <span class="online"></span>\
                            </div>\
                            <div class="user_info">\
                                <span class="user-name">'+ email + '</span>\
                                <input type="hidden" name="connectionId" value="'+ connectionId + '" />\
                                <p></p>\
                            </div>\
                            <div class="time">\
                                <p>Yesterday</p>\
                            </div>\
                            </div >\
                        </li >';
        var p01 = document.getElementsByClassName("contact");
        if (p01.length == "0") {
            $('.list-contacts').append(code);
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
    }

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
    function appendListMsg(msg, email, date) {
        var codeHtml = '<li class="message row">\
                            <div class="img-user float-left ml-4" >\
                                <img src="~/Content/images/Avatar.png" />\
                            </div >\
                            <div class="msg-user col-9">\
                                <span class="user-name">'+ email + '</span> <small>' + date + '</small>\
                                <p class="msg-content">'+ msg + '</p>\
                            </div>\
                        </li >';
        $('.list-messages').append(codeHtml);
    }

    //Load all messeges of email
    chatHub.client.loadAllMsgByEmailOfAdmin = function (listMsg) {
        $('.list-msg').html('');
        var jsonMsg = JSON.parse(listMsg);
        console.log(jsonMsg);
        var codeHtml = '';
        for (var i = 0; i < jsonMsg.length; i++) {
            //formart datetime 
            var DateJson = jsonMsg[i].DateSend
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
            var email = $('.user-active').text();
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
    //function AddUser(email, connectionId) {
    //    var code = $('<li class="box-item contact">\
    //            <div class="d-flex bd-highlight w-100" >\
    //                <div class="img_cont">\
    //                    <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img">\
    //                        <span class="online"></span>\
    //                        </div>\
    //                    <div class="user_info">\
    //                        <span class="user-name">'+ email + '</span>\
    //                            <input type="hidden" name="connectionId" value="'+ connectionId + '" />\
    //                        <p>18 Messages</p>\
    //                    </div>\
    //                    <div class="time">\
    //                        <p>8m</p>\
    //                    </div>\
    //                </div>\
    //                </li >');
    //    var p01 = document.getElementsByClassName("contact");
    //    if (p01.length == "0") {
    //        $('.list-contacts').append(code);
    //    } else {
    //        $(code).insertBefore(p01[0]);
    //    }
    //};

    //function UpdateContact(codeHtml, isActive, isConnect) {
    //    var isOnline = codeHtml.find('.img_cont span').hasClass('online');
    //    if (isConnect == true) {
    //        if (isOnline == false)
    //            codeHtml.find('.img_cont span').addClass('online');
    //    }
    //    else {
    //        if (isOnline == true)
    //            codeHtml.find('.img_cont span').removeClass('online');
    //    }

    //    var code = $('<li class="box-item contact ' + isActive == true ? 'online' : '' + '" >' + codeHtml.html() + '</li >');

    //    if (isConnect == true) {
    //        var p01 = document.getElementsByClassName("contact");
    //        $(code).insertBefore(p01[0]);
    //    }
    //    else {
    //        $('.list-contacts').append(code);
    //    }

    //};

    //var chatHub = $.connection.chatHub;

    //chatHub.client.onConnected = function (id, email, checkExist) {
    //    if (checkExist == false) {
    //        AddUser(email, id);
    //    }
    //    else {
    //        $(".contact").each(function () {
    //            var check = $(this).is('.active');
    //            if ($(this).find('.name').text() == email) {
    //                this.remove();
    //                item = $(this);
    //                item.find('input').val(id);
    //                UpdateContact(item, check, true);
    //            }
    //        });
    //    }
    //};
    //chatHub.client.onUserDisconnected = function (email) {
    //    $(".contact").each(function () {
    //        var check = $(this).is('.active');
    //        if ($(this).find('.name').text() == email) {
    //            $(this).find('span').removeClass('online');
    //            this.remove();
    //            item = $(this);
    //            UpdateContact(item, check, false);
    //        }
    //    });
    //}

    //$.connection.hub.start().done(function () {
    //});
});