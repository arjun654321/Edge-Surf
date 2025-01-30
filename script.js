const c = document.querySelector('canvas');
const ctx = c.getContext('2d');
const cw = c.width = window.innerWidth;
const ch = c.height = window.innerHeight;
const img = new Image();
img.src = 'surf.png'; 

let dir = 0;
let spd = 1;
let skierX = cw/2;
let obs = [];
let gameOn = false;
let keysEnabled = true;
let totalY = 0;

function drawObs(ctx,type,x,y,h,w){
  
  if (type === 'tree'){
    
    ctx.fillStyle='#624D6E';
    const t = new Path2D();
      t.moveTo(x+w/2, y);
      t.lineTo(x, y+h*0.9);
      t.lineTo(x+w*0.33, y+h*0.85);
      t.lineTo(x+w*0.33, y+h);
      t.lineTo(x+w*0.66, y+h);
      t.lineTo(x+w*0.66, y+h*0.85);
      t.lineTo(x+w, y+h*0.9);
      t.closePath();
    ctx.fill(t);
    
  } else if (type === 'mound'){
    
    ctx.strokeStyle='#868999';
    ctx.lineWidth=1;
    const m = new Path2D();
      m.moveTo(x, y);
      m.quadraticCurveTo(x+w/2,y-h,x+w, y);
    ctx.stroke(m);
    
 } else {
   console.error('Drawing error');
 }
}


function createObs(){
  const types = ['tree','mound'];
  const type = types[Math.round(Math.random())];
  
  if (type === 'tree'){
    const h = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    obs.push({
      type: 'tree',
      x: Math.round(cw*Math.random()),
      y: ch,
      height: h,
      width: h/2
    });
  } else if (type === 'mound'){
    const w = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    obs.push({
      type: 'mound',
      x: Math.round(cw*Math.random()),
      y: ch,
      height: w/2,
      width: w
    });
  } else {
     console.error('Creation error');
   }
    
  if(obs.length>0 && obs[0].y < 0 -obs[0].height){
     obs.shift();
  }
  
}


function draw() { 
    ctx.clearRect(0, 0, cw, ch);
    totalY++;
    
    ctx.fillStyle='#9B000F';
    
    if (totalY<10){
      ctx.textAlign="center"; 
      ctx.fillStyle='#111213';
      ctx.font = "40px Helvetica";
      ctx.fillText(`Edge Surf`,cw/2,60);
      ctx.font = "20px Helvetica";
      ctx.fillText(`Tap any arrow key to start`,cw/2,100);
      ctx.font = "16px Helvetica";
      ctx.fillText(`Use ← and → to steer`,cw/2,124);
      ctx.fillStyle='#E8E9EE';
    }
  
    ctx.textAlign="start"; 
    ctx.font = "14px Helvetica";
    ctx.fillText(`Score: ${Math.floor((totalY-1)/4)} feet`,10,25);
    
    const skierY = ch / 4; 
    const imgW = 50; 
    const imgH = 50; 
    ctx.drawImage(img, skierX - imgW / 2, skierY, imgW, imgH);
    
    obs = obs.map(function(o){
      return {
        type: o.type,
        x: o.x,
        y: o.y-spd,
        height: o.height,
        width: o.width
      }     
    });
  
 
  if (skierX < 0){
    skierX += Math.abs(dir/2);
  } else if (skierX > cw) {
    skierX -= Math.abs(dir/2);
  } else {
    skierX += dir/2;
  }

  obs.forEach(function(o) {
   
    drawObs(ctx,
                  o.type,
                  o.x,
                  o.y,
                  o.height,
                  o.width);
    
    
    if (o.y + o.height > skierY - imgH
        && o.y < skierY
        && o.x - o.width / 2 < skierX 
        && o.x + o.width / 2 > skierX 
        && o.type == 'tree'){
      console.log('crash!');
      stopGame();
      gameOn = false;

      ctx.fillStyle='#9B000F';
      ctx.font = "16px Helvetica";
      ctx.fillText(`YOU CRASHED!!!`,10,60);
      ctx.fillStyle='#111213';
      ctx.fillText(`You traveled ${Math.floor((totalY-1)/4)} feet.`,10,80);
      ctx.fillText(`Press space to restart.`,10,100);
    }
  });
}

function handleKey(e){
  const key = e.key;  
  const keycode = e.keyCode;  

  if (keysEnabled){
    if(key === "ArrowLeft" && dir > -2){
      dir--;
    } else if (key === "ArrowRight" && dir < 2){
      dir++;
    };

    if(key === "ArrowLeft" || "ArrowRight" ||"ArrowUp" || "ArrowDown"){
      startGame();
      gameOn = true;
    } 
  }
  
  if (keycode===32 && gameOn === false){
      window.location.reload(true);
  }
  
}

function startGame(){
  if (!gameOn){
    console.log('game on!');
    obsInterval = setInterval(createObs,50);
    gameInterval = setInterval(draw,1);
  } 
}

function stopGame(){
  if(gameOn){
    clearInterval(obsInterval);
    clearInterval(gameInterval);
    keysEnabled = false;
  }
}

document.addEventListener('keydown',  handleKey);

draw();