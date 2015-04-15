(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Game', Game);

    function Game(Cell, Position) {
        /**
         * @param {integer} cols
         * @param {integer} rows
         * @param {integer} interval
         * @param {{*}}     scope
         */
        var Game = function(cols, rows, interval, scope) {
            this.generation = 0;
            this.started = false;

            var self = this;

            // Create a stream that "ticks" every interval to trigger a new "generation" in the game
            var generation = Rx.Observable
                .interval(interval)
                .safeApply(scope, function () {
                    // just to trigger Angular digest cycle on each interval
                });

            // Publish to be able to broadcast a single stream to multiple subscribers
            var generationStream = generation
                .publish();
            generationStream.connect();

            // Change the generation stream to pausable and pause initially
            generationStream = generationStream.pausable();
            generationStream.pause();

            generationStream.subscribe(updateGeneration);

            // Create a Subject stream for cells to broadcast when they update.
            // Subject allows for both publish and subscribe, so cells can also subscribe
            // to get notified about updates to neighbour cells.
            var updateBroadcastStream = new Rx.Subject();

            this.cells = initCells(cols, rows);

            this.start = function () {
                self.started = true;
                generationStream.resume();
            }

            this.pause = function () {
                self.started = false;
                generationStream.pause();
            }

            function updateGeneration() {
                self.generation++;
            }

            /**
             * @param {integer} colNum
             * @param {integer} rowNum
             * @returns {Array}
             */
            function initCells(colNum, rowNum) {
                var rows = [];

                for (var y = 0; y < rowNum; y++) {
                    rows.push(
                        createCellRow(colNum, y)
                    );
                }

                return rows;
            }

            /**
             * @param {integer} colNum
             * @param {integer} y
             * @returns {Array}
             */
            function createCellRow(colNum, y) {
                var cols = [];

                for (var x = 0; x < colNum; x++) {
                    var cell = new Cell(
                        new Position(x, y),
                        generationStream,
                        updateBroadcastStream
                    );

                    cols.push(cell);
                }

                return cols;
            }
        }

        return Game;
    }
})();
