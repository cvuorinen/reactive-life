/**
 * Utility service used to load predefined patterns to the Game of Life
 */
var Patterns = (function () {
    function Patterns() {
    }
    Patterns.getAvailablePatterns = function () {
        return _.keys(Patterns.patterns);
    };
    Patterns.loadPattern = function (game, patternName, colors) {
        if (!Patterns.patterns[patternName]) {
            return;
        }
        _(game.cells)
            .filter(function (cell) { return !cell.alive && cellInPattern(cell); })
            .map(function (cell) { return cell.setAlive(_.sample(colors)); })
            .value();
        function cellInPattern(cell) {
            return _.contains(Patterns.patterns[patternName], cell.position.x + ',' + cell.position.y);
        }
    };
    Patterns.patterns = {
        'Glider': ['3,4', '4,4', '5,4', '5,3', '4,2'],
        'Spaceship': ['3,2', '6,2', '7,3', '3,4', '7,4', '4,5', '5,5', '6,5', '7,5'],
        'Acorn': ['11,7', '12,7', '13,7', '16,7', '17,7', '14,8', '16,9'],
        'Die Hard': ['8,6', '9,6', '9,7', '14,5', '13,7', '14,7', '15,7'],
        'R-pentomino': ['6,6', '7,6', '7,7', '8,7', '7,8'],
        'Spinners': ['14,3', '13,4', '14,4', '15,4', '8,9', '7,10', '8,10', '8,11', '20,9', '20,10',
            '21,10', '20,11', '13,16', '14,16', '15,16', '14,17'],
        'Gosper gun': ['3,8', '4,8', '3,9', '4,9', '13,8', '13,9', '13,10', '14,7', '14,11',
            '15,6', '15,12', '16,6', '16,12', '17,9', '18,7', '18,11', '19,8', '19,9', '19,10', '20,9',
            '23,6', '23,7', '23,8', '24,6', '24,7', '24,8', '25,5', '25,9', '27,4', '27,5', '27,9',
            '27,10', '37,6', '37,7', '38,6', '38,7'],
        'Flat': ['5,10', '6,10', '7,10', '8,10', '9,10', '10,10', '11,10', '12,10', '14,10', '15,10',
            '16,10', '17,10', '18,10', '22,10', '23,10', '24,10', '31,10', '32,10', '33,10', '34,10',
            '35,10', '36,10', '37,10', '39,10', '40,10', '41,10', '42,10', '43,10'],
    };
    return Patterns;
})();
exports.Patterns = Patterns;
