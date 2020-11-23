import path = require('path');
import fs = require('fs');
import yaml = require('js-yaml');

class Category{
    public name:string;
    public from:number;
    public to:number;
} 

export class ConfigReader
{
  protected _configPath : string;
  protected _categories : Array<Category>;

  constructor(configPath:string){
      this._configPath = configPath;
      this._categories = this.getCategories(this._configPath);
  }
  public get(age:number,level:number):any{
    let category =  this._categories.find(p=> p.from>=age && p.to<=age );
    let config = this.readConfigFile(path.join(this._configPath,category.name,level.toString(),'config.yaml'));
    return config;
  }

  protected getCategories(categoriesPath:string): Array<Category> {
    let result: Array<Category> = [];
    let list:Array<string> =fs.readdirSync(categoriesPath);
    for(let i=0;i<list.length;i++){
      let item =  list[i];
      let ages : Array<string> = item.split('-');
      if(ages.length==1)result.push({name:item,from:parseInt(ages[0]),to:parseInt(ages[0])}); 
      else result.push({name:item,from:parseInt(ages[0]),to:parseInt(ages[1])});          
    }
    return result;
  }
  protected readConfigFile(filePath:string):any{
    if(!fs.existsSync(filePath))return null;   
    let content:string = fs.readFileSync(filePath,'utf8');
    let data:any = yaml.safeLoad(content);
    this.loadRerefences(path.dirname(filePath),data);
    return data;
  }
  protected loadRerefences(sourcePath:string,source:any){
    if(typeof source=="object")this.loadRerefencesFromObject(sourcePath,source);
    if(Array.isArray(source))this.loadRerefencesFromArray(sourcePath,source); 
  }
  protected loadRerefencesFromObject(sourcePath:string,obj:any){
    for(let name in obj){
      let p:any = obj[name]; 
      if(p._ref !== undefined)obj[name]= this.readConfigFile(path.join(sourcePath,p._ref));
      else if(typeof p=="object")this.loadRerefencesFromObject(sourcePath,p);
      else if(Array.isArray(p))this.loadRerefencesFromArray(sourcePath,p);      
    }
  }
  protected loadRerefencesFromArray(sourcePath:string,array: any){
    for(let i=0;i<array.length;i++){
      let p= array[i];
      if(typeof p=="object")this.loadRerefencesFromObject(sourcePath,p);
      if(Array.isArray(p))this.loadRerefencesFromArray(sourcePath,p);  
    }
  }
  

}