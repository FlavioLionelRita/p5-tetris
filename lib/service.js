const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = class Service
{
  constructor(solution){
      this.solution=solution;
      this.categories = [];
      this.shapes;
      this.load();
  }
  load(){
    let list =fs.readdirSync(path.join(__dirname,'../data'));
    for(let i=0;i<list.length;i++){
      let item =  list[i];
      let ages = item.split('-');
      if(ages.length==1)
        this.categories.push({name:item,from:ages[0],to:ages[0]}); 
      else
        this.categories.push({name:item,from:ages[0],to:ages[1]});    
    }
    let filePath = path.join(__dirname,'../data','shapes.yaml');
    let content= fs.readFileSync(filePath, 'utf8');
    this.shapes =yaml.safeLoadAll(content)[0]; 

  }
  config(age,level){
    let category =  this.categories.find(p=> p.from>=age && p.to<=age );
    let filePath = path.join(__dirname,'../data',category.name,level,'config.yaml');
    if(!fs.existsSync(filePath))
       return null;

      let content= fs.readFileSync(filePath, 'utf8');
      let config = yaml.safeLoadAll(content)[0]; 
      config.shapes =  this.shapes;
      return config;
  }

}