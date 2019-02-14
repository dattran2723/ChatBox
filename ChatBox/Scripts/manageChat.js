$(document).ready(function () {
    $('.left ul').on('click', 'li', function () {
        if ($(this).hasClass('active') == false) {
            $('.left ul').children('li').removeClass('active');
            $(this).addClass('active');
            var name = $(this).find('.name').text();
            $('#name-chat').html(name);
        }
    });
    var chatHub = $.connection.chatHub;

    chatHub.client.onConnected = function (id, email, allUsers) {
        AddUser(email, id);
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
                        <small class="preview">hello</small>\
                    </div>\
                </div>\
            </li >');
        var p01 = document.getElementsByClassName("contact");
        $(code).insertBefore(p01[0]);
    }
    $.connection.hub.start().done(function () {


    });

    function newMessage() {
        var message = $("textarea").val();
        if ($.trim(message) == '') {
            return false;
        }
        var code = '<li class="cm"><div class="msg_cotainer" >' + message + '<span class="msg_time">8:40 AM, Today</span></div ></li >';
        //$('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendto($('.message ul'));
        $('textarea').val(null);
        $('.list-msg').append(code);
        $(".list-msg").animate({ scrollTop: $('.list-msg').prop('scrollHeight') });
    };
    
});