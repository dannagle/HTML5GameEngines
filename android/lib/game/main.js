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
	'game.main' 
)
.requires(
	'impact.game',
	'game.levels.mechajetlevel1',
	'game.levels.mechajetlevel2',
//	'impact.debug.debug',
	'game.entities.player'
)
.defines(function(){
	


MyGame = ig.Game.extend({
	
	gravity: 300,

	leftButton: {x:0,y:320/2-32,l:32},
	rightButton: {x:32,y:320/2-32,l:32},
	upButton: {x:16,y:320/2-64,l:32},
	downButton: {x:480/2-32,y:320/2-32,l:32},
	xButton: {x:480/2-32,y:320/2-64,l:32},
	
	 
    collisionDetect: function (object1, object2)
    {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + object1.l;
        var ay2 = object1.y + object1.l;

        var bx1 = object2.x;
        var by1= object2.y;
        var bx2= bx1 + 1;
        var by2= by1 + 1;
     
        if (ax1 <= bx2 && ax2 >= bx1 &&
                ay1 <= by2 && ay2 >= by1)
        {
            return true;
        } else {
            
            return false;
        }
        
    },

	buttonCheck: function(theButton) {
		
		if(!ig.touchactive)
        {
			return false;
		}
		if(theButton.x == 16 )
		{
			console.log("button test: " + theButton.x + " , " + theButton.y);
			console.log("touch active: " + ig.touchLocation.x + " , " + ig.touchLocation.y);
		}
		
		return this.collisionDetect(theButton, ig.touchLocation);
	},
	
	
	hudSheet: new ig.Image( 'media/fadedarrow_half.png'),
	healthSheet: new ig.Image( 'media/health.png'),
	
	
	
	init: function() {
		
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.MOUSE1, "CanvasTouch" );
		ig.input.bind( ig.KEY.SPACE, "space" );
		ig.input.bind( ig.KEY.X, "xkey" );
		this.loadLevel(LevelMechajetlevel1);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
			
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;

			//track button pushes
			player.leftButtonDown = this.buttonCheck(this.leftButton);
			player.rightButtonDown = this.buttonCheck(this.rightButton);
			player.upButtonDown = this.buttonCheck(this.upButton);
			player.downButtonDown = this.buttonCheck(this.downButton);
			player.xButtonDown = this.buttonCheck(this.xButton);
		
		}
		
		
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		//Draw arrow keys
		this.hudSheet.drawTile( this.leftButton.x, this.leftButton.y, 4, 32 );//left
		this.hudSheet.drawTile(this.rightButton.x, this.rightButton.y, 1, 32 ); //right
		this.hudSheet.drawTile( this.upButton.x, this.upButton.y, 0, 32 ); //up
		this.hudSheet.drawTile( this.downButton.x, this.downButton.y, 3, 32 ); //down
		this.hudSheet.drawTile( this.xButton.x, this.xButton.y, 2, 32 ); //fire
				
		//Draw health
		var player = this.getEntitiesByType( EntityPlayer )[0];
		
		if( player ) {
			if(player.health >= player.maxHealth)
			{
				
	//			ig.log("full", player.health, player.maxHealth);
				this.healthSheet.drawTile( 0, 0, 0, 32);
			} else if (player.maxHealth * 3 / 4 <= player.health)
			{
		//		ig.log("3/4", player.health, player.maxHealth);
				this.healthSheet.drawTile( 0, 0, 1, 32);
				
			} else if (player.maxHealth / 2 <= player.health)
			{
			//	ig.log("1/2", player.health, player.maxHealth);
				this.healthSheet.drawTile( 0, 0, 2, 32);
				
			} else {
				//ig.log("empty", player.health, player.maxHealth);
				this.healthSheet.drawTile( 0, 0, 3, 32);
			}
		} else {
				this.healthSheet.drawTile( 0, 0, 3, 32);

		}

		
	
	}
});


  var c = document.createElement('canvas');
  c.id = 'canvas';
  document.body.appendChild(c);

  

  
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60,480/2 ,320/2 , 2 );
ig.touchLocation = Object();
ig.touchactive = false;

	c.addEventListener(
		"touchstart",
		function(touchEvent) {
			var e= touchEvent.targetTouches[0];
			var touch = Object();
			touch['x'] = e.pageX/2;
			touch['y'] = e.pageY/2;
			ig.touchLocation = touch;
			ig.touchactive = true;
		});

		c.addEventListener(
		"touchend",
		function(touchEvent) {
			ig.touchactive = false;
		});

		c.addEventListener(
		"touchmove",
		function(touchEvent) {
			var e= touchEvent.targetTouches[0];
			var touch = Object();
			touch['x'] = e.pageX/2;
			touch['y'] = e.pageY/2;
			ig.touchLocation = touch;
			ig.touchactive = true;
		});

});
