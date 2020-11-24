// const fs = require('fs');
// const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const Service = require("./lib/service");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router); 
app.use(express.static('public'));


(async () => { 
    try {
        
        let service = new Service();
        app.get('/age/:age/level/:level/config', function (req, res) {
            let data = service.config(req.params.age,req.params.level);   
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




