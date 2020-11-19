
let game;
let currentPiece;
let config;
let mat;

async function setup() {  
  let queryString = window.location.search;
  let urlParams= new URLSearchParams(queryString);
  let age =  urlParams.has('age')?urlParams.get('age'):4;
  let level = urlParams.has('level')?urlParams.get('level'):1;
  config = await $.ajax({url: '/age/'+age+'/level/'+level+'/config',type: 'GET'});
  const canvas = createCanvas(config.screen.width, config.screen.high);
  canvas.parent('#canvasHolder');

  mat = new Array(config.rows);
  for(let i=0;i<config.rows;i++){
    mat[i]=new Array(config.cols);
    for(let j=0;j<config.rows;j++){
      mat[i][j]="";
    }
  }
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
      this.shapeCols = lines.length;
      this.shapeRows = lines[0].length;
      this.shapePositions = [];
      this.shapeMat= new Array(this.shapeCols);
      for(let i=0;i<this.shapeCols;i++){
        let line = lines[i];
        this.shapeMat[i] = new Array(this.shapeRows);
        for(let j=0;j<this.shapeRows;j++){
          this.shapeMat[i][j] = line[j];
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
      
      for(let i=0;i<this.shapePositions.length;i++){       
        let p = this.shapePositions[i];
        fill(this.color);
        rect(p.x*this.size,p.y*this.size, this.size , this.size );
      }       
    }
    
    getNextPosition(){
      let _x=0;
      let _y=0;
      let _angle=this.angle;
      if(keyIsDown(LEFT_ARROW))_x-=1;
      else if(keyIsDown(RIGHT_ARROW))_x+=1;
      else if(keyIsDown(UP_ARROW))_angle=_angle==270?0:_angle+=90;
      else if(keyIsDown(DOWN_ARROW))_y+=1;

      let next_x = parseInt(this.x + _x);
      let next_y =  parseInt(this.y + _y); 
      return {x:next_x,y:next_y,angle:_angle};
    }
    getNextShapePositions(nextPosition){
      let list = [];
      for(let i=0;i<this.shapeCols;i++){       
        for(let j=0;j<this.shapeRows;j++){
          if(this.shapeMat[i][j]=="#"){
           
            let _x;
            let _y;
            switch(nextPosition.angle) {
              case 0: 
                _x=nextPosition.x+j;
                _y=nextPosition.y+i;
                break; 
              case 90:
                _x=nextPosition.x+i;
                _y=nextPosition.y+j;                
                break;
              case 180: 
                _x= nextPosition.x+ (this.shapeRows - j);
                _y=nextPosition.y+i; 
                break;
              case 270: 
                _x= nextPosition.x+i;
                _y=nextPosition.y+(this.shapeRows-j);
                break; 
            } 
            list.push({x:_x,y:_y});
          }
        } 
      }
      return list;
    }
    validateNextShapePositions(list){
      for(let i=0;i<list.length;i++){ 
        let p = list[i];
        if(p.x<0 || p.x>config.cols-1)return false;
        if(p.y<0 || p.y>config.rows-1)return false;        
        if(mat[p.x][p.y]!="")return false;
      } 
      return true;
    }
    updatepPosition(){

      let nextPosition = this.getNextPosition();
      let nextShapePositions = this.getNextShapePositions(nextPosition);
      if(this.validateNextShapePositions(nextShapePositions)){
          this.x = nextPosition.x;
          this.y = nextPosition.y;
          this.angle = nextPosition.angle;
          this.shapePositions = nextShapePositions;
      }      
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


