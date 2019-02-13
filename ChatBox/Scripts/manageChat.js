$(document).ready(function () {
    $('.left ul').on('click', 'li', function () {
        if ($(this).hasClass('active') == false) {
            $('.left ul').children('li').removeClass('active');
            $(this).addClass('active');
            var name = $(this).find('.name').text();
            $('#name-chat').html(name);
        }
    })
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