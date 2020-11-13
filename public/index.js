let WIDTH;
let HIGH;
let PIXEL_SIZE;
let game;
let pieces=[];

async function setup() {  
  let queryString = window.location.search;
  let urlParams= new URLSearchParams(queryString);
  let age =  urlParams.has('age')?urlParams.get('age'):4;
  let level = urlParams.has('level')?urlParams.get('level'):1;
  let config = await $.ajax({url: '/age/'+age+'/level/'+level+'/config',type: 'GET'});
  WIDTH = config.spec.screen.width;
  HIGH = config.spec.screen.high;
  PIXEL_SIZE = config.spec.pixelSize;
  const canvas = createCanvas(WIDTH, HIGH);
  canvas.parent('#canvasHolder');
  //game = new Game(config);,

  pieces.push(new SquarePiece(5,0,true,config.spec.pixelSize,0,1));
  pieces.push(new TPiece(0,0,false,config.spec.pixelSize,0,1));
}
async function draw() {
    background(0);
    for(let i=0;i<pieces.length;i++){
      pieces[i].updatepPosition(); 
      pieces[i].draw();  
    }      
}




class Piece
{
    constructor(x,y,current,size,angle,speed,shape,color){
      this.x=x;
      this.y=y;
      this.size = size;
      this.angle = angle;
      this.color = color;
      this.speed = speed;
      this.shape = shape;
      this.current = current;
      
    }
    draw(){
      let lines = this.shape.split('\r\n'); 
      for(let i=0;i<lines.length;i++){
        let line = lines[i];
        for(let j=0;j<line.length;j++){
          fill(this.color);  
          rect((this.x+j)*this.size,(this.y+i)*this.size, this.size , this.size );
        } 
      } 
    }
     
     

    updatepPosition(){

      if(this.current){
        let _x=0;
        let _y=0;
        if(keyIsDown(LEFT_ARROW))_x-=this.speed;
        else if(keyIsDown(RIGHT_ARROW))_x+=this.speed;
        else if(keyIsDown(UP_ARROW))_y-=this.speed;
        else if(keyIsDown(DOWN_ARROW))_y+=this.speed;       
        this.x  = parseInt(this.x + _x);
        this.y = parseInt(this.y + _y);
      }
    }
}

class SquarePiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "##\r\n"
               +"##" 
    super(x,y,current,size,angle,speed,shape,'green');
  }

}
class TPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "#\r\n"
               +"##\r\n"
               +"#" 
    super(x,y,current,size,angle,speed,shape,'blue');
  }  
}
class StickPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "#\r\n"
               +"#\r\n"
               +"#\r\n"
               +"#" 
    super(x,y,current,size,angle,speed,shape,'fucsia');
  }  
}
class LPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "#\r\n"
               +"#\r\n"
               +"##"
    super(x,y,current,size,angle,speed,shape,'yellow');
  }  
}
class LLPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "##\r\n"
               +"#\r\n"
               +"#"
    super(x,y,current,size,angle,speed,shape,'pink');
  }  
}
class T2Piece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "##\r\n"
               +"#\r\n"
               +"#"
    super(x,y,current,size,angle,speed,shape,'pink');
  }  
}
class ZPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = "##\r\n"
               +" ##"
    super(x,y,current,size,angle,speed,shape,'cyan');
  }  
}
class SPiece extends Piece
{
  constructor(x,y,current,size,angle,color,speed){
    let shape = " ##\r\n"
               +"##"
    super(x,y,current,size,angle,speed,shape,'orange');
  }  
}