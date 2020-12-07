import $ from 'jquery';
import P5 from 'p5';


var game:Game;

const sketch = (p5: P5) => {

  p5.setup = async () => {  


    let queryString = window.location.search;
    let urlParams= new URLSearchParams(queryString);
    let age =  urlParams.has('age')?urlParams.get('age'):4;
    let level = urlParams.has('level')?urlParams.get('level'):1;
    let config = await $.ajax({url: '/age/'+age+'/level/'+level+'/config',type: 'GET'});
    let width = config.screen.cols * config.screen.pixelSize;
    let high = config.screen.rows * config.screen.pixelSize;
    const canvas = p5.createCanvas(width,high);
    canvas.parent('#canvasHolder');
    game = new Game(config);
    game.p5 = p5;
    
  }
  p5.draw= async ()=> {
    p5.background(0);
    if(game)
      game.draw();
  }
};
new P5(sketch);







interface IScreen
{
  rows: number;
  cols: number;
  pixelSize: number;
}
interface IConfig
{
  sequence: any;
  screen: IScreen;
  shapes: IShape[];
}
interface IPosition
{
  x:number;
  y:number;
}
interface IShapePosition
{
  x:number;
  y:number;
  angle:number;
}

class Game
{
  public mat: string[][];
  public config: IConfig;
  public nextPieceStrategy:NextPieceStrategy;
  public currentPiece: Piece;
  protected nextPieceStrategies:NextPieceStrategy[]=[];
  public p5:P5;

  constructor(config:IConfig){
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
  public AddNextPieceStrategy(strategy:NextPieceStrategy):void
  {
    strategy.config = this.config;
    this.nextPieceStrategies.push(strategy);
  }
  public draw() {
    this.p5.background(0);
    if(this.currentPiece)      
        this.currentPiece.draw(); 

    if(this.mat){
      for(let i=0;i<this.config.screen.rows;i++){
        for(let j=0;j<this.config.screen.cols;j++){
          if(this.mat[i][j]!=""){
            this.p5.fill(this.mat[i][j]);
            this.p5.rect(j*this.config.screen.pixelSize,i*this.config.screen.pixelSize, this.config.screen.pixelSize ,this.config.screen.pixelSize );
          }
        }
      }
    }
  }  

  protected  getNextPiece():Piece{
        let nextShapeInfo:INextShape = this.nextPieceStrategy.nextPiece(); 
        let shapeConfig =  this.config.shapes.find(p=> p.name == nextShapeInfo.name );
        let shape = new TetrisShape(shapeConfig.name,shapeConfig.shape,shapeConfig.color);
        return new Piece(5,0,0,this.config.screen.pixelSize,nextShapeInfo.speed,shape);
    }
  protected getNextPieceStrategy():NextPieceStrategy{

      return this.nextPieceStrategies.find(p=>p.name == this.config.sequence.type);
      // switch(this.config.sequence.type)
      // {
      //   case "random": return new RandomNextPiece(this.config);
      //   case "fixed": return new FixedNextPiece(this.config);
      //   case "orderRandom": return new OrderRandomNextPiece(this.config);
      //   default: return new RandomNextPiece(this.config);
      // }
  }

  
}






abstract class NextPieceStrategy
{
  public config: IConfig
  public name:string;
  constructor(name:string){
    this.name=name;
  }
  abstract  nextPiece(): INextShape 
}

class RandomNextPiece extends NextPieceStrategy 
{
  nextPiece(): INextShape{
      let index = Math.floor((Math.random() * this.config.sequence.shapes.length));
      let speed = Math.floor((Math.random() * (this.config.sequence.speedMax-this.config.sequence.speedMin)) + this.config.sequence.speedMin);
      return {name: this.config.sequence.shapes.charAt(index),speed:speed} ;
  }
}
game.AddNextPieceStrategy(new RandomNextPiece("random"));


class OrderRandomNextPiece extends NextPieceStrategy 
{
  nextPiece():INextShape{
    //TODO:
    return null;
  }
}
game.AddNextPieceStrategy(new OrderRandomNextPiece("orderRandom"));

class FixedNextPiece extends NextPieceStrategy 
{  
  nextPiece(): INextShape{
    //TODO:
    return null;
  }
}
game.AddNextPieceStrategy(new FixedNextPiece("fixed"));


interface INextShape
{
  name:string;
  speed:number;
}

interface IShape
{
  name:string;
  color:string;
  shape:string;
}

class TetrisShape
{
  public name:string;
  public color:string;
  public shape:string;
  public lines:string[];
  public cols:number;
  public rows:number;
  public mat:Array<string[]>;
  public positions:IPosition[];

  constructor(name:string,shape:string,color:string){
      this.name = name;
      this.color = color;
      this.shape = shape;
      let lines = this.shape.split('\n');
      this.cols = lines.length; 
      this.rows = lines[0].length;
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



interface ITetrisPiece
{
 x:number;
 y:number;
 size:number;
 speed:number;
}


class Piece
{
    public x:number;
    public y:number;
    public angle:number;
    public size:number;
    public speed:number;
    public shape:TetrisShape;
    public try:number;
    public config:IConfig;
    protected p5:P5;
    

    constructor(x:number,y:number,angle:number,size:number,speed:number,shape:TetrisShape){
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
        game.p5.fill(this.shape.color);
        game.p5.rect(p.x*this.size,p.y*this.size, this.size , this.size );
      }       
    }
    
    getNextPosition(): IShapePosition {
      let _x:number=0;
      let _y=0;
      let _angle=this.angle;
      if(game.p5.keyIsDown(game.p5.LEFT_ARROW))_x-=1;
      else if(game.p5.keyIsDown(game.p5.RIGHT_ARROW))_x+=1;
      else if(game.p5.keyIsDown(game.p5.UP_ARROW))_angle=_angle==270?0:_angle+=90;
      else if(game.p5.keyIsDown(game.p5.DOWN_ARROW))_y+=1;

      let next_x:number = this.x + _x;
      let next_y:number =  this.y + _y; 
      return {x:next_x,y:next_y,angle:_angle};
    }
    getNextShapePositions(nextPosition:IShapePosition):IPosition[]{
      let list: IPosition[]= [];
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
    validateNextShapePositions(list:IPosition[]):boolean{
      for(let i=0;i<list.length;i++){ 
        let p = list[i];
        if(p.x<0 || p.x>this.config.screen.cols-1)return false;
        if(p.y<0 || p.y>this.config.screen.rows-1)return false;        
        if(game.mat[p.x][p.y]!="")return false;
      } 
      return true;
    }
    updatepPosition():void{

      let nextPosition:IShapePosition = this.getNextPosition();
      let nextShapePositions = this.getNextShapePositions(nextPosition);
      if(this.validateNextShapePositions(nextShapePositions)){
          this.x = nextPosition.x;
          this.y = nextPosition.y;
          this.angle = nextPosition.angle;
          this.shape.positions = nextShapePositions;
      }      
    }
}