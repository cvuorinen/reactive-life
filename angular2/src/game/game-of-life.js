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
var GameComponent = (function () {
    function GameComponent() {
        //this.cells = gameService.cells;
        this.cells = [["foo", "bar", "bar", "bar", "bar", "bar"], ["foo", "bar", "bar", "bar", "bar", "bar"], ["foo", "bar", "bar", "bar", "bar", "bar"], ["foo", "bar", "bar", "bar", "bar", "bar"], ["foo", "bar", "bar", "bar", "bar", "bar"], ["foo", "bar", "bar", "bar", "bar", "bar"]];
    }
    GameComponent = __decorate([
        angular2_1.Component({
            selector: 'game-of-life' /*,
            appInjector: [GameService]*/
        }),
        angular2_1.View({
            templateUrl: 'src/game/game.html',
            directives: [angular2_1.NgFor]
        }), 
        __metadata('design:paramtypes', [])
    ], GameComponent);
    return GameComponent;
})();
exports.GameComponent = GameComponent;
/**
 * An implementation of Conway's Game of Life using reactive programming
 */
var GameService = (function () {
    function GameService() {
        this.cells = [["foo", "bar"], ["foo", "baz"]];
    }
    return GameService;
})();
