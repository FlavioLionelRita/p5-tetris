const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const ConfigExtents = require('config-extends');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router); 
app.use(express.static('public'));

(async () => { 
    try {        
        let config = await ConfigExtents.apply(path.join(__dirname,'config'));
        let versions = [];
        for(let key in config.versions){
            versions.push(config.versions[key]);
        }

        app.get('/age/:age/level/:level/config', function (req, res) {
            let age   = req.params.age!='null'?parseInt(req.params.age):4;
            let level = req.params.level!='null'?parseInt(req.params.level):1;
            let data = versions.find(p=> p.age.from <= age && p.age.to >= age && p.level ==level);
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




