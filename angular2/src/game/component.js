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
var patterns_1 = require('game/patterns');
var GameComponent = (function () {
    function GameComponent() {
        this.options = {
            embedded: false,
            noGrid: false,
            noFade: false,
            color: cell_1.Cell.defaultColor
        };
        this.defaultParams = {
            cols: 50,
            rows: 30,
            interval: 300
        };
        var urlParams = this.getUrlParams();
        var params = _.defaults(_.pick(urlParams, ['cols', 'rows', 'interval']), this.defaultParams);
        this.game = new game_1.Game(params.cols, params.rows, params.interval);
        this.cells = this.groupCellsByRow(this.game.cells);
        this.availablePatterns = patterns_1.Patterns.getAvailablePatterns();
        this.options = _.defaults(_.pick(urlParams, ['embedded', 'noGrid', 'noFade', 'color']), this.options);
        if (params.interval < 300) {
            this.options.noFade = true;
        }
        if (!!urlParams.pattern && _.contains(this.availablePatterns, urlParams.pattern)) {
            var colors = [this.options.color];
            if (urlParams.color2) {
                colors.push(urlParams.color2);
            }
            this.loadPattern(urlParams.pattern, colors);
        }
        if (!!urlParams.autostart) {
            this.game.start();
        }
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
    GameComponent.prototype.loadPattern = function (pattern, color) {
        patterns_1.Patterns.loadPattern(this.game, pattern, color);
    };
    GameComponent.prototype.groupCellsByRow = function (cells) {
        var groupedCells = _.groupBy(cells, function (cell) { return cell.position.y; });
        return _.toArray(groupedCells);
    };
    GameComponent.prototype.getUrlParams = function () {
        var queryString = location.search.length
            ? location.search.substr(1)
            : location.hash.split("?")[1];
        return _(queryString.split("&"))
            .groupBy(function (item) { return item.split("=")[0]; })
            .mapValues(function (values) { return decodeURIComponent(values[0].split("=")[1]); })
            .mapValues(function (value) { return value.replace("+", " "); })
            .mapValues(function (value) { return value == 'true' ? true : value; })
            .mapValues(function (value) { return value == 'false' ? false : value; })
            .value();
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
