import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
//const router = express.Router();
const app = express();
import { ConfigManager } from "./lib/configManager";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(app.router);
//app.use("/", router); 
app.use(express.static('public'));
(async () => {
    try {
        let configManager = new ConfigManager(path.join(__dirname, '../config'));
        app.get('/age/:age/level/:level/config', function (req, res) {
            let data = configManager.getConfig(parseInt(req.params.age), parseInt(req.params.level));
            res.send(data);
        });
        app.listen(process.env.APP_PORT);
        console.log('Server running at: ' + process.env.APP_HOST + ':' + process.env.APP_PORT);
        process.exitCode = 0;
        return 0;
    }
    catch (error) {
        console.error(error);
        process.exitCode = -1;
        return -1;
    }
})();
//# sourceMappingURL=index.js.map