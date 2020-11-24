var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var game;
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var queryString, urlParams, age, level, config, width, high, canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryString = window.location.search;
                    urlParams = new URLSearchParams(queryString);
                    age = urlParams.has('age') ? urlParams.get('age') : 4;
                    level = urlParams.has('level') ? urlParams.get('level') : 1;
                    return [4 /*yield*/, $.ajax({ url: '/age/' + age + '/level/' + level + '/config', type: 'GET' })];
                case 1:
                    config = _a.sent();
                    width = config.screen.cols * config.screen.pixelSize;
                    high = config.screen.rows * config.screen.pixelSize;
                    canvas = createCanvas(width, high);
                    canvas.parent('#canvasHolder');
                    game = new Game(config);
                    return [2 /*return*/];
            }
        });
    });
}
function draw() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            background(0);
            if (game)
                game.draw();
            return [2 /*return*/];
        });
    });
}
var Game = /** @class */ (function () {
    function Game(config) {
        this.config = config;
        this.nextPieceStrategy = this.getNextPieceStrategy();
        this.mat = new Array(this.config.screen.rows);
        for (var i = 0; i < this.config.screen.rows; i++) {
            this.mat[i] = new Array(this.config.screen.cols);
            for (var j = 0; j < this.config.screen.rows; j++) {
                this.mat[i][j] = "";
            }
        }
        this.currentPiece = this.getNextPiece();
    }
    Game.prototype.getNextPiece = function () {
        var nextShapeInfo = this.nextPieceStrategy.nextPiece();
        var shapeConfig = this.config.shapes.find(function (p) { return p.name == nextShapeInfo.name; });
        var shape = new TetrisShape(shapeConfig.name, shapeConfig.shape, shapeConfig.color);
        return new Piece(5, 0, 0, this.config.screen.pixelSize, nextShapeInfo.speed, shape);
    };
    Game.prototype.getNextPieceStrategy = function () {
        switch (this.config.sequence.type) {
            case "random": return new RandomNextPiece(this.config);
            case "fixed": return new FixedNextPiece(this.config);
            case "orderRandom": return new OrderRandomNextPiece(this.config);
            default: return new RandomNextPiece(this.config);
        }
    };
    Game.prototype.draw = function () {
        background(0);
        if (this.currentPiece)
            this.currentPiece.draw();
        if (this.mat) {
            for (var i = 0; i < this.config.rows; i++) {
                for (var j = 0; j < this.config.cols; j++) {
                    if (this.mat[i][j] != "") {
                        fill(this.mat[i][j]);
                        rect(j * this.config.screen.pixelSize, i * this.config.screen.pixelSize, this.config.screen.pixelSize, this.config.screen.pixelSize);
                    }
                }
            }
        }
    };
    return Game;
}());
var NextPieceStrategy = /** @class */ (function () {
    function NextPieceStrategy(config) {
        this.config = config;
    }
    NextPieceStrategy.prototype.nextPiece = function () { };
    return NextPieceStrategy;
}());
var RandomNextPiece = /** @class */ (function (_super) {
    __extends(RandomNextPiece, _super);
    function RandomNextPiece() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RandomNextPiece.prototype.nextPiece = function () {
        var index = Math.floor((Math.random() * this.config.shapes.length));
        var speed = Math.floor((Math.random() * (this.config.sequence.speedMax - this.config.sequence.speedMin)) + this.config.sequence.speedMin);
        return { name: this.config.sequence.shapes.charAt(index), speed: speed };
    };
    return RandomNextPiece;
}(NextPieceStrategy));
var OrderRandomNextPiece = /** @class */ (function (_super) {
    __extends(OrderRandomNextPiece, _super);
    function OrderRandomNextPiece() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderRandomNextPiece.prototype.nextPiece = function () {
    };
    return OrderRandomNextPiece;
}(NextPieceStrategy));
var FixedNextPiece = /** @class */ (function (_super) {
    __extends(FixedNextPiece, _super);
    function FixedNextPiece() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedNextPiece.prototype.nextPiece = function () {
    };
    return FixedNextPiece;
}(NextPieceStrategy));
var TetrisShape = /** @class */ (function () {
    function TetrisShape(name, shape, color) {
        this.name = name;
        this.color = color;
        this.shape = shape;
        var lines = this.shape.split('\n');
        this.cols = lines.length;
        this.rows = lines[0].length;
        this.positions = [];
        this.mat = new Array(this.cols);
        for (var i = 0; i < this.cols; i++) {
            var line = lines[i];
            this.mat[i] = new Array(this.rows);
            for (var j = 0; j < this.rows; j++) {
                this.mat[i][j] = line[j] == "-" ? "" : line[j];
            }
        }
    }
    return TetrisShape;
}());
var Piece = /** @class */ (function () {
    function Piece(x, y, angle, size, speed, shape) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.size = size;
        this.speed = speed;
        this.shape = shape;
        this.try = 0;
    }
    Piece.prototype.draw = function () {
        this.try++;
        if (this.try * this.speed > 10) {
            this.updatepPosition();
            this.try = 0;
        }
        for (var i = 0; i < this.shape.positions.length; i++) {
            var p = this.shape.positions[i];
            fill(this.shape.color);
            rect(p.x * this.size, p.y * this.size, this.size, this.size);
        }
    };
    Piece.prototype.getNextPosition = function () {
        var _x = 0;
        var _y = 0;
        var _angle = this.angle;
        if (keyIsDown(LEFT_ARROW))
            _x -= 1;
        else if (keyIsDown(RIGHT_ARROW))
            _x += 1;
        else if (keyIsDown(UP_ARROW))
            _angle = _angle == 270 ? 0 : _angle += 90;
        else if (keyIsDown(DOWN_ARROW))
            _y += 1;
        var next_x = parseInt(this.x + _x);
        var next_y = parseInt(this.y + _y);
        return { x: next_x, y: next_y, angle: _angle };
    };
    Piece.prototype.getNextShapePositions = function (nextPosition) {
        var list = [];
        for (var i = 0; i < this.shape.cols; i++) {
            for (var j = 0; j < this.shape.rows; j++) {
                if (this.shape.mat[i][j] == "#") {
                    var _x = void 0;
                    var _y = void 0;
                    switch (nextPosition.angle) {
                        case 0:
                            _x = nextPosition.x + j;
                            _y = nextPosition.y + i;
                            break;
                        case 90:
                            _x = nextPosition.x + i;
                            _y = nextPosition.y + j;
                            break;
                        case 180:
                            _x = nextPosition.x + (this.shape.rows - j);
                            _y = nextPosition.y + i;
                            break;
                        case 270:
                            _x = nextPosition.x + i;
                            _y = nextPosition.y + (this.shape.rows - j);
                            break;
                    }
                    list.push({ x: _x, y: _y });
                }
            }
        }
        return list;
    };
    Piece.prototype.validateNextShapePositions = function (list) {
        for (var i = 0; i < list.length; i++) {
            var p = list[i];
            if (p.x < 0 || p.x > config.cols - 1)
                return false;
            if (p.y < 0 || p.y > config.rows - 1)
                return false;
            if (game.mat[p.x][p.y] != "")
                return false;
        }
        return true;
    };
    Piece.prototype.updatepPosition = function () {
        var nextPosition = this.getNextPosition();
        var nextShapePositions = this.getNextShapePositions(nextPosition);
        if (this.validateNextShapePositions(nextShapePositions)) {
            this.x = nextPosition.x;
            this.y = nextPosition.y;
            this.angle = nextPosition.angle;
            this.shape.positions = nextShapePositions;
        }
    };
    return Piece;
}());
//# sourceMappingURL=main.js.map