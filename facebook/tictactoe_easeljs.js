
function onload() {

    var manifest = [
        {src:"tictactoeboard.png", id:"tictactoeboard"},
        {id:"restart", src:"restart.mp3|restart.ogg"},
        {id:"bombboom", src:"bombboom.mp3|bombboom.ogg"}
        
    ];
    
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
    
   

    var loader = new createjs.LoadQueue(false);
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
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
            
            console.log(previousPoint.x, previousPoint.y, newPoint.x, newPoint.y);
            
            
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
            createjs.Sound.play("bombboom");   
        } else {
            createjs.Sound.play("restart");   
        }
        
        var s = new createjs.Shape();
        s.graphics.setStrokeStyle(16, "round", "round").beginStroke(useColor)
            .moveTo(a.x,a.y).lineTo(b.x+b.diameter,b.y+b.diameter);
        stage.addChild(s);
        
    }
    
    
    function check3(a,b,c, winChar)
    {
        if(areaArray[a].value == winChar && areaArray[b].value == winChar
           && areaArray[c].value == winChar)
        {
            drawWin(areaArray[a],areaArray[c]);
            return true;
        }
        
        return false;
    }
    
    function checkWin(winChar)
    {
        //8 possible wins

        //rows
        if(check3(0,1,2,winChar)){ return true; }
        if(check3(3,4,5,winChar)){ return true; }
        if(check3(6,7,8,winChar)){ return true; }
        
        //cols
        if(check3(0,3,6,winChar)){ return true; }
        if(check3(1,4,7,winChar)){ return true; }
        if(check3(2,5,8,winChar)){ return true; }

        //diagonals
        if(check3(0,4,8,winChar)){ return true; }
        if(check3(2,4,6,winChar)){ return true; }

        
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
            if(checkWin("x"))
            {
                console.log("player win");
                gameOver = true;
                
            } else {
                //did not win. Computer turn 
                computerMove();
                if(checkWin("o"))
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

        console.log("done");
        var gameboardimage = new createjs.BitmapAnimation(tttss);
        gameboardimage.x = 0;
        gameboardimage.y = 0;
        gameboardimage.gotoAndPlay("idle");
        stage.addChild(gameboardimage);

        stage.addChild(xoCanvas); // where the drawing happens.
        
        createjs.Sound.registerSound("bombboom.mp3|bombboom.ogg", "bombboom");
        createjs.Sound.registerSound("restart.mp3|restart.ogg", "restart");
        
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);

    }

    

    function tick()
    {
        
        stage.update();
    }

}


