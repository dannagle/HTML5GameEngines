/*
 * Canvas-Native Font Plugin
 * Written by Abraham Walters
 * v1.0 - May 2012
 * v1.1 - July 2012
 */
ig.module(
    'plugins.font'
)
.requires(
    'impact.impact'
)
.defines(function(){

Font = ig.Class.extend({
     
	align: 'left',					//alignment - left, center, right, start, end
	alpha: 1,					//opacity: 0 - transparent, 1 - opaque
	baseline: 'top',				//baseline - top, hanging, middle, alphabetic, ideographic, bottom
	colors: [ '#FFFFFF' ],				//array of colors to "animate" through
	current: 0,					//current color in colors array
	flicker: 0.15,					//flicker - colors array animation timer
	font: null,					//font
	pos: { x: 0, y: 0 },				//position
	size: 0,					//font size
	text: '',					//text
	vel: { x: 0, y: 0 },				//velocity
	
	//only font parameter required
	//the other parameters are overloaded
	init: function( font, x, y, settings ) {
		this.flicker = new ig.Timer( this.flicker );
		this.font = font || '20px Garamond';
		this.pos.x = x || 0;
		this.pos.y = y || 0;
		this.size = this.getSize();
		ig.merge( this, settings );
	},
	
	//no parameters required
	//all parameters are overloaded
	draw: function( text, x, y, align, color ) {
		var ctx = ig.system.context;

		//the current canvas font is cached globally
		//if the font does not match what is requested
		//to be drawn, both the global cache and canvas
		//font is updated
		//this is done because updating the canvas font 
		//each draw is costly 
		if( !ig.game._font || ig.game._font !== this.font ){
			ig.game._font = this.font;
			ctx.font = this.font;
		}

		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.textAlign = align || this.align;
		ctx.textBaseline = this.baseline;
		ctx.fillStyle = color || this.colors[this.current];
		ctx.fillText( text || this.text,
					ig.system.getDrawPos( ( x || this.pos.x ) ), //- ig.game.screen.x ),
					ig.system.getDrawPos( ( y || this.pos.y ) ) ); //- ig.game.screen.y ) );
		ctx.restore();
	},
	
	//no parameter required
	//will return size of font parameter if given
	//will return size of font property if no parameter given
	//will return 0 if no size is specified for font
	getSize: function( font ){
		return Number( /\d+/.exec( font || this.font ) );
	},
	
	//no parameter required
	//will return size of passed in text if parameter given
	//will return size of text property if no parameter given
	getWidth: function( text ){
		return Font.Width( text || this.text, this.font );
	},
	
	update: function() {  
		this.pos.x += this.vel.x * ig.system.tick;
		this.pos.y += this.vel.y * ig.system.tick;
		if( this.flicker.delta() > 0 ){
			if( ++this.current === this.colors.length ){
				this.current = 0;
			}
			this.flicker.reset();
		}
	}
	
});

//define global function for calculating width
//no font instantiation needed
Font.Width = function( text, font ){
	var ctx = ig.system.context;

	//is font change necessary?
	if( !ig.game._font || font && ig.game._font !== font ){
		ig.game._font = font;
		ctx.font = font;
	}

	return ctx.measureText( text ).width / ig.system.scale;
};

});