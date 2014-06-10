ig.module(
    'game.entities.player'
)

.requires(
	'impact.entity'
)
.defines(function() {

EntityPlayerBullet = ig.Entity.extend({

    size: {x:16, y:16},
    collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.A,
	gravityFactor: 0,
	flip:false,
    checkAgainst: ig.Entity.TYPE.B,


	animSheet: new ig.AnimationSheet( 'media/bullet.png', 8, 8 ),
	
    check: function( other ) {
    	other.receiveDamage( 10, this );
		this.kill();
    },	
	 
    update: function() {

        this.parent();
		if( this.vel.x == 0)
    	{
			this.kill();
    	}
    },
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		if(settings.flip)
		{
			this.vel.x = -100;
			
		} else {
			this.vel.x = 100;
		}
       
		this.addAnim( 'idle', 0.1, [0,1] );

	}
	
});
   
   
EntityPlayer = ig.Entity.extend({
   
    size: {x:16, y:16},
	type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
	gravityFactor: 7,
	maxVel: {x: 100, y: 200},
	friction: {x: 0, y: 0},
	health: 100,
	maxHealth: 100,
	startXY: null,
	leftButtonDown: false,
	rightButtonDown: false,
	upButtonDown: false,
	downButtonDown: false,
	xButtonDown: false,
	restartSound: new ig.Sound( 'media/restart.*' ),
	shootSound: new ig.Sound( 'media/shoot.*' ),
	fireburnSound: new ig.Sound( 'media/fireburn.*' ),
	killTimer:null,
	dead: false,
	killcallback:null,
	flip: false, //track flip
   
   
	kill: function(){
		//this.parent();
		ig.log("player killed!");
		ig.game.startXY = this.startXY;
		this.killTimer = new ig.Timer();
		this.killTimer.reset();
		this.killcallback = this.parent;
		this.dead = true;
		this.collides = ig.Entity.COLLIDES.NONE;
	},
	
	receiveDamage: function(amount, from){
		if(this.dead)
			return;
		this.parent(amount, from);
	},
    update: function() {

		if(this.dead)
		{
			this.vel.x = 0;
			this.vel.y = 0;
			this.currentAnim = this.anims.death;
			this.currentAnim.flip.x = flip;
			if( this.killTimer.delta() > 2 ) {
				this.killcallback();
				this.restartSound.play();
				ig.game.spawnEntity( EntityPlayer, ig.game.startXY.x, ig.game.startXY.y);
			}
			
		} else {
			
				
			//ig.log(this.friction.x, this.vel.x)
			if( ig.input.state('left') || this.leftButtonDown) {
				this.accel.x = -100;
				if(!this.vel.y)
				{
					this.friction.x = 35;
					this.currentAnim = this.anims.roll;
				} else {
					this.friction.x = 0;
					this.currentAnim = this.anims.idle;
				}
				this.currentAnim.flip.x = true;
				flip = true;
	
			}
			else if( ig.input.state('right') || this.rightButtonDown ) {
				this.accel.x = 100;
				if(!this.vel.y)
				{
					this.friction.x = 35;
					this.currentAnim = this.anims.roll;
				} else {
					this.friction.x = 0;
					this.currentAnim = this.anims.idle;
				}
				this.currentAnim.flip.x = false;
				flip = false;
			} else {
				this.accel.x = 0;
			}
			
	   
			if( ig.input.state('up')  || this.upButtonDown ) {
				this.vel.y = -100;
				this.currentAnim = this.anims.fly;
				this.fireburnSound.play();
				this.currentAnim.flip.x = flip;
			}
			else if( ig.input.state('down')  || this.downButtonDown ) {
				this.vel.y = 100;
				this.currentAnim = this.anims.idle;
				this.currentAnim.flip.x = flip;
			}
			else {
				this.vel.y = 0;
			}
			
			if(!this.vel.y && !this.vel.x)
			{
				this.currentAnim = this.anims.idle;
				this.currentAnim.flip.x = flip;
				
			}
			
			if( ig.input.state('xkey')  || ig.input.state('space') || this.xButtonDown ) {
				var bulletsettings = {flip:this.currentAnim.flip.x};
				//this forces 1 bullet at a time
				var alreadythere = ig.game.getEntitiesByType( EntityPlayerBullet )[0];
				if( !alreadythere ) {
					
					this.shootSound.play();
					
					ig.game.spawnEntity( EntityPlayerBullet, this.pos.x, this.pos.y, bulletsettings);
				}
			}
			
			
		}
		
        this.parent();
    },
    
	animSheet: new ig.AnimationSheet( 'media/robot.png', 16, 16 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		flip = false;
        
		this.startXY = {x:x,y:y}; // track start location
		
		this.addAnim( 'idle', 0.1, [0,0] );
		this.addAnim( 'roll', 0.1, [0,1] );
		this.addAnim( 'fly', 0.1, [12,13] );
		this.addAnim( 'death', 0.7, [24, 25,26], true );
	
	}
});
    
});