ig.module(
    'game.entities.corridor'
)

.requires(
	'impact.entity'
)
.defines(function() {
    
EntityCorridor = ig.Entity.extend({
   
    size: {x:32, y:32},
    collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.B,
	tolevel: "Mechajetlevel2",
	checkAgainst: ig.Entity.TYPE.A,
	health:9999,
    
	animSheet: new ig.AnimationSheet( 'media/corridor.png', 32, 32),
	check: function(other) {
		if (other instanceof EntityPlayer)
		{
			ig.game.loadLevelDeferred(ig.global["Level" + this.tolevel]);
		}
	},
	 
	receiveDamage: function(amount, from){
		return; //immortal
	},
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 0.5, [0,1] );
		
	}
});
    
});