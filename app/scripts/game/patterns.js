(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Patterns', Patterns);

    function Patterns(Position) {
        var patterns = {
            'Glider': ['3,4', '4,4', '5,4', '5,3', '4,2'],
            'Lightweight spaceship': ['3,2', '6,2', '7,3', '3,4', '7,4', '4,5', '5,5', '6,5', '7,5'],
            'Acorn': ['12,5', '14,6', '11,7', '12,7', '15,7', '16,7', '17,7'],
            'Die Hard': ['8,6', '9,6', '9,7', '14,5', '13,7', '14,7', '15,7'],
            'R-pentomino': ['6,6', '7,6', '7,7', '8,7', '7,8'],
            'Spinners': ['14,3', '13,4', '14,4', '15,4', '8,9', '7,10', '8,10', '8,11', '20,9', '20,10',
                '21,10', '20,11', '13,16', '14,16', '15,16', '14,17'],
            'Gosper glider gun': ['3,8', '4,8', '3,9', '4,9', '13,8', '13,9', '13,10', '14,7', '14,11',
                '15,6', '15,12', '16,6', '16,12', '17,9', '18,7', '18,11', '19,8', '19,9', '19,10', '20,9',
                '23,6', '23,7', '23,8', '24,6', '24,7', '24,8', '25,5', '25,9', '27,4', '27,5', '27,9',
                '27,10', '37,6', '37,7', '38,6', '38,7'],
            'Flat': ['5,10', '6,10', '7,10', '8,10', '9,10', '10,10', '11,10', '12,10', '14,10', '15,10',
                '16,10', '17,10', '18,10', '22,10', '23,10', '24,10', '31,10', '32,10', '33,10', '34,10',
                '35,10', '36,10', '37,10', '39,10', '40,10', '41,10', '42,10', '43,10'],
        };

        return {
            reset: reset,
            getAvailablePatterns: getAvailablePatterns,
            loadPattern: loadPattern
        };

        /**
         * @param {Game} game
         */
        function reset(game) {
            _(game.cells)
                .filter(function (cell) {
                    return cell.alive;
                }).map(function (cell) {
                    cell.setDead();
                })
                .value();
        }

        /**
         * @returns {Array}
         */
        function getAvailablePatterns() {
            return _.keys(patterns);
        }

        /**
         *
         * @param {Game}   game
         * @param {String} patternName
         */
        function loadPattern(game, patternName) {
            if (!patterns[patternName]) {
                return;
            }

            _(game.cells)
                .filter(function (cell) {
                    return !cell.alive && _.includes(
                        patterns[patternName],
                        cell.position.x + ',' + cell.position.y
                    );
                }).map(function (cell) {
                    cell.setAlive();
                })
                .value();
        }
    }
})();
