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