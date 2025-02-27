(function($){

    $.fn.marquee = function(options) {
        var method = typeof arguments[0] == "string" && arguments[0];
        var args = method && Array.prototype.slice.call(arguments, 1) || arguments;
        var self = (this.length == 0) ? null : $.data(this[0], "marquee");
        
        if( self && method && this.length ){
            if( method.toLowerCase() == "object" ) return self;
            else if( self[method] ){
                var result;
                this.each(function (i){
                    var r = $.data(this, "marquee")[method].apply(self, args);
                    if( i == 0 && r ){
                        if( !!r.jquery ){
                            result = $([]).add(r);
                        } else {
                            result = r;
                            return false;
                        }
                    } else if( !!r && !!r.jquery ){
                        result = result.add(r);
                    }
                });
                return result || this;
            } else return this;
        } else {
            return this.each(function (){
                new $.Marquee(this, options);
            });
        }
    };

    $.Marquee = function (marquee, options){
        options = $.extend({}, $.Marquee.defaults, options);
        
        var self = this, $marquee = $(marquee), $lis = $marquee.find("> li"), current = -1, hard_paused = false, paused = false, loop_count = 0;

        $.data($marquee[0], "marquee", self);
        
        this.update = function (){
            var iCurrentCount = $lis.length;
            $lis = $marquee.find("> li");
            if( iCurrentCount <= 1 ) resume();
        }

        function show(i){
            if( $lis.filter("." + options.cssShowing).length > 0 ) return false;
            
            var $li = $lis.eq(i);
            
            if( $.isFunction(options.beforeshow) ) options.beforeshow.apply(self, [$marquee, $li]);

            var params = {
                top: (options.yScroll == "top" ? "-" : "+") + $li.outerHeight() + "px",
                left: 0
            };
            
            $marquee.data("marquee.showing", true);
            $li.addClass(options.cssShowing);
            
            // Set the font size
            $li.css('font-size', options.fontSize || '1em'); // Default to 1em if no fontSize is specified

            $li.css(params).animate({top: "0px"}, options.showSpeed, options.fxEasingShow, function (){ 
                if( $.isFunction(options.show) ) options.show.apply(self, [$marquee, $li]);
                $marquee.data("marquee.showing", false);
                scroll($li);
            });
        }

        function scroll($li, delay){
            if( paused == true ) return false;
            delay = delay || options.pauseSpeed;
            if( doScroll($li) ){
                setTimeout(function (){
                    if( paused == true ) return false;
                    var width = $li.outerWidth(), endPos = width * -1, curPos = parseInt($li.css("left"), 10);
                    $li.animate({left: endPos + "px"}, ((width + curPos) * options.scrollSpeed), options.fxEasingScroll, function (){ finish($li); });
                }, delay);
            } else if ( $lis.length > 1 ){
                setTimeout(function (){
                    if( paused == true ) return false;
                    $li.animate({top: (options.yScroll == "top" ? "+" : "-") + $marquee.innerHeight() + "px"}, options.showSpeed, options.fxEasingScroll);
                    finish($li);
                }, delay);
            }
        }
        
        function finish($li){
            if( $.isFunction(options.aftershow) ) options.aftershow.apply(self, [$marquee, $li]);
            $li.removeClass(options.cssShowing);
            showNext();
        }
        
        function doScroll($li){
            return ($li.outerWidth() > $marquee.innerWidth());
        }

        function showNext(){
            current++;
            if( current >= $lis.length ){
                if( !isNaN(options.loop) && options.loop > 0 && (++loop_count >= options.loop ) ) return false;
                current = 0;
            } 
            show(current);
        }
        
        showNext();
    };

    $(document).ready(function(){
        $("#marqee").marquee({
            yScroll: "bottom",
            fontSize: '1em' 
        });
    })
    
    $.Marquee.defaults = {
        yScroll: "top",
        showSpeed: 850,
        scrollSpeed: 12,
        pauseSpeed: 2000,
        pauseOnHover: true,
        loop: -1,
        fxEasingShow: "swing",
        fxEasingScroll: "linear",
        cssShowing: "marquee-showing",
        init: null,
        beforeshow: null,
        show: null,
        aftershow: null,
        fontSize: '1em' 
    };

})(jQuery);
