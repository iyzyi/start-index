/*
 * Diaspora
 * @author LoeiFy
 * @url http://lorem.in
 */

var Home = location.href;

var Diaspora = {

    P: function () {
        return !!('ontouchstart' in window);
    },

    F: function (id, w, h) {
        var _height = $(id).parent().height(),
            _width = $(id).parent().width(),
            ratio = h / w;

        if (_height / _width > ratio) {
            id.style.height = _height + 'px';
            id.style.width = _height / ratio + 'px';
        } else {
            id.style.width = _width + 'px';
            id.style.height = _width * ratio + 'px';
        }

        id.style.left = (_width - parseInt(id.style.width)) / 2 + 'px';
        id.style.top = (_height - parseInt(id.style.height)) / 2 + 'px';
    }
}

$(function () {

    if (Diaspora.P()) {
        $('body').addClass('touch')
    }

    var cover = {};
    cover.t = $('#cover');
    cover.w = cover.t.attr('width');
    cover.h = cover.t.attr('height');

    (cover.o = function () {
        $('#mark').height(window.innerHeight)
    })();

    if (cover.t.prop('complete')) {
        // why setTimeout ?
        setTimeout(function () {
            cover.t.load()
        }, 0)
    }

    cover.t.on('load', function () {

        (cover.f = function () {

            var _w = $('#mark').width(),
                _h = $('#mark').height(),
                x, y, i, e;

            e = (_w >= 1000 || _h >= 1000) ? 1000 : 500;

            if (_w >= _h) {
                i = _w / e * 50;
                y = i;
                x = i * _w / _h;
            } else {
                i = _h / e * 50;
                x = i;
                y = i * _h / _w;
            }

            $('.layer').css({
                'width': _w + x,
                'height': _h + y,
                'marginLeft': -0.5 * x,
                'marginTop': -0.5 * y
            })

            if (!cover.w) {
                cover.w = cover.t.width();
                cover.h = cover.t.height();
            }

            Diaspora.F($('#cover')[0], cover.w, cover.h)

        })();

        $('#mark').parallax()

        var vibrant = new Vibrant(cover.t[0]);
        var swatches = vibrant.swatches()

        if (swatches['DarkVibrant']) {
            $('#vibrant polygon').css('fill', swatches['DarkVibrant'].getHex())
            $('#vibrant div').css('background-color', swatches['DarkVibrant'].getHex())
        }
        if (swatches['Vibrant']) {
            $('.icon-menu').css('color', swatches['Vibrant'].getHex())
        }
    })

    var T;
    $(window).on('resize', function () {
        clearTimeout(T)

        T = setTimeout(function () {
            if (!Diaspora.P() && location.href == Home) {
                cover.o()
                cover.f()
            }
        }, 500)
    })
})

/* source code from https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
 * iyzyi revised some details
*/
$(function () {
    function formatDate(date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
      
        if (day % 10 == 1){
            day += "st";
        } else if (day % 10 == 2){
            day += "nd";
        } else if (day % 10 == 3){
            day += "rd";
        } else{
            day += "th";
        }
      
        return monthNames[monthIndex] + ' ' + day +  ', ' + year;
    }
      
    console.log(formatDate(new Date()));
    $("#date").text(formatDate(new Date()));
});