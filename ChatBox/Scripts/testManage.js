$(document).ready(function () {
    // lấy số người dùng và người đang hoạt động
    var numberMembers = $('.list-contacts').find('li').length;
    var numberOnlines = $('.list-contacts').find('li .online').length;
    //hiển thị số người dùng và số người đang hoạt đông
    $('member').html(numberMembers);
    $('online').html(numberOnlines);

    var chatHub = $.connection.chatHub;
    var item;



    //Trả về chuổi hiển thị thời gian (giờ : phút : AM or PM)
    function ShowTime(d) {
        var date = new Date(d);
        return date.getHours() < 13 ? date.getHours() + ':' + date.getMinutes() + ' AM' : (date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
    }

    //so sánh ngày
    function diffDays(date, nextDate) {
        var dateDiff;
        if (nextDate.getMonth() == date.getMonth() && nextDate.getFullYear() == date.getFullYear()) {
            dateDiff = Math.abs(nextDate.getDate() - date.getDate());
        }
        else {
            var timeDiff = Math.abs(nextDate.getTime() - date.getTime());
            dateDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        }
        return dateDiff;
    }

    //so sánh thời gian
    function diffTimes(date, nextDate) {
        var timeDiff = Math.abs(nextDate.getTime() - date.getTime());
        var diff = Math.floor(timeDiff / (1000 * 60));
        return diff;
    }

    //Trả về chuỗi hiển thì ngày tháng (hôm nay hoặc hôm qua, thứ , ngày tháng nắm)
    function ShowDay(d) {
        var now = new Date();
        var date = new Date(d);
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
        return showDay;
    }

    //Thêm contact vào list-contacts
    function AddUser(email, connectionId) {
        var code = '<li class="box-item contact">\
                        <div class="d-flex bd-highlight w-100" >\
                            <div class="img_cont">\
                                <div class="rounded-circle user_img">'+ email.substr(0, 2).toUpperCase() + '</div>\
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
        if (p01.length == "0") {                                                                    //Kiểm tra trong list-contacts có trống ?
            $('.list-contacts').append(code);                                                       //Nếu trống thì append trực tiếp
        } else {
            $(code).insertBefore(p01[0]);                                                           //Nếu không => insert lên trên cùng
        }
    }

    //Cập nhật liên hệ (contact) khi connect hoặc disconnect
    function UpdateContact(codeHtml, active, isConnect) {
        var isOnline = codeHtml.find('.img_cont span').hasClass('online');                          //kiểm tra trạng thái hoạt động
        if (isConnect == true) {                                                                    //Nếu connect thì trạng thái sẽ chuyển sang online
            if (isOnline == false)
                codeHtml.find('.img_cont span').addClass('online');
        }
        else {                                                                                      //Nếu disconnect thì trạng sẽ chuyển quan offline
            if (isOnline == true)
                codeHtml.find('.img_cont span').removeClass('online');
        }
        var code = '<li class="box-item contact ' + active + '" >' + codeHtml.html() + '</li >';
        if (isConnect == true) {                                                                    //Nếu connect sẽ chuyển contact đó lên đầu tiên
            var p01 = document.getElementsByClassName("contact");
            if (p01.length == "0") {
                $('.list-contacts').append(code);
            } else {
                $(code).insertBefore(p01[0]);
            }
        }
        else {                                                                                      //Nếu disconnect sẽ chuyển contact đó xuống dưới các thẻ đang online
            //$('.list-contacts').append(code);
            var countOnline = $('.list-contacts .contact .img_cont .online').length;
            if (countOnline != 0)
                $(code).insertAfter($('.contact')[countOnline - 1]);
            else
                $(code).insertBefore($('.contact')[0]);
        }

    }

    //connect
    chatHub.client.onConnected = function (id, email, checkExist) {
        if (checkExist == false) {                                                                  //Nếu không tồn tại
            AddUser(email, id);                                                                     //Thêm contact vào list-contacts

            numberMembers += 1;                                                                     //Cập nhật lại số người dùng và online
            numberOnlines += 1;
            $('member').html(numberMembers);
            $('online').html(numberOnlines);
        }
        else {                                                                                      //nếu đã tồn tại
            $(".contact").each(function () {
                var check = $(this).is('.active');                                                  //Kiểm tra có đang active không?
                if ($(this).find('.user_info .user-name').text() == email) {
                    this.remove();
                    item = $(this);
                    item.find('.user_info input').val(id);
                    UpdateContact(item, check == true ? 'active' : '', true);

                    if ($('.user-active').text() == email) {                                          //cập nhật lại trạng thái và connectionId bên chat
                        $('.chat-header .onl').addClass('fa-circle');
                        $('input[name="connectionIdActive"]').val(id);
                    }

                }
            });

            numberOnlines += 1;                                                                     //Cập nhật lại số người online
            $('online').html(numberOnlines);
        }
    }

    //OnDisconnected
    chatHub.client.onUserDisconnected = function (email) {
        $(".contact").each(function () {
            var check = $(this).is('.active');
            if ($(this).find('.user_info .user-name').text() == email) {
                item = $(this);
                this.remove();
                UpdateContact(item, check == true ? 'active' : '', false);
                if ($('.user-active').text() == email)
                    $('.chat-header .onl').removeClass('fa-circle');
            }
        });
        numberOnlines -= 1;
        $('online').html(numberOnlines);
    }

    //Xóa dòng thông báo đã xem tin nhắn
    function ClearSeen() {
        var lastLi = $('.list-messages .message:last-child');
        if (lastLi.find('.seen')) {
            lastLi.find('.seen').remove();
        }
    }

    //gôm tin nhắn của cùng một người
    function appendGroupMsg(msg, isRead) {
        var status = isRead == false ? 'new' : '';
        $('.list-messages li:last-child').find('.list-msg-content').append('<li class="msg-content ' + status + '">' + msg + '</li>');
    }

    //Thêm dòng ngăn cách thời gian của 2 message trong list-message
    function addDateIntoListMessages(date) {
        var showDay = ShowDay(date);
        var codeHtml = '<li class="space row">\
                         <div class= "dash float-left ml-0" ></div > <span class="date">'+
            showDay + '</span> <div class="dash float-right mr-0"></div>\
                         </li >';
        $('.list-messages').append(codeHtml);
    }


    //Thêm tin nhắn của client vào list-messages
    function appendListMsgClient(msg, email, date, isRead) {
        var status = isRead == false ? 'new' : '';
        var showTime = ShowTime(date);
        var codeHtml = '<li class="message row cl">\
                            <div class= "img-user float-left ml-4" >\
                                <div class="rounded-circle user_img">'+ email.substr(0, 2).toUpperCase() + '</div>\
                            <input type="hidden" name="date" value = "'+ date + '" />\
                                        </div>\
                            <div class="msg-user col-9">\
                                <span class="user-name">'+ email + '</span> <small>' + showTime + '</small>\
                                <ul class="list-msg-content p-0">\
                                    <li class="msg-content '+ status + '">' + msg + '</li>\
                                </ul>\
                            </div>\
                        </li>';
        $('.list-messages').append(codeHtml);
    }

    //Thêm tin nhắn của admin vào list-messages
    function appendListMsgAdmin(msg, date) {
        var showTime = ShowTime(date);
        var codeHtml = '<li class="message row ad">\
                            <input type="hidden" name="date" value = "'+ date + '" />\
                            <div class="msg-user col-9" >\
                                <small>'+ showTime + '</small> <br />\
                                <ul class="list-msg-content p-0">\
                                    <li class="msg-content">'+ msg + '</li>\
                                </ul>\
                            </div >\
                            <div class="img-user float-right">\
                                <img src="/Content/images/administrator.png"" />\
                            </div>\
                        </li >';
        $('.list-messages').append(codeHtml);
    }

    //Cập nhật tin nhắn mới nhất vào contact trong list contact
    function addMsgInListContact(email, msg, date, isAdmin) {
        var isNew = isAdmin == false ? 'new-msg' : '';
        var showTime = ShowTime(date);

        $(".contact").each(function () {                                                            //Kiểm tra từng contact
            if ($(this).find('.user_info .user-name').text() == email) {                            //xem tin nhắn thuộc conntact nào
                $(this).find('.user_info p').addClass(isNew);
                if (msg.length > 20) {                                                              //nếu nôi dung tin nhắn dài quá 20 ký tự sẽ rút gọn lại
                    $(this).find('.user_info p').html(msg.slice(0, 20) + '...');
                }
                else {
                    $(this).find('.user_info p').html(msg);
                }
                $(this).find('.time p').html(showTime);                                             //Cập nhật lại thời gian tin nhắn mới nhất
            }
        });
    }

    //Thêm dòng "đã xem" vào dưới message
    function AppendSeenToMessage(date) {
        var lastLi = $('.list-messages .message:last-child');
        var showTime = ShowTime(date);
        var codeHtml = '<small class="seen">Đã xem ' + showTime + '</small>';
        lastLi.find('.msg-user').append(codeHtml);
        $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
    }

    //Load all messeges of email
    chatHub.client.loadAllMsgByEmailOfAdmin = function (listMsg) {
        $('.list-messages').html('');
        var email = $('.user-active').text();
        var jsonMsg = JSON.parse(listMsg);
        var len = jsonMsg.length;
        if (len == 0)
            return false;
        for (var i = 0; i < len; i++) {
            //formart datetime 
            var DateJson = jsonMsg[i].DateSend;
            var dateFormart = new Date(parseInt(DateJson.substr(6)));
            if (i == 0) {
                addDateIntoListMessages(dateFormart);
            }

            if (email == jsonMsg[i].FromEmail) {
                if (i > 0 && jsonMsg[i - 1].FromEmail == email && diffTimes(new Date(parseInt(jsonMsg[i - 1].DateSend.substr(6))), dateFormart) < 30)
                    appendGroupMsg(jsonMsg[i].Msg, jsonMsg[i].IsRead);
                else
                    appendListMsgClient(jsonMsg[i].Msg, jsonMsg[i].FromEmail, dateFormart, jsonMsg[i].IsRead)
            }
            else {
                if (i > 0 && jsonMsg[i - 1].FromEmail != email && diffTimes(new Date(parseInt(jsonMsg[i - 1].DateSend.substr(6))), dateFormart) < 30)
                    appendGroupMsg(jsonMsg[i].Msg, true);
                else
                    appendListMsgAdmin(jsonMsg[i].Msg, dateFormart);
            }

            if (i < len - 1) {
                var nextDate = new Date(parseInt(jsonMsg[i + 1].DateSend.substr(6)));
                if (nextDate.getDate() != dateFormart.getDate() || nextDate.getMonth() != nextDate.getMonth() || nextDate.getFullYear() != nextDate.getFullYear()) {
                    addDateIntoListMessages(nextDate);
                }
            }
        }
        console.log(jsonMsg[len - 1].DateRead);
        if (jsonMsg[len - 1].FromEmail != email && jsonMsg[len - 1].IsRead == true) {
            var date = new Date(parseInt(jsonMsg[len - 1].DateRead.substr(6)));
            AppendSeenToMessage(date);
        }
        $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
    }

    //Client gửi tin nhắn cho admin
    chatHub.client.sendMsgForAdmin = function (msg, date, connectionId, email) {
        var connectionIdActive = $('input[name="connectionIdActive"').val();                        //Lấy connectionId đang active
        console.log(connectionId + "   " + connectionIdActive);
        if (connectionId == connectionIdActive) {                                                   //nếu đang active sẽ thêm message vào list-messages
            var dateSend = new Date(date);
            var emailLiLast = $('.list-messages li:last-child').find('.user-name').text();
            var dateLiLast = $('.list-messages li:last-child').find('input[name="date"]').val();
            var date = new Date(dateLiLast);
            //console.log(msg);
            ClearSeen();
            if (email == emailLiLast && diffTimes(date, dateSend) < 30) {
                appendGroupMsg(msg, false);
            } else {
                if (diffDays(date, dateSend) > 0)
                    addDateIntoListMessages(dateSend);
                appendListMsgClient(msg, email, dateSend, false);
            }
            $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
        }
        addMsgInListContact(email, msg, date, false);                                               //cập nhật tin nhắn mới nhât bên contact
    }

    //Cập nhật trạng thái đã xem khi client xem tin nhắn
    chatHub.client.ClientReaded = function (date) {
        var lastLi = $('.list-messages .message:last-child');
        if (lastLi.find('.user-name').text() == '') {
            AppendSeenToMessage(date);
            $(".list-messages").animate({ scrollTop: $('.list-messages').prop('scrollHeight') });
        }
    }

    $.connection.hub.start().done(function () {
        //Send message from admin to client
        function sendMessge(email, msg) {
            var connectionId = $('input[name="connectionIdActive"').val();
            var dateSend = new Date();
            var emailLiLast = $('.list-messages li:last-child').find('.user-name').text();
            var dateLiLast = $('.list-messages li:last-child').find('input[name="date"]').val();
            var date = new Date(dateLiLast);
            ClearSeen();
            if (email != emailLiLast && diffTimes(date, dateSend) < 30) {
                appendGroupMsg(msg, true);
            } else {
                if (diffDays(date, dateSend) > 0)
                    addDateIntoListMessages(dateSend);
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
            addMsgInListContact(email, msg, true);
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
                addMsgInListContact(email, msg, true);
            }
        });

        //khởi tạo active ban đầu
        var start = $('.list-contacts li:first-child');
        start.addClass('active');
        var emailStart = start.find('.user_info .user-name').text();
        var connectionIdStart = start.find('input[name="connectionId"]').val();
        //console.log(start.find('.img_cont span').hasClass('online'));
        if (start.find('.img_cont span').hasClass('online') == true)
            $('.chat-header .onl').addClass('fa-circle');
        console.log($('.chat-header i.onl').html())
        $('input[name="connectionIdActive"]').val(connectionIdStart);
        $('.chat-header .user-active').html(emailStart);
        chatHub.server.loadMsgByEmailOfAdmin(emailStart);

        //event click a li (a contact) in ul (list contact)
        $('.list-contacts').on('click', 'li', function () {
            var email = $(this).find('.user_info .user-name').text();
            var connectionId = $(this).find('input[name="connectionId"]').val();


            if ($(this).find('.user_info p').hasClass('new-msg') == true) {
                $(this).find('.user_info p').removeClass('new-msg');
                chatHub.server.updateIsReadMessage(connectionId, email, true);
            }

            if ($(this).hasClass('active') == false) {
                $('.chat-header .onl').removeClass('fa-circle');
                $('.list-contacts').children('li').removeClass('active');
                $(this).addClass('active');

                $('.user-active').text(email);
                $('input[name="connectionIdActive"]').val(connectionId);

                if ($(this).find('.img_cont span').hasClass('online') == true)
                    $('.chat-header .onl').addClass('fa-circle');

                //var email = $(this).find('.user_info .user-name').text();
                chatHub.server.loadMsgByEmailOfAdmin(email);
            }

        });

        $('.chat-content').on('click', function () {
            var email = $('.chat-header .user-active').text();
            var connectionId = $('input[name="connectionIdActive"]').val();
            console.log(email + ' == ' + connectionId);
            var lastLi = $('.list-messages .message:last-child');

            if (lastLi.find('.msg-user .user-name').text() == email) {
                lastLi.find('.msg-user .list-msg-content li').each(function () {
                    if ($(this).is('.new') == true) {
                        $(this).removeClass('new');
                        chatHub.server.updateIsReadMessage(connectionId, email, true);
                        $('.list-contacts .contact.active .user_info p').removeClass('new-msg');
                    }
                });
            }
        })

        //event click a li (a message) in ul (list messages) show datetime
        $('.list-msg').on('click', 'li', function () {
            $(".msg").each(function () {
                if ($(this).find('span').hasClass('d-none') == false) {
                    $(this).find('span').addClass('d-none');
                }
            });
            $(this).find('span').removeClass('d-none');
        })
    });
});