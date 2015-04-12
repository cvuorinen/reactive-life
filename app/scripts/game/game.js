(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Game', Game);

    function Game(Cell, Position) {
        /**
         * @param {integer} width
         * @param {integer} height
         */
        var Game = function(width, height) {
            this.width = width;
            this.height = height;
            this.cells = initCells(width, height);

            console.log('Game', this);
        }

        return Game;

        /**
         * @param {integer} width
         * @param {integer} height
         * @returns {Array}
         */
        function initCells(width, height) {
            var rows = [];

            for (var y = 0; y < height; y++) {
                rows.push(
                    createCellRow(width, y)
                );
            }

            return rows;
        }

        /**
         * @param {integer} width
         * @param {integer} y
         * @returns {Array}
         */
        function createCellRow(width, y) {
            var cols = [];

            for (var x = 0; x < width; x++) {
                var cell = new Cell(
                    new Position(x, y)
                );

                cols.push(cell);
            }

            return cols;
        }
    }
})();
