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
                    item.find('input').val(id)
                    item.find('span').removeClass('offline')
                    item.find('span').addClass('online')
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
        $(".contact").each(function () {
            if ($(this).find('.name').text() == email) {
                this.remove();
                item = $(this);
                item.find('span').removeClass('online')
                item.find('span').addClass('offline')
                var code;
                if (check == true)
                    code = '<li class="contact active">' + item.html() + '</li>';
                else
                    code = '<li class="contact">' + item.html() + '</li>';
                $('.listUser').append(code)
            }
        });
    }
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
    $.connection.hub.start().done(function () {


    });

});