(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Game', Game);

    /**
     * An implementation of Conway's Game of Life using reactive programming
     */
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

            generationStream.subscribe(nextGeneration);

            // Create a Subject stream for cells to broadcast when they update.
            // Subject allows for both publish and subscribe, so cells can also subscribe
            // to get notified about updates to neighbour cells.
            var updateBroadcastStream = new Rx.Subject();

            this.cells = createCells(0, 0, []);

            this.start = function () {
                self.started = true;
                generationStream.resume();
            }

            this.pause = function () {
                self.started = false;
                generationStream.pause();
            }

            function nextGeneration() {
                self.generation++;
            }

            /**
             * @param {integer} x
             * @param {integer} y
             * @param {Array}   cells
             * @returns {Array}
             */
            function createCells(x, y, cells) {
                if (x == cols) {
                    x = 0;
                    y++;
                }

                if (y == rows) {
                    return cells;
                }

                cells.push(
                    new Cell(
                        new Position(x, y),
                        generationStream,
                        updateBroadcastStream
                    )
                );

                x++;

                return createCells(x, y, cells);
            }
        }

        return Game;
    }
})();
