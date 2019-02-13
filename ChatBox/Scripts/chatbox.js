$(function () {
    $('.chatbox-body').hide();
    $('.chatbox-footer').hide();
    $('.chatbox-title').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
    });
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    });

    //var chatHub = $.connection.myHub;
    //$.connection.hub.start().done(function () {
    //    if ($('#btn-StartChat').click(function () {
    //        chatHub.server.connected($('#txtEmail').val());
    //        $('.login').hide();
    //    }));
    //})
    var chatHub = $.connection.chatHub;
    $.connection.hub.start().done(function () {
        $('.customer-info').submit(function (e) {
            e.preventDefault();
            var email = $('.customer-info input').val();
            $('.customer-info').hide();
            $('.chatbox-body').show();
            $('.chatbox-footer').show();
            //chatHub.connection.connect(email);
        });
    });
    
    
});
