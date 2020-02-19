/*
 * Diaspora
 * @author LoeiFy
 * @url http://lorem.in
 */

var Home = location.href,
    Pages = 4,
    xhr,
    xhrUrl = '';

var Diaspora = {

    L: function(url, f, err) {
        if (url == xhrUrl) {
            return false
        }

        xhrUrl = url;

        if (xhr) {
            xhr.abort()
        }

        xhr = $.ajax({
            type: 'GET',
            url: url,
            timeout: 10000,
            success: function(data) {
                f(data)
                xhrUrl = '';
            },
            error: function(a, b, c) {
                if (b == 'abort') {
                    err && err()
                } else {
                    window.location.href = url
                }
                xhrUrl = '';
            }
        })
    },

    P: function() {
        return !!('ontouchstart' in window);
    },

    PS: function() {
        if (!(window.history && history.pushState)) return;

        history.replaceState({u: Home, t: document.title}, document.title, Home)

        window.addEventListener('popstate', function(e) {
            var state = e.state;

            if (!state) return;

            document.title = state.t;

            if (state.u == Home) {
                $('#preview').css('position', 'fixed')
                setTimeout(function() {
                    $('#preview').removeClass('show').addClass('trans')
                    $('#container').show()
                    window.scrollTo(0, parseInt($('#container').data('scroll')))
                    setTimeout(function() {
                        $('#preview').html('')
                        $(window).trigger('resize')
                    }, 300)
                }, 0)
            } else {
                Diaspora.loading()

                Diaspora.L(state.u, function(data) {

                    document.title = state.t;

                    $('#preview').html($(data).filter('#single'))

                    Diaspora.preview()

                    setTimeout(function() { Diaspora.player(state.d) }, 0)
                })
            }
        })
    },

    HS: function(tag, flag) {
        var id = tag.data('id') || 0,
            url = tag.attr('href'),
            title = tag.attr('title') || tag.text();

        if (!$('#preview').length || !(window.history && history.pushState)) location.href = url;

        Diaspora.loading()

        var state = {d: id, t: title, u: url};

        Diaspora.L(url, function(data) {

            if (!$(data).filter('#single').length) {
                location.href = url;
                return
            }

            switch (flag) {

                case 'push':
                    history.pushState(state, title, url)
                break;

                case 'replace':
                    history.replaceState(state, title, url)
                break;

            }

            document.title = title;

            $('#preview').html($(data).filter('#single'))

            switch (flag) {

                case 'push': 
                    Diaspora.preview()
                break;

                case 'replace':
                    window.scrollTo(0, 0)
                    Diaspora.loaded()
                break;
            }
        })
    },


    loading: function() {
        var w = window.innerWidth;
        var css = '<style class="loaderstyle" id="loaderstyle'+ w +'">'+
                  '@-moz-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
                  '@-webkit-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
                  '.loader'+ w +'{-webkit-animation:loader'+ w +' 3s linear infinite;-moz-animation:loader'+ w +' 3s linear infinite;}'+
                  '</style>';
        $('.loaderstyle').remove()
        $('head').append(css)

        $('#loader').removeClass().addClass('loader'+ w).show()
    },

    loaded: function() {
        $('#loader').removeClass().hide()
    },

    F: function(id, w, h) {
        var _height = $(id).parent().height(),
            _width = $(id).parent().width(),
            ratio = h / w;

        if (_height / _width > ratio) {
            id.style.height = _height +'px';
            id.style.width = _height / ratio +'px';
        } else {
            id.style.width = _width +'px';
            id.style.height = _width * ratio +'px';
        }

        id.style.left = (_width - parseInt(id.style.width)) / 2 +'px';
        id.style.top = (_height - parseInt(id.style.height)) / 2 +'px';
    }

}

$(function() {

    if (Diaspora.P()) {
        $('body').addClass('touch')
    }

    if ($('#preview').length) {

        var cover = {};
        cover.t = $('#cover');
        cover.w = cover.t.attr('width');
        cover.h = cover.t.attr('height');

        ;(cover.o = function() {
            $('#mark').height(window.innerHeight)
        })();

        if (cover.t.prop('complete')) {
            // why setTimeout ?
            setTimeout(function() { cover.t.load() }, 0)
        }

        cover.t.on('load', function() {

            ;(cover.f = function() {

                var _w = $('#mark').width(), _h = $('#mark').height(), x, y, i, e;

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
                    'marginLeft': - 0.5 * x,
                    'marginTop': - 0.5 * y
                })

                if (!cover.w) {
                    cover.w = cover.t.width();
                    cover.h = cover.t.height();
                }

                Diaspora.F($('#cover')[0], cover.w, cover.h)

            })();

            setTimeout(function() {
                $('html, body').removeClass('loading')
            }, 1000)

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

        if (!cover.t.attr('src')) {
            alert('Please set the post thumbnail')
        }

        $('#preview').css('min-height', window.innerHeight)

        Diaspora.PS()

        var T;
        $(window).on('resize', function() {
            clearTimeout(T)

            T = setTimeout(function() {
                if (!Diaspora.P() && location.href == Home) {
                    cover.o()
                    cover.f()
                }

                if ($('#loader').attr('class')) {
                    Diaspora.loading()
                }
            }, 500)
        })  
    } else {

        $('html, body').removeClass('loading')
        
        window.addEventListener('popstate', function(e) {
            if (e.state) location.href = e.state.u;
        })
    }


    $('body').on('click', function(e) {

        var tag = $(e.target).attr('class') || '',
            rel = $(e.target).attr('rel') || '';

        if (!tag && !rel) return;
    })
})