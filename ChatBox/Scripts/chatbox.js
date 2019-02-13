$(function () {
    $('.chatbox-title').click(function () {
        $('.chatbox').toggleClass('chatbox-tray');
    })
    $('.chatbox-close').click(function () {
        $('.chatbox').addClass('chatbox-closed');
    })

    //var chatHub = $.connection.myHub;
    //$.connection.hub.start().done(function () {
    //    if ($('#btn-StartChat').click(function () {
    //        chatHub.server.connected($('#txtEmail').val());
    //        $('.login').hide();
    //    }));
    //})
})