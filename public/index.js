
let game;
let currentPiece;
let config;
let mat;

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

  mat = new Array(config.rows);
  for(let i=0;i<config.rows;i++){
    mat[i]=new Array(config.cols);
    for(let j=0;j<config.rows;j++){
      mat[i][j]="";
    }
  }

  //pieces.push(new SquarePiece(0,0,false,0,1));
  currentPiece = new TPiece(5,0,0,1);
}
async function draw() {
    background(0);
    if(currentPiece)      
       currentPiece.draw(); 

    if(mat){
      for(let i=0;i<config.rows;i++){
        for(let j=0;j<config.cols;j++){
          if(mat[i][j]!=""){
            fill(mat[i][j]);
            rect(j*config.pixelSize,i*config.pixelSize, config.pixelSize , config.pixelSize );
          }
        }
      }
    }
           
      
          
}




class Piece
{
    constructor(x,y,angle,speed,shape,color){
      this.x=x;
      this.y=y;
      this.size = config.pixelSize;
      this.angle = angle;
      this.color = color;
      this.speed = speed;
      this.shape = shape;
      let lines = this.shape.split('\r\n'); 
      this.shape_cols = lines.length;
      this.shape_rows = lines[0].length;
      this.shape_mat= new Array(this.shape_cols);
      for(let i=0;i<this.shape_cols;i++){
        let line = lines[i];
        this.shape_mat[i] = new Array(this.shape_rows);
        for(let j=0;j<this.shape_rows;j++){
          this.shape_mat[i][j] = line[j];
        }
      } 
      this.try= 0;
      
      
    }
    draw(){
      
      this.try++;
      if(this.try * this.speed >10){
        this.updatepPosition();
        this.try=0;
      }
      
      //  #
      //  ##
      //  #

      //  ###
      //   #
      
    

      for(let i=0;i<this.shape_cols;i++){       
        for(let j=0;j<this.shape_rows;j++){
          if(this.shape_mat[i][j]=="#"){
            fill(this.color);
            switch(this.angle) {
              case 0: 
                rect((this.x+j)*this.size,(this.y+i)*this.size, this.size , this.size ); 
                break; 
              case 90: 
                rect((this.x+i)*this.size,(this.y+j)*this.size, this.size , this.size ); 
                break;
              case 180: 
                rect((this.x+j)*this.size,(this.y+i)*this.size, this.size , this.size ); 
                break;
              case 270: 
                rect((this.x+i)*this.size,(this.y+j)*this.size, this.size , this.size );  
                break; 
            } 
          }
        } 
      }
     
       
    }
     
     

    updatepPosition(){
            
      let _x=0;
      let _y=0;
      if(keyIsDown(LEFT_ARROW)){
        _x-=1;
      }
      else if(keyIsDown(RIGHT_ARROW)){
        _x+=1;
      }
      else if(keyIsDown(UP_ARROW)){
          if(this.angle==270)this.angle=0
          else this.angle+=90;
      }
      else if(keyIsDown(DOWN_ARROW)){
          _y+=1;
      }
      let next_x = parseInt(this.x + _x);
      let next_y =  parseInt(this.y + _y); 
      if(next_x>=0 && next_x<(config.cols -this.shape_cols ))this.x  = next_x;
      if(next_y>=0 && next_y<=(config.rows-this.shape_rows))this.y = next_y;
      
    }
}





class SquarePiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "##\r\n"
               +"##" 
    super(x,y,angle,speed,shape,'green');
  }

}
class TPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "# \r\n"
               +"##\r\n"
               +"# " 
    super(x,y,angle,speed,shape,'blue');
  }  
}
class StickPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "#\r\n"
               +"#\r\n"
               +"#\r\n"
               +"#" 
    super(x,y,angle,speed,shape,'fucsia');
  }  
}
class LPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "# \r\n"
               +"# \r\n"
               +"##"
    super(x,y,angle,speed,shape,'yellow');
  }  
}
class LLPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "##\r\n"
               +"# \r\n"
               +"# "
    super(x,y,angle,speed,shape,'pink');
  }  
}
class T2Piece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "##\r\n"
               +"# \r\n"
               +"# "
    super(x,y,angle,speed,shape,'pink');
  }  
}
class ZPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = "## \r\n"
               +" ##"
    super(x,y,angle,speed,shape,'cyan');
  }  
}
class SPiece extends Piece
{
  constructor(x,y,angle,speed){
    let shape = " ##\r\n"
               +"## "
    super(x,y,angle,speed,shape,'orange');
  }  
}


