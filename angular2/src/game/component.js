if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __metadata !== "function") __metadata = function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var game_1 = require('game/game');
var cell_1 = require('game/cell');
var GameComponent = (function () {
    function GameComponent() {
        this.embedded = false;
        this.defaultOptions = {
            cols: 50,
            rows: 30,
            interval: 300
        };
        this.game = new game_1.Game(this.defaultOptions.cols, this.defaultOptions.rows, this.defaultOptions.interval);
        this.cells = this.groupCellsByRow(this.game.cells);
    }
    GameComponent.prototype.reset = function () {
        _(this.game.cells)
            .filter(function (cell) { return cell.alive; })
            .map(function (cell) { return cell.setDead(); })
            .value();
    };
    GameComponent.prototype.clickCell = function (cell) {
        if (cell.alive) {
            cell.setDead();
        }
        else {
            cell.setAlive(cell_1.Cell.defaultColor);
        }
    };
    GameComponent.prototype.groupCellsByRow = function (cells) {
        var groupedCells = _.groupBy(cells, function (cell) { return cell.position.y; });
        return _.toArray(groupedCells);
    };
    GameComponent = __decorate([
        angular2_1.Component({
            selector: 'game-of-life'
        }),
        angular2_1.View({
            templateUrl: 'src/game/game.html',
            directives: [angular2_1.NgFor, angular2_1.NgIf, angular2_1.CSSClass]
        }), 
        __metadata('design:paramtypes', [])
    ], GameComponent);
    return GameComponent;
})();
exports.GameComponent = GameComponent;
