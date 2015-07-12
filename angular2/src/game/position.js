/**
 * Class that represents a position in a grid
 */
var Position = (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.prototype.equals = function (anotherPosition) {
        return anotherPosition.x == this.x && anotherPosition.y == this.y;
    };
    return Position;
})();
exports.Position = Position;
