var canvas;
var canvasContext;
var ballX=50;
var ballY=50;
var ballSpeedX=10;
var ballSpeedY=4;

var player1Score=0;
var player2Score=0;
const WINNING_SCORE=5;

var showingWinScreen=false;

var paddle1Y=250;
var paddle2Y=250;
const PADDLE_HEIGHT=100;
const PADDLE_THICKNESS=10;


window.onload=function(){
  canvas=document.getElementById("gameCanvas");
  canvasContext=canvas.getContext('2d');
  var framesPerSecond=30;
  setInterval(function(){
    moveEverything();
    drawEverything();
  },1000/framesPerSecond);

  canvas.addEventListener('mousedown',function(evt){
    if(showingWinScreen){
      player1Score=0;
      player2Score=0;
      showingWinScreen=false;
      document.querySelector("h1").textContent="Air Hockey";
    }
  });

  canvas.addEventListener('mousemove',function(evt){
    var mousePos=calculateMousePosition(evt);
    paddle1Y=mousePos.y;
  });
}



function calculateMousePosition(evt){
  var rect=canvas.getBoundingClientRect();
  var root=document.documentElement;
  var mouseX=evt.clientX-rect.left-root.scrollLeft;
  var mouseY=evt.clientY-rect.top-root.scrollTop;
  return{
    x:mouseX,
    y:mouseY
  };
}

function computerMovement(){
  var paddle2YCenter=paddle2Y+PADDLE_HEIGHT/2;
  if(paddle2YCenter<ballY-35){
    paddle2Y+=7;
  }
  else if(paddle2YCenter>ballY+35){
    paddle2Y-=7;
  }
}

function ballReset(){
  if(player1Score>=WINNING_SCORE || player2Score>=WINNING_SCORE){
    showingWinScreen=true;
  }
  ballSpeedX=-ballSpeedX;
  ballX=canvas.width/2;
  ballY=canvas.height/2;
}


function drawNet(){
  for(var i=0;i<canvas.height;i+=40){
    colorRect(canvas.width/2-1,i,2,20,'white');
  }
}

// DRAWING.
function drawEverything(){

  // canvas black.
  colorRect(0,0,canvas.width,canvas.height,'black');
  canvasContext.font="30px cursive";

  if(showingWinScreen===true){
    canvasContext.fillStyle="white";

    if(player1Score>=WINNING_SCORE){
      document.querySelector("h1").textContent="Player 1 Won";
      canvasContext.fillText("Player 1 Won",300,300);
    }
    else if(player2Score>=WINNING_SCORE){
      document.querySelector("h1").textContent="Player 2 Won";
        canvasContext.fillText("Player 2 Won",300,300);
    }
    canvasContext.fillText("Click to continue",280,500);
    return;
  }

  drawNet();
  //  left player paddle.
  colorRect(0,paddle1Y-PADDLE_HEIGHT/2,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
  //  right player paddle.
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y-PADDLE_HEIGHT/2,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
  //  Draws the ball.
  colorCircle(ballX,ballY,10,'white');
  // Displays scoreboard for player 1.
  canvasContext.fillText(player1Score,100,100);
  // Displays scoreboard for player 2.
  canvasContext.fillText(player2Score,canvas.width-100,100);
}

function moveEverything(){
  if(showingWinScreen===true){
    return;
  }
  computerMovement();
  ballX+=ballSpeedX;
  ballY+=ballSpeedY;

  if(ballX>canvas.width-PADDLE_THICKNESS){
    if(ballY>paddle2Y-PADDLE_HEIGHT/2 && ballY<paddle2Y+PADDLE_HEIGHT/2){
      ballSpeedX=-ballSpeedX;
      var deltaY=ballY-(paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY=deltaY*0.35;
    }
    else{
      player1Score++;
      ballReset();
    }
  }

  if(ballX<PADDLE_THICKNESS){
    if(ballY>paddle1Y-PADDLE_HEIGHT/2 && ballY<paddle1Y+PADDLE_HEIGHT/2){
      ballSpeedX=-ballSpeedX;
      var deltaY=ballY-(paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY=deltaY*0.25;
    }
    else{
      player2Score++;
      ballReset();
    }
  }

  if(ballY>=canvas.height){
    ballSpeedY=-ballSpeedY;
  }

  if(ballY<=0){
    ballSpeedY=-ballSpeedY;
  }
}

function colorRect(leftX,topY,width,height,drawColour){
  canvasContext.fillStyle=drawColour;
  canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(centerX,centerY,radius,drawColour){
  canvasContext.fillStyle=drawColour;
  canvasContext.beginPath();
  // x,y,radius,radians(0,2 pi r),clockwise or counterclockwise.
  canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
  canvasContext.fill();
}
