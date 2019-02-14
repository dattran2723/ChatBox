$(document).ready(function () {
    var chatHub = $.connection.chatHub;

    chatHub.client.onConnected = function (id, email, allUsers) {
        $(".contact").each(function () {
            if ($(this).find('.name').text() == email) {
                this.remove();
            }
        });
        AddUser(email, id);
    };
    //OnDisconnected
    chatHub.client.onUserDisconnected = function (email, isOnline, connectionId) {
        $(".contact").each(function () {
            if ($(this).find('.name').text() == email) {
                this.remove();
                AddUserDisconnected(email, connectionId)
            }
        });
    }
    //add user khi Disconnected
    function AddUserDisconnected(email, connectionId) {
        var code = $('<li class="contact">\
                <input type = "hidden" name = "connectionId" value = "'+ connectionId + '" />\
                <div class="wrap row">\
                    <div class="col-2 contact-status">\
                        <span class="offline"></span>\
                    </div>\
                    <div class="col-10 meta">\
                        <p class="name">'+ email + '</p>\
                        <small class="preview">hello</small>\
                    </div>\
                </div>\
            </li >');
        $('.listUser').append(code);
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
                        <small class="preview">hello</small>\
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