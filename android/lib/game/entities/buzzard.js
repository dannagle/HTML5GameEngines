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
    'game.entities.buzzard'
)

.requires(
	'impact.entity'
)
.defines(function() {
  
EntityBuzzardBoom = ig.Entity.extend({
 
    size: {x:16, y:16},
    collides: ig.Entity.COLLIDES.NONE,
	killTimer:null,
 
	animSheet: new ig.AnimationSheet( 'media/buzzardbaddie.png', 16, 16 ),
	
    update: function() {
		this.parent();
		if( this.killTimer.delta() > 1 ) {
			this.kill();
		}
	},
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.killTimer = new ig.Timer();
		this.killTimer.reset();
		this.addAnim( 'idle', 0.5, [2,3] );
	}
});
   
EntityBuzzard = ig.Entity.extend({
   
    size: {x:16, y:16},
    gravityFactor: 0,
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
	flip:false,
   
    update: function() {

		if( this.vel.x == 0)
    	{
			if(this.flip)
			{
				this.flip = false;
				this.vel.x = -10;
			} else {
				this.flip = true;
				this.vel.x = 10;
			}
    	}
		
		if(this.vel.x < 0)
		{
			this.currentAnim.flip.x = false;
		} else {
			this.currentAnim.flip.x = true;
		}

		
		
        this.parent();
    },
    
	animSheet: new ig.AnimationSheet( 'media/buzzardbaddie.png', 16, 16 ),

    check: function( other ) {
    	other.receiveDamage( 20, this );
    },	
	
	
    kill: function(  ) {
		ig.game.spawnEntity( EntityBuzzardBoom, this.pos.x, this.pos.y);
		this.parent();
    },	
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
        
		this.addAnim( 'idle', 0.4, [0,1] );
		this.vel.x = -20;
	}
});
    
});