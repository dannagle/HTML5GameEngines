ig.module(
  'plugins.touch-button'
)
.requires(
  'impact.system',
  'impact.input',
  'impact.image'
)
.defines(function(){


ig.TouchButton = ig.Class.extend({  
  action: 'undefined',
  image: null,
  tile: 0,
  pos: {x: 0, y: 0},
  size: {x: 0, y: 0},
  area: {x1: 0, y1:0, x2: 0, y2:0},

  pressed: false, 
  touchId: 0,
  
  init: function( action, x, y, width, height, image, tile ) {
    var internalWidth = parseInt(ig.system.canvas.offsetWidth) || ig.system.realWidth;
    var s = ig.system.scale * (internalWidth / ig.system.realWidth);
    
    this.action = action;
    this.pos = {x: x, y: y};
    this.size = {x: width, y: height};
    this.area = {x1: x * s, y1: y * s, x2: (x + width) * s, y2: (y + height) *s};
    
    this.image = image || null;
    this.tile = tile || 0;
    
    document.addEventListener( 'touchstart', this.touchStart.bind(this), false );
    document.addEventListener( 'touchend', this.touchEnd.bind(this), false );
  },
  
  touchStart: function( ev ) {
    ev.preventDefault();

    if( this.pressed ) { return; }
    
    var el = ig.system.canvas;
    var pos = {left: 0, top: 0};
    while( el != null ) {
      pos.left += el.offsetLeft;
      pos.top += el.offsetTop;
      el = el.offsetParent;
    }
    
    for( var i = 0; i < ev.touches.length; i++ ) {
      var x = ev.touches[i].pageX - pos.left,
        y = ev.touches[i].pageY - pos.top;
      
      if( 
        x > this.area.x1 && x < this.area.x2 &&
        y > this.area.y1 && y < this.area.y2
      ) {
        this.pressed = true;
        this.touchId = ev.touches[i].identifier;

        ig.input.actions[this.action] = true;
        if( !ig.input.locks[this.action] ) {
          ig.input.presses[this.action] = true;
          ig.input.locks[this.action] = true;
        }
        return;
      }
    }
  },
  
  touchEnd: function( ev ) {
    ev.preventDefault();

    if( !this.pressed ) { return; }
        
    for( var i = 0; i < ev.changedTouches.length; i++ ) {
      if( ev.changedTouches[i].identifier === this.touchId ) {
        this.pressed = false;
        this.touchId = 0;
        ig.input.delayedKeyup[this.action] = true;        
        return;
      }
    }
  },
  
  draw: function() {
    if( this.image ) { 
      this.image.drawTile( this.pos.x, this.pos.y, this.tile, this.size.x, this.size.y );
    }
  }
});


});