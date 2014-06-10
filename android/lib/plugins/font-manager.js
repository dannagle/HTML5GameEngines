/*
 * Font Manager Plugin
 * Written by Abraham Walters
 * v1.0 - May 2012
 * v1.1 - July 2012
 */

ig.module(
    'plugins.font-manager'
)
.requires(
    'impact.impact',
    'plugins.font'
)
.defines(function(){

FontManager = ig.Class.extend({
        
	fonts: [],
	
	init: function(){},
	
	//adds a font to be tracked
	//set lifetime = 0 or null to have font live indefinitely
	add: function( lifetime, font ){
		if( lifetime ){
			font.lifetime = new ig.Timer( lifetime );
		}
		this.fonts.push( font );
	},
	
	draw: function(){
		for( var i = this.fonts.length ; i--; i ){
			this.fonts[i].draw();
		}
	},
	
	//spawns a new font and tracks it
	//set lifetime = 0 or null to have font live indefinitely
	//returns the new note
	spawn: function( lifetime, font, x, y, settings ){
		var note = new Font( font, x, y, settings );
		if( lifetime ){
			note.lifetime = new ig.Timer( lifetime );
		}
		this.fonts.push( note );
		return note;
	},
	
	update: function(){
		for( var i = this.fonts.length ; i--; i ){
			this.fonts[i].update();
			if( this.fonts[i]._kill ) {
				this.fonts.splice( i, 1 );
			}
		}
	}
    
});

//inject lifetime & fading properties into Font
Font.inject({
     
	lifetime: null,				//lifetime - keep null or set to 0 to have font live indefinitely
	_kill: false,				//state
	
	draw: function( text, x, y, align, color ) {
		var ctx = ig.system.context;
		ctx.globalAlpha = this.alpha;
		this.parent( text, x, y, align, color );
		ctx.globalAlpha = 1;
	},
	
	kill: function(){
		this._kill = true;
	},
	
	update: function(){
		this.parent();
		if( !this.lifetime ){
			return;
		}
		
		//kill note if its time has come
		if( this.lifetime.delta() > 0 ) {
			this.kill();
		}
		
		//fade
		this.alpha = this.lifetime.delta().map( -this.lifetime.target, 0, 1, 0 ); 
	}
	
});

});