$(document).ready(function() {
    $('body').mousemove(function(event) {
        var e = $('.eye');
        e.each(function() {
            var eye = $(this);
            var x = (eye.offset().left) + (eye.width() / 2);
            var y = (eye.offset().top) + (eye.height() / 2);
            var rad = Math.atan2(event.pageX - x, event.pageY - y);
            var rot = (rad * (180 / Math.PI) * -1) + 180;
            eye.css({
                '-webkit-transform': 'rotate(' + rot + 'deg)',
                'transform': 'rotate(' + rot + 'deg)'
            });
        });
    });
})