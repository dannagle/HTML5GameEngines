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