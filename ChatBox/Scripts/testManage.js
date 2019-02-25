$(document).ready(function () {
    var numberMembers = $('.list-contacts').find('li').length;
    var numberOnlines = $('.list-contacts').find('li .online').length;
    $('member').html(numberMembers);
    $('online').html(numberOnlines);

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
        if (checkExist == false) {
            AddUser(email, id);
            numberMembers += 1;
            numberOnlines += 1;
            $('member').html(numberMembers);
            $('online').html(numberOnlines);
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
            numberOnlines += 1;
            $('online').html(numberOnlines);
        }
    };
    //OnDisconnected
    chatHub.client.onUserDisconnected = function (email) {
        $(".contact").each(function () {
            var check = $(this).is('.active');
            if ($(this).find('.user_info .user-name').text() == email) {
                item = $(this);
                this.remove();
                UpdateContact(item, check == true ? 'active' : '', false);
            }
        });
        numberOnlines -= 1;
        $('online').html(numberOnlines);
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
            if ($(this).find('.user_info .user-name').text() == email) {
                if (msg.length > 20) {
                    $(this).find('.user_info p').html(msg.slice(0, 20) + '...');
                }
                else {
                    $(this).find('.user_info p').html(msg);
                }
            }
        });
    }

    //Code append a message to list messages
    function appendListMsg(msg, email, date) {
        var codeHtml = '<li class="message row">\
                            <div class="img-user float-left ml-4" >\
                                <img src="/Content/images/Avatar.png" />\
                            </div >\
                            <div class="msg-user col-9">\
                                <span class="user-name">'+ email + '</span> <small>' + date + '</small>\
                                <p class="msg-content">'+ msg + '</p>\
                            </div>\
                        </li >';
        $('.list-messages').append(codeHtml);
    }
    function appendListMsgClient(msg, email, date) {
        var showDate = date.getHours() < 13 ? date.getHours() + ':' + date.getMinutes() + ' AM' : (date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
        var codeHtml = '<li class="message row cl">\
                            <div class= "img-user float-left ml-4" >\
                                <img src="/Content/images/Avatar.png" />\
                            <input type="hidden" name="date" value = "'+ date + '" />\
                                        </div>\
                            <div class="msg-user col-9">\
                                <span class="user-name">'+ email + '</span> <small>' + showDate + '</small>\
                                <ul class="list-msg-content p-0">\
                                    <li class="msg-content">'+ msg + '</li>\
                                </ul>\
                            </div>\
                        </li>';
        $('.list-messages').append(codeHtml);
    }
    function appendListMsgAdmin(msg, date) {
        var showDate = date.getHours() < 13 ? date.getHours() + ':' + date.getMinutes() + ' AM' : (date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
        var codeHtml = '<li class="message row ad">\
                            <input type="hidden" name="date" value = "'+ date + '" />\
                            <div class="msg-user col-9" >\
                                <small>'+ showDate + '</small> <br />\
                                <ul class="list-msg-content p-0">\
                                    <li class="msg-content">'+ msg + '</li>\
                                </ul>\
                            </div >\
                            <div class="img-user float-right">\
                                <img src="/Content/images/Avatar.png" />\
                            </div>\
                        </li >';
        $('.list-messages').append(codeHtml);
    }
    function appendGroupMsg(msg) {
        $('.list-messages li:last-child').find('.list-msg-content').append('<li class="msg-content">' + msg + '</li>');
    }

    function diffDays(date, nextDate) {
        var timeDiff = Math.abs(nextDate.getTime() - date.getTime());
        var diff = Math.round(timeDiff / (1000 * 3600 * 24));
        console.log(nextDate + ' ===== ' + date + " = " + diff);
        return diff;
    }

    function diffTimes(date, nextDate) {
        var timeDiff = Math.abs(nextDate.getTime() - date.getTime());
        var diff = Math.round(timeDiff / (1000 * 60));
        return diff;
    }

    function addDateIntoListMessages(date) {
        var now = new Date();
        var showDay;
        var diffday = diffDays(date, now);

        if (diffday <= 7) {
            switch (diffday) {
                case 0: showDay = "Hôm nay"; break;
                case 1: showDay = "Hôm qua"; break;
                default: showDay = date.getDay == 7 ? "Chủ nhật" : "Thứ " + (date.getDay() + 1);
            }
        }
        else {
            showDay = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
        }
        var codeHtml = '<li class="space row">\
                         <div class= "dash float-left ml-0" ></div > <span class="date">'+
            showDay + '</span> <div class="dash float-right mr-0"></div>\
                         </li >';
        $('.list-messages').append(codeHtml);
    }
    //Load all messeges of email
    chatHub.client.loadAllMsgByEmailOfAdmin = function (listMsg) {
        $('.list-messages').html('');
        var email = $('.user-active').text();
        var jsonMsg = JSON.parse(listMsg);
        for (var i = 0; i < jsonMsg.length; i++) {
            //formart datetime 
            var DateJson = jsonMsg[i].DateSend;
            var dateFormart = new Date(parseInt(DateJson.substr(6)));
            if (i == 0) {
                addDateIntoListMessages(dateFormart);
            }

            if (email == jsonMsg[i].FromEmail) {
                if (i > 0 && jsonMsg[i - 1].FromEmail == email && diffTimes(new Date(parseInt(jsonMsg[i - 1].DateSend.substr(6))), dateFormart) < 30)
                    appendGroupMsg(jsonMsg[i].Msg);
                else
                    appendListMsgClient(jsonMsg[i].Msg, jsonMsg[i].FromEmail, dateFormart)
            }
            else {
                if (i > 0 && jsonMsg[i - 1].FromEmail != email && diffTimes(new Date(parseInt(jsonMsg[i - 1].DateSend.substr(6))), dateFormart) < 30)
                    appendGroupMsg(jsonMsg[i].Msg);
                else
                    appendListMsgAdmin(jsonMsg[i].Msg, dateFormart);
            }

            if (i < jsonMsg.length - 1) {
                var nextDate = new Date(parseInt(jsonMsg[i + 1].DateSend.substr(6)));
                if (nextDate.getDate() != dateFormart.getDate() || nextDate.getMonth() != nextDate.getMonth() || nextDate.getFullYear() != nextDate.getFullYear()) {
                    addDateIntoListMessages(nextDate);
                }
            }
        }
        $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
    }
    $.connection.hub.start().done(function () {
        //Send message from admin to client
        function sendMessge(email, msg) {
            var connectionId = $('input[name="connectionIdActive"').val();
            var dateSend = new Date();
            var emailLiLast = $('.list-messages li:last-child').find('.user-name').text();
            var dateLiLast = $('.list-messages li:last-child').find('input[name="date"]').val();
            var date = new Date(dateLiLast);
            if (email != emailLiLast && diffTimes(date, dateSend) < 30) {
                appendGroupMsg(msg);
            } else {
                appendListMsgAdmin(msg, dateSend);
            }
            $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
            chatHub.server.sendPrivateMessage(email, msg, connectionId);
            $('textarea').val('').focus();
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
                var email = $('.user-active').text();
                var msg = $('textarea').val();
                if (msg == false) {
                    return false;
                }
                sendMessge(email, msg);
                addMsgInListContact(email, msg);
            }
        });

        //event click a li (a contact) in ul (list contact)
        $('.list-contacts').on('click', 'li', function () {
            if ($(this).hasClass('active') == false) {
                $('.list-contacts').children('li').removeClass('active');
                $(this).addClass('active');

                var name = $(this).find('.user-name').text();
                var connectionId = $(this).find('input[name="connectionId"]').val();

                $('.user-active').text(name);
                $('input[name="connectionIdActive"]').val(connectionId);

                var email = $(this).find('.user_info .user-name').text();
                chatHub.server.loadMsgByEmailOfAdmin(email);
            }
        });

        //$('.left ul').on('click', 'li', function () {
        //    if ($(this).hasClass('active') == false) {
        //        $('.left ul').children('li').removeClass('active');
        //        $(this).addClass('active');

        //        var name = $(this).find('.name').text();
        //        var connectionId = $(this).find('input[name="connectionId"]').val();

        //        $('#name-chat').html(name);
        //        $('input[name="connectionIdActive"').val(connectionId);
        //        $('.input-group').removeClass('d-none');

        //        var email = $(this).find('.name').text();
        //        chatHub.server.loadMsgByEmailOfAdmin(email);
        //    }

        //});

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