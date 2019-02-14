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
        for (i = 0; i < allUsers.length; i++) {
            AddUser(chatHub, allUsers[i].Email, allUser[i].ConnectionId);
        }
    };
    registerClientMethods(chatHub);
    $.connection.hub.start().done(function () {
        function AddUser(chatHub, email, connectionId) {
            var code = $('<div class="wrap row"><div class="col-2 contact-status"><span class="online"></span></div><div class="col-10 meta"><p class="name">'
                + email +
                '</p><small class="preview">hello</small></div></div>');
            $('.list-msg').append(code);
        }
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

    $('.send').click(function () {
                    newMessage();
                });
            
    $(window).on('keydown', function (e) {
        if (e.which == 13) {
                    newMessage();
                return false;
            }
        });
});