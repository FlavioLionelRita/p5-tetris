import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
export class ConfigManager {
    constructor(configPath) {
        this._configPath = configPath;
        this.loadCategories();
    }
    getConfig(age, level) {
        let category = this._categories.find(p => p.from >= age && p.to <= age);
        let config = this.readConfigFile(path.join(this._configPath, category.name, level.toString(), 'config.yaml'));
        return config;
    }
    loadCategories() {
        let result = [];
        let list = fs.readdirSync(this._configPath);
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let ages = item.split('-');
            if (ages.length == 1)
                result.push({ name: item, from: parseInt(ages[0]), to: parseInt(ages[0]) });
            else
                result.push({ name: item, from: parseInt(ages[0]), to: parseInt(ages[1]) });
        }
        this._categories = result;
    }
    readConfigFile(filePath) {
        if (!fs.existsSync(filePath))
            return null;
        let content = fs.readFileSync(filePath, 'utf8');
        let data = yaml.safeLoad(content);
        this.loadRerefences(path.dirname(filePath), data);
        return data;
    }
    loadRerefences(sourcePath, source) {
        if (typeof source == "object")
            this.loadRerefencesFromObject(sourcePath, source);
        if (Array.isArray(source))
            this.loadRerefencesFromArray(sourcePath, source);
    }
    loadRerefencesFromObject(sourcePath, obj) {
        for (let name in obj) {
            let p = obj[name];
            if (p._ref !== undefined)
                obj[name] = this.readConfigFile(path.join(sourcePath, p._ref));
            else if (typeof p == "object")
                this.loadRerefencesFromObject(sourcePath, p);
            else if (Array.isArray(p))
                this.loadRerefencesFromArray(sourcePath, p);
        }
    }
    loadRerefencesFromArray(sourcePath, array) {
        for (let i = 0; i < array.length; i++) {
            let p = array[i];
            if (typeof p == "object")
                this.loadRerefencesFromObject(sourcePath, p);
            if (Array.isArray(p))
                this.loadRerefencesFromArray(sourcePath, p);
        }
    }
}
//# sourceMappingURL=configManager.js.map