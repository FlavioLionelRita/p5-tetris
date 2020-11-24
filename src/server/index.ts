import {path} from 'path';
import express = require("express");
import bodyParser = require("body-parser");
const router = express.Router();
const app = express();
import {ConfigReader} from "./lib/configReader"; 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router); 
app.use(express.static('public'));


(async () => { 
    try {       
        let configReader:ConfigReader  = new ConfigReader(path.join(__dirname,'../config'));        
        app.get('/age/:age/level/:level/config', function (req:any, res:any) {
            let data:any = configReader.get(parseInt(req.params.age),parseInt(req.params.level));   
            res.send(data);
        }); 
        app.listen(process.env.APP_PORT);
        console.log('Server running at: '+process.env.APP_HOST+':'+process.env.APP_PORT); 
        process.exitCode = 0;
        return 0;
    }
    catch (error) {     
        console.error(error);  
        process.exitCode = -1;
        return -1;
    }    
})();