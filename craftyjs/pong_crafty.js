function onload() {

  var BACKGROUND_COLOR = '#dbdbdb';
  var PADDLE_WIDTH = 64;  
  var PADDLE_HEIGHT = 16; 
  var BALL_COLOR = '#000000';
  var BALL_RADIUS = 16;


  
  if(Modernizr.canvas && Modernizr.canvastext) {
    Crafty.init(320, 480);
    Crafty.background(BACKGROUND_COLOR);

//Crafty wants to center itself. Do not allow this.
var craftycanvas = document.getElementById("cr-stage");
craftycanvas.style.position="absolute";
craftycanvas.style.top="0px";

      
  Crafty.load(["pong_sprites.png",
               "lose_effect.mp3",
               "lose_effect.ogg",
               "win_effect.mp3",
               "win_effect.ogg",
               "hit.mp3",
               "hit.ogg",
               "hit2.mp3",
               "hit2.ogg"
               ], function() {
    console.log("assets loaded");

    //hack for IE9+
    window.setTimeout(function() {Crafty.scene("main");}, 500);
  });

 
  Crafty.sprite(16,"pong_sprites.png", {

      floor0: [0,0,1,1], //location=320,64, height=1, width=1
      floor1: [0,1,1,1],
      floor2: [1,1,1,1], 
      wall1: [6,0,1,1], 
      wall2: [7,0,1,1], 
      ball0: [2,1,1,1],
      toppaddle:    [0,2,4,1],  
      bottompaddle: [0,3,4,1]
  });
  
  Crafty.scene("main", function() {

    Crafty.audio.add("hit", [
      "hit.mp3",
      "hit.ogg"
      ]);
    Crafty.audio.add("lose", [
      "lose_effect.mp3",
      "lose_effect.ogg"
      ]);
    Crafty.audio.add("win", [
      "win_effect.mp3",
      "win_effect.ogg"
      ]);
    Crafty.audio.add("hit2", [
      "hit2.mp3",
      "hit2.ogg"
      ]);
        
   for(var ytile = 0; ytile < 32; ytile++) {
      for(var xtile = 0; xtile < 20; xtile++) {
          //console.log(xtile * 16, ytile * 16);
          var usefloor = (xtile%2);
          if(xtile % Math.round(Math.random()*10))
          {
            usefloor = 2;
          }
          if(xtile == 19)
          {
            Crafty.e("2D, Canvas, wall, wall1")
              .attr({x: xtile * 16, y: ytile * 16, z: -2});
            
          } else if(xtile == 0){
            Crafty.e("2D, Canvas, wall,  wall2")
                .attr({x: xtile * 16, y: ytile * 16, z: -2});
            
          } else {
            Crafty.e("2D, Canvas, floor"+usefloor)
                .attr({x: xtile * 16, y: ytile * 16, z: -2});
          }
      }
    }
            
    Crafty.e("topPaddle, 2D, Canvas, toppaddle")
                .attr({x: 100, y: 10, w: PADDLE_WIDTH, h: PADDLE_HEIGHT}) 
                .bind('EnterFrame', function () {
                    var gameBall = Crafty("gameBall"); //get gameBall
                    if(gameBall.yspeed < 0)
                    {
                      if(gameBall.x < (this.x + PADDLE_WIDTH / 2))
                      {
                        this.x--;
                      } else {
                        this.x++;
                      }
                    }
                    if(this.x <= 0)
                    {
                      this.x = 0;
                    }
                    if(this.x >= (320 - PADDLE_WIDTH))
                    {
                      this.x = 320 - PADDLE_WIDTH;
                    }
                }); 

    Crafty.e("bottomPaddle, 2D, Canvas, Multiway, bottompaddle")
                .attr({x: 100, y: 460, w: PADDLE_WIDTH, h: PADDLE_HEIGHT}) 
                .multiway(4, { LEFT_ARROW: 180, RIGHT_ARROW: 0 })
                .bind('EnterFrame', function () {
                    if(this.x <= 0)
                    {
                      this.x = 0;
                    }
                    if(this.x >= (320 - PADDLE_WIDTH))
                    {
                      this.x = 320 - PADDLE_WIDTH;
                    }
                });
                
    Crafty.e("mouseTracking, 2D, Mouse, Touch, Canvas")
              .attr({ w:320, h:480, x:0, y:0 })
              .bind("MouseMove", function(e) 
              {
                    //console.log("MouseDown:"+ Crafty.mousePos.x +", "+ Crafty.mousePos.y);
                    var bottomPaddle = Crafty("bottomPaddle"); //get bottomPaddle
                    bottomPaddle.x = Crafty.mousePos.x - bottomPaddle.w/2;
                    //console.log("new pos:"+ bottomPaddle.x);
                    //console.log("would have been:"+ Crafty.mousePos.x );
                });                 

    Crafty.e("scoreValue, 2D, Canvas, Text")
                .attr({x: 20, y: 0, w: PADDLE_WIDTH, h: PADDLE_HEIGHT,
                      pointsPlayer:0, pointsComputer:0
                      })
                .textColor('#FFFFFF')
                .bind('EnterFrame', function () {
                      this.text("You:" + this.pointsPlayer +
                                "  CPU:" + this.pointsComputer);
                });
                
   Crafty.e("gameBall, 2D, Canvas, Collision, SpriteAnimation, ball0")
                .attr({x: 100, y: 100, w: BALL_RADIUS, h: BALL_RADIUS,
                      xspeed: 2, yspeed: 4
                      })
                .animate('BallBlinking', 2,1,4) //setup animation
                .animate('BallBlinking', 5, -1) //start animation
                .bind('EnterFrame', function () {
                  
                  this.x += this.xspeed;
                  this.y += this.yspeed;

                 if(this.y > (480 + BALL_RADIUS))
                 {
                    var scoreValue = Crafty("scoreValue"); 
                    scoreValue.pointsComputer++;
                    Crafty.audio.play("lose");
                    this.x = 20 + Math.round(Math.random() * 100);
                    this.y = 100;
                    this.xspeed = 0 -this.xspeed;
                   
                 }
                   
                 if(this.y < 0 )
                 {
                    var scoreValue = Crafty("scoreValue"); 
                    scoreValue.pointsPlayer++;
                    Crafty.audio.play("win");
                    this.x = 20 + Math.round(Math.random() * 100);
                    this.y = 300;
                    this.xspeed = 0 -this.xspeed;
                 }
                                   
                })
              .onHit('bottomPaddle', function () {
                  this.yspeed *= -1;
                  Crafty.audio.play("hit");
                  this.y = 460 - BALL_RADIUS;
              })
              .onHit('topPaddle', function () {
                  Crafty.audio.play("hit");
                  this.yspeed *= -1;
                  this.y = 10+BALL_RADIUS;
              })
              .onHit('wall', function () {
                  Crafty.audio.play("hit2");
                  this.xspeed *= -1;
              });
  });


            
  } else {
    var yes = confirm("Download a better browser?");
    if(yes)
    {
      window.location = "http://google.com/chrome";
    }
  }
}
