    
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


function onload() {

    var manifest = [
        {src:"tictactoeboard.png", id:"tictactoeboard"},
        {id:"win", src:"win.ogg"},
        {id:"lose", src:"lose.ogg"}
        
    ];
    
    createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
    
    var canvas = document.getElementById("canvas")
    var stage = new createjs.Stage(canvas);
	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);
    
    var xoCanvas = new createjs.Shape();

    var tttSpriteSheet ={
        "animations":
            {
            idle: [0]
            },
        "images": ["tictactoeboard.png"],
        "frames":
            {
            "height": 600,
            "width": 600}
    };   
    var tttss = new createjs.SpriteSheet(tttSpriteSheet);
    
    
    stage.addEventListener("stagemousedown", mouseDownEvent);
    stage.addEventListener("stagemouseup", mouseUpEvent);

    
    var areaArray = Array(9);
 
    for(var i=0;i<9;i++) 
    {
        areaArray[i] = Object();
        areaArray[i].diameter = 130;
        areaArray[i].value = "";
    }
    
    areaArray[0].x = 38; areaArray[0].y = 61;  
    areaArray[1].x = 228; areaArray[1].y = 61; 
    areaArray[2].x = 420; areaArray[2].y = 61; 

    areaArray[3].x = 38; areaArray[3].y = 227; 
    areaArray[4].x = 228; areaArray[4].y = 227;
    areaArray[5].x = 420; areaArray[5].y = 227;

    areaArray[6].x = 38; areaArray[6].y = 401; 
    areaArray[7].x = 228; areaArray[7].y = 401;
    areaArray[8].x = 420; areaArray[8].y = 401;
    
   

    var loader = new createjs.LoadQueue(true);
    loader.on("complete", handleComplete);
    loader.on("fileload", handleFileLoad);
    loader.loadManifest(manifest);
    stage.autoClear = false; //leave markings
    
    var playerTurn = 2; //player gets 2 strokes
    var hitdetected = false;
    var gameOver = false;
    var colorPlayer = "#75CAF4";
    var colorComputer = "#49FF3F"
    

    var previousPoint = new Object();
    previousPoint.x = previousPoint.y = 0;

    function mouseDownEvent(event) {
   
        if(gameOver)
        {
            return;
        }
 
        stage.addEventListener("stagemousemove" , mouseMoveEvent);
    }

    function mouseMoveEvent(event) {
        
        if(playerTurn)
        {
            var newPoint = new Object();
            newPoint.x = stage.mouseX;
            newPoint.y = stage.mouseY;
            newPoint.diameter = 15;
            
            //console.log(previousPoint.x, previousPoint.y, newPoint.x, newPoint.y);
            
            
            if(hitdetected && previousPoint.x > 0)
            {
                xoCanvas.graphics.clear().setStrokeStyle(newPoint.diameter, 'round')
                    .beginStroke(colorPlayer).moveTo(newPoint.x, newPoint.y).lineTo(previousPoint.x, previousPoint.y);
            }
   
            previousPoint.x = newPoint.x;
            previousPoint.y = newPoint.y;
    
            //find area collisions
            for(var i=0; i<areaArray.length; i++)
            {
                
                if(collisionDetect( areaArray[i], newPoint)
                    && areaArray[i].value == ""
                    && playerTurn == 2 && !hitdetected
                    )
                {
                    console.log("hit detect on", i);
                    areaArray[i].value = "x";
                    hitdetected  = true;
                    
                }
                
            }
            
            
        }
        

        stage.update();
    }
    
    function drawWin(a,b)
    {
        var useColor = colorPlayer;
        if(a.value == "o")
        {
            useColor =colorComputer;
            createjs.Sound.play("lose");   
        } else {
            createjs.Sound.play("win");   
        }
        
        var s = new createjs.Shape();
        s.graphics.setStrokeStyle(16, "round", "round").beginStroke(useColor)
            .moveTo(a.x,a.y).lineTo(b.x+b.diameter,b.y+b.diameter);
        stage.addChild(s);
        
    }
    
    
    function check3(a,b,c, winChar, drawit)
    {
        if(areaArray[a].value == winChar && areaArray[b].value == winChar
           && areaArray[c].value == winChar)
        {
            if (drawit)
            {
                drawWin(areaArray[a],areaArray[c]);
            }
            return true;
        }
        
        return false;
    }
    
    function checkWin(winChar, drawit)
    {
        //8 possible wins

        //rows
        if(check3(0,1,2,winChar, drawit)){ return true; }
        if(check3(3,4,5,winChar, drawit)){ return true; }
        if(check3(6,7,8,winChar, drawit)){ return true; }
        
        //cols
        if(check3(0,3,6,winChar, drawit)){ return true; }
        if(check3(1,4,7,winChar, drawit)){ return true; }
        if(check3(2,5,8,winChar, drawit)){ return true; }

        //diagonals
        if(check3(0,4,8,winChar, drawit)){ return true; }
        if(check3(2,4,6,winChar, drawit)){ return true; }

        
        return false;
    }

    function mouseUpEvent(event) {
        stage.removeEventListener("stagemousemove" , mouseMoveEvent);
        previousPoint.x = previousPoint.y = 0;
        if(hitdetected)
        {
            playerTurn--;
        }
        
        //player turn over
        if(!playerTurn)
        {
            if(checkWin("x", true))
            {
                console.log("player win");
                gameOver = true;
                
            } else {
                //did not win. Computer turn 
                computerMove();
                if(checkWin("o", true))
                {
                    console.log("computer win");
                    gameOver = true;
                }
            }
        }
        
    }
    
    function addOh(x,y)
    {
        x += 50;y += 50; //move to center
        var circle = new createjs.Shape();
        circle.graphics.beginFill(colorComputer).drawCircle(x,y,50).beginFill("#000000").drawCircle(x,y,50-15);
  
		
        stage.addChild(circle);
        
    } 
    
    function computerMove()
    {
        console.log("my turn...");
        playerTurn  =2;hitdetected  = false;
        
        //check for a win
        for(var i=0; i<areaArray.length; i++)
        {
          if(areaArray[i].value == "")
          {
            areaArray[i].value = "o";
            if(checkWin("o", false))
            {
                areaArray[i].value = "o";
                console.log("Found a win at ", i);
                addOh(areaArray[i].x,areaArray[i].y);
                return;
            } else {
                areaArray[i].value = "";
            }
            
              
          }
        }

        console.log("no win conditions");
        //check for a block
        for(var i=0; i<areaArray.length; i++)
        {
           console.log("Checking... ", i);
          if(areaArray[i].value == "")
          {
            areaArray[i].value = "x";
            if(checkWin("x", false))
            {
                console.log("Found a block at ", i);
                areaArray[i].value = "o";
                addOh(areaArray[i].x,areaArray[i].y);
                return;
            } else {
                areaArray[i].value = "";
            }
            
              
          }
        }
        
        console.log("no block conditions");
        
        if (areaArray[4].value == "")
        {
            console.log("Taking middle block.", 4);
            areaArray[4].value = "o";
            addOh(areaArray[4].x,areaArray[4].y);
            return;
        }

        
        for(var i=0; i<areaArray.length; i++)
        {
          if(areaArray[i].value == "")
          {
              console.log("I choose ", i);
              areaArray[i].value = "o";
              addOh(areaArray[i].x,areaArray[i].y);

              break;
              
          }
        }
        
    }

    
    
    function collisionDetect(object1, object2)
    {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + object1.diameter;
        var ay2 = object1.y + object1.diameter;

        var bx1 = object2.x;
        var by1= object2.y;
        var bx2= bx1 + object2.diameter;
        var by2= by1 + object2.diameter;
     
        if(object1 == object2) //don't let collide with self
        {
            return false;
        }
      
        if (ax1 <= bx2 && ax2 >= bx1 &&
                ay1 <= by2 && ay2 >= by1)
        {
            return true;
        } else {
            
            return false;
        }
        
    }
    

    function handleFileLoad(event) {
		console.log(event.item);
    }

      
    //all assets loaded
    function handleComplete()
    {

	//hack for IE9+
	window.setTimeout(function()
	{        
	    console.log("done");
	    var gameboardimage = new createjs.Sprite(tttss);
	    gameboardimage.x = 0;
	    gameboardimage.y = 0;
	    gameboardimage.gotoAndPlay("idle");
	    stage.addChild(gameboardimage);
    
	    stage.addChild(xoCanvas); // where the drawing happens.
	    
	    createjs.Sound.registerSound("lose.ogg", "lose");
	    createjs.Sound.registerSound("win.ogg", "win");
	    
	    createjs.Ticker.setFPS(30);
	    createjs.Ticker.addEventListener("tick", tick);
	       
	    
	}, 1000);	
	    
    }

    

    function tick()
    {
        
        stage.update();
    }

}

        
        