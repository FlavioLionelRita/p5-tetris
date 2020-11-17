
let game;
let pieces=[];
let config;

async function setup() {  
  //angleMode(DEGREES);
  let queryString = window.location.search;
  let urlParams= new URLSearchParams(queryString);
  let age =  urlParams.has('age')?urlParams.get('age'):4;
  let level = urlParams.has('level')?urlParams.get('level'):1;
  config = await $.ajax({url: '/age/'+age+'/level/'+level+'/config',type: 'GET'});

  const canvas = createCanvas(config.screen.width, config.screen.high);
  canvas.parent('#canvasHolder');
  //game = new Game(config);,

  pieces.push(new SquarePiece(0,0,false,0,1));
  pieces.push(new TPiece(5,0,true,0,1));
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
    constructor(x,y,current,angle,speed,shape,color){
      this.x=x;
      this.y=y;
      this.size = config.pixelSize;
      this.angle = angle;
      this.color = color;
      this.speed = speed;
      this.shape = shape;
      this.shape_lines = this.shape.split('\r\n'); 
      this.shape_high = this.shape_lines.length;
      this.shape_width = this.shape_lines[0].length;
      this.current = current;
      
    }
    draw(){
      
      //rotate(90);       
     
      for(let i=0;i<this.shape_lines.length;i++){
        let line = this.shape_lines[i];
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
        if(keyIsDown(LEFT_ARROW)){
          _x-=this.speed;
        }
        else if(keyIsDown(RIGHT_ARROW)){
          _x+=this.speed;
        }
        else if(keyIsDown(UP_ARROW)){
          _y-=this.speed; 
        }
        //else if(keyIsDown(UP_ARROW))this.angle+=90;//   _rotate(90); //REVISAR  0 90 180 270
        else if(keyIsDown(DOWN_ARROW)){
            _y+=this.speed;
        }
        let next_x = parseInt(this.x + _x);
        let next_y =  parseInt(this.y + _y); 
        if(next_x>=0 && next_x<(config.cols -this.shape_width ))this.x  = next_x;
        if(next_y>=0 && next_y<=(config.rows-this.shape_high))this.y = next_y;
      }
    }
}





class SquarePiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "##\r\n"
               +"##" 
    super(x,y,current,angle,speed,shape,'green');
  }

}
class TPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "#\r\n"
               +"##\r\n"
               +"#" 
    super(x,y,current,angle,speed,shape,'blue');
  }  
}
class StickPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "#\r\n"
               +"#\r\n"
               +"#\r\n"
               +"#" 
    super(x,y,current,angle,speed,shape,'fucsia');
  }  
}
class LPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "#\r\n"
               +"#\r\n"
               +"##"
    super(x,y,current,angle,speed,shape,'yellow');
  }  
}
class LLPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "##\r\n"
               +"#\r\n"
               +"#"
    super(x,y,current,angle,speed,shape,'pink');
  }  
}
class T2Piece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "##\r\n"
               +"#\r\n"
               +"#"
    super(x,y,current,angle,speed,shape,'pink');
  }  
}
class ZPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = "##\r\n"
               +" ##"
    super(x,y,current,angle,speed,shape,'cyan');
  }  
}
class SPiece extends Piece
{
  constructor(x,y,current,angle,speed){
    let shape = " ##\r\n"
               +"##"
    super(x,y,current,angle,speed,shape,'orange');
  }  
}


