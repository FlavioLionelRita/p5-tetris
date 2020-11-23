"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigReader = void 0;
var path = require("path");
var fs = require("fs");
var yaml = require("js-yaml");
var Category = /** @class */ (function () {
    function Category() {
    }
    return Category;
}());
var ConfigReader = /** @class */ (function () {
    function ConfigReader(configPath) {
        this._configPath = configPath;
        this._categories = this.getCategories(this._configPath);
    }
    ConfigReader.prototype.get = function (age, level) {
        var category = this._categories.find(function (p) { return p.from >= age && p.to <= age; });
        var config = this.readConfigFile(path.join(this._configPath, category.name, level.toString(), 'config.yaml'));
        return config;
    };
    ConfigReader.prototype.getCategories = function (categoriesPath) {
        var result = [];
        var list = fs.readdirSync(categoriesPath);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var ages = item.split('-');
            if (ages.length == 1)
                result.push({ name: item, from: parseInt(ages[0]), to: parseInt(ages[0]) });
            else
                result.push({ name: item, from: parseInt(ages[0]), to: parseInt(ages[1]) });
        }
        return result;
    };
    ConfigReader.prototype.readConfigFile = function (filePath) {
        if (!fs.existsSync(filePath))
            return null;
        var content = fs.readFileSync(filePath, 'utf8');
        var data = yaml.safeLoad(content);
        this.loadRerefences(path.dirname(filePath), data);
        return data;
    };
    ConfigReader.prototype.loadRerefences = function (sourcePath, source) {
        if (typeof source == "object")
            this.loadRerefencesFromObject(sourcePath, source);
        if (Array.isArray(source))
            this.loadRerefencesFromArray(sourcePath, source);
    };
    ConfigReader.prototype.loadRerefencesFromObject = function (sourcePath, obj) {
        for (var name_1 in obj) {
            var p = obj[name_1];
            if (p._ref !== undefined)
                obj[name_1] = this.readConfigFile(path.join(sourcePath, p._ref));
            else if (typeof p == "object")
                this.loadRerefencesFromObject(sourcePath, p);
            else if (Array.isArray(p))
                this.loadRerefencesFromArray(sourcePath, p);
        }
    };
    ConfigReader.prototype.loadRerefencesFromArray = function (sourcePath, array) {
        for (var i = 0; i < array.length; i++) {
            var p = array[i];
            if (typeof p == "object")
                this.loadRerefencesFromObject(sourcePath, p);
            if (Array.isArray(p))
                this.loadRerefencesFromArray(sourcePath, p);
        }
    };
    return ConfigReader;
}());
exports.ConfigReader = ConfigReader;
