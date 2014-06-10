/*
===========================MIT LICENSE================================================

Copyright (c) 2013 Dan Nagle (http://dannagle.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
ig.module(
    'game.entities.bomb'
)

.requires(
	'impact.entity'
)
.defines(function() {
	

	
EntityBombBoom = ig.Entity.extend({
 
    size: {x:64, y:64},
    collides: ig.Entity.COLLIDES.NEVER,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
	killTimer:null,
 
	animSheet: new ig.AnimationSheet( 'media/bomb_boom_half.png', 64, 64 ),
	
    update: function() {
//		this.parent();
		if( this.killTimer.delta() > 1 ) {
			this.kill();
		}
	},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.killTimer = new ig.Timer();
		this.killTimer.reset();
		this.addAnim( 'idle', 1, [0] );
	}
});
    
    
EntityBomb = ig.Entity.extend({
   
    size: {x:16, y:16},
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
	boomSound: new ig.Sound( 'media/bombboom.*' ),
    
	animSheet: new ig.AnimationSheet( 'media/bombitem.png', 16, 16 ),
	
    kill: function(  ) {
		ig.game.spawnEntity( EntityBombBoom, this.pos.x-16, this.pos.y - 16);
		this.boomSound.play();
		this.parent();
    },	
	
    check: function( other ) {
    	other.receiveDamage( 50, this );
		this.kill();
    },	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 0.3, [0,0] );
	}
});
    
});