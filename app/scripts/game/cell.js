(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Cell', Cell);

    /**
     * Class that represents one cell in a Game of Life. Holds all the game logic, listens to it's neighbours and
     * updates itself on each game "generation" according to the rules.
     */
    function Cell(Position) {
        /**
         * @param {Position} position
         * @param {Rx.Observable} generationStream
         * @param {Rx.Subject} updateBroadcastStream
         */
        var Cell = function(position, generationStream, updateBroadcastStream) {
            this.position = position;
            this.alive = false;
            this.generation;
            this.color;

            var self = this;
            var liveNeighbours = [];
            var nextGenLiveNeighbours = [];
            var defaultColor = '#69f';

            generationStream
                .subscribe(updateCell);

            updateBroadcastStream
                .filter(isNeighbour)
                .subscribe(updateNeighbour);

            /**
             * @param {Cell} anotherCell
             * @returns {boolean}
             */
            function isNeighbour(anotherCell) {
                return !self.position.equals(anotherCell.position)
                    && isNeighbourPosition(anotherCell.position.x, self.position.x)
                    && isNeighbourPosition(anotherCell.position.y, self.position.y);

                function isNeighbourPosition(pos1, pos2) {
                    var diff = pos1 - pos2;

                    return -1 <= diff && diff <= 1;
                }
            }

            /**
             * @param {Cell} neighbourCell
             */
            function updateNeighbour(neighbourCell) {
                if (neighbourCell.generation == self.generation) {
                    updateNeighbourInArray(neighbourCell, liveNeighbours);
                }

                updateNeighbourInArray(neighbourCell, nextGenLiveNeighbours);

                function updateNeighbourInArray(neighbourCell, neighbourCellArray) {
                    if (neighbourCell.alive) {
                        neighbourCellArray.push(neighbourCell);
                    } else {
                        _.remove(neighbourCellArray, function (curCell) {
                            return curCell.position.equals(neighbourCell.position);
                        });
                    }
                }
            }

            /**
             * Update cell according to rules
             */
            function updateCell(generation) {
                self.generation = generation;

                if (shouldDie()) {
                    self.setDead();
                } else if (shouldComeAlive()) {
                    self.setAlive(
                        getDominantColor()
                    );
                }

                liveNeighbours = _.clone(nextGenLiveNeighbours);
            }

            /**
             * @returns {boolean}
             */
            function shouldDie() {
                return self.alive && (liveNeighbours.length < 2 || liveNeighbours.length > 3);
            }

            /**
             * @returns {boolean}
             */
            function shouldComeAlive() {
                return !self.alive && liveNeighbours.length == 3;
            }

            /**
             * @returns {String}
             */
            function getDominantColor() {
                var dominantColors = _(liveNeighbours)
                    .countBy('color')
                    .invert()
                    .groupBy(function (color, count) {
                        return count;
                    })
                    .toArray()
                    .last();

                // randomize if more than one
                return _(dominantColors)
                    .shuffle()
                    .first();
            }

            /**
             * @param {String} color
             */
            this.setAlive = function (color) {
                self.alive = true;
                self.color = color || defaultColor;

                updateBroadcastStream.onNext(self);
            }

            this.setDead = function () {
                self.alive = false;

                updateBroadcastStream.onNext(self);
            }
        }

        return Cell;
    }
})();
