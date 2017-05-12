function Zoomer(zoomTarget, fullscreenTarget, ratio){
  this.zoomTarget = $(zoomTarget).first();
  this.fullscreenTarget = $(fullscreenTarget).first();
  this.ratio = ratio || 0.8;
  this.installListeners();
}

Zoomer.prototype = {
  installListeners: function(){
    var zoomer = this.applyZoom.bind(this);
    var wnd = $(window);
    wnd.on('resize load orientationchange', zoomer);
    wnd.on(screenfull.raw.fullscreenchange, zoomer);
    screenfull.onchange(this.applyFullscreen.bind(this));
  },
  fullscreen: function(enable){
    var enabled = !!screenfull.element;
    if(!arguments.length)
      return enabled;
    if(!!enable ^ enabled){
      if(enable)
        screenfull.request(this.fullscreenTarget[0]);
      else
        screenfull.exit();
    }
  },
  applyFullscreen: function(){
    var enable = this.fullscreen();
    $(document.body)[enable ? 'addClass' : 'removeClass']('fullscreen');
    this.fixChromeDisplayBug();
  },
  fixChromeDisplayBug: function(){
    this.fullscreenTarget.css('display', 'none');
    this.fullscreenTarget.width();
    this.fullscreenTarget.css('display', '');
  },
  applyZoom: function(){
    var wnd = $(window);
    var w = wnd.innerWidth(), h = wnd.innerHeight();
    var tw = this.zoomTarget.width(), th = this.zoomTarget.height();
    var desiredRatio = 0.8;
    if(screenfull && screenfull.element)
      desiredRatio = 1.0;
    var zoom = Math.min(w / tw, h / th) * desiredRatio;

    var cssValue = 'scale(' + zoom + ')';
    this.zoomTarget.css({
      '-webkit-transform': cssValue,
      '-o-transform': cssValue,
      '-moz-transform': cssValue,
      transform: cssValue
    });
  }
}
$(document).ready(function(){
  var zoomer = new Zoomer('.zoom-content', '.fullscreen-content', 0.8);
  $('#toggle-fullscreen').click(function(){
    zoomer.fullscreen(!zoomer.fullscreen());
  });

});