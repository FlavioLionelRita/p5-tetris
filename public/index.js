
let game;

async function setup() {  
  let queryString = window.location.search;
  let urlParams= new URLSearchParams(queryString);
  let age =  urlParams.has('age')?urlParams.get('age'):4;
  let level = urlParams.has('level')?urlParams.get('level'):1;
  config = await $.ajax({url: '/age/'+age+'/level/'+level+'/config',type: 'GET'});
  let width = config.screen.cols * config.screen.pixelSize;
  let high = config.screen.rows * config.screen.pixelSize;
  const canvas = createCanvas(width,high);
  canvas.parent('#canvasHolder');
  game = new Game(config);
}
async function draw() {
    background(0);
    if(game)
       game.draw();
}



class Game
{
    constructor(config){
      this.config = config;
      this.nextPieceStrategy = this.getNextPieceStrategy();

      this.mat = new Array(this.config.screen.rows);
        for(let i=0;i<this.config.screen.rows;i++){
          this.mat[i]=new Array(this.config.screen.cols);
          for(let j=0;j<this.config.screen.rows;j++){
            this.mat[i][j]="";
          }
        }
      this.currentPiece = this.getNextPiece();  
    }
    getNextPiece(){
        let nextShapeInfo = this.nextPieceStrategy.nextPiece(); 
        let shapeConfig =  this.config.shapes.find(p=> p.name == nextShapeInfo.name );
        let shape = new TetrisShape(shapeConfig.name,shapeConfig.shape,shapeConfig.color);
        return new Piece(5,0,0,this.config.screen.pixelSize,nextShapeInfo.speed,shape);
    }
    getNextPieceStrategy(){
        switch(this.config.sequence.type)
        {
          case "random": return new RandomNextPiece(this.config);
          case "fixed": return new FixedNextPiece(this.config);
          case "orderRandom": return new OrderRandomNextPiece(this.config);
          default: return new RandomNextPiece(this.config);
        }
    }

    draw() {
      background(0);
      if(this.currentPiece)      
         this.currentPiece.draw(); 
  
      if(this.mat){
        for(let i=0;i<this.config.rows;i++){
          for(let j=0;j<this.config.cols;j++){
            if(this.mat[i][j]!=""){
              fill(this.mat[i][j]);
              rect(j*this.config.screen.pixelSize,i*this.config.screen.pixelSize, this.config.screen.pixelSize ,this.config.screen.pixelSize );
            }
          }
        }
      } 

    }  
}





class NextPieceStrategy
{
  constructor(config){
    this.config = config;
  }
  nextPiece(){ }
}

class RandomNextPiece extends NextPieceStrategy
{
  nextPiece(){
      let index = Math.floor((Math.random() * this.config.shapes.length));
      let speed = Math.floor((Math.random() * (this.config.sequence.speedMax-this.config.sequence.speedMin)) + this.config.sequence.speedMin);
      return {name:this.config.sequence.shapes.charAt(index),speed:speed};
  }
}

class OrderRandomNextPiece extends NextPieceStrategy
{
  nextPiece(){

  }
}

class FixedNextPiece extends NextPieceStrategy
{
  nextPiece(){

  }
}


class TetrisShape
{
  constructor(name,shape,color){
      this.name = name;
      this.color = color;
      this.shape = shape;
      let lines = this.shape.split('\n');
      this.cols = lines.length; 
      this.rows = lines[0].length;
      this.positions = [];
      this.mat= new Array(this.cols);
      for(let i=0;i<this.cols;i++){
        let line = lines[i];
        this.mat[i] = new Array(this.rows);
        for(let j=0;j<this.rows;j++){
          this.mat[i][j] = line[j]=="-"?"":line[j];
        }
      } 
  }
}

class Piece
{
    constructor(x,y,angle,size,speed,shape){
      this.x=x;
      this.y=y;
      this.angle = angle;
      this.size = size;
      this.speed = speed;
      this.shape = shape;
      this.try= 0;      
    }
    draw(){
      
      this.try++;
      if(this.try * this.speed >10){
        this.updatepPosition();
        this.try=0;
      }
      
      for(let i=0;i<this.shape.positions.length;i++){       
        let p = this.shape.positions[i];
        fill(this.shape.color);
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
      for(let i=0;i<this.shape.cols;i++){       
        for(let j=0;j<this.shape.rows;j++){
          if(this.shape.mat[i][j]=="#"){
           
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
                _x= nextPosition.x+ (this.shape.rows - j);
                _y=nextPosition.y+i; 
                break;
              case 270: 
                _x= nextPosition.x+i;
                _y=nextPosition.y+(this.shape.rows-j);
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
        if(game.mat[p.x][p.y]!="")return false;
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
          this.shape.positions = nextShapePositions;
      }      
    }
}