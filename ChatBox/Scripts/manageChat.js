$(document).ready(function () {
    $('.left ul').on('click', 'li', function () {
        if ($(this).hasClass('active') == false) {
            $('.left ul').children('li').removeClass('active');
            $(this).addClass('active');
            var name = $(this).find('.name').text();
            $('#name-chat').html(name);
        }
    })
});