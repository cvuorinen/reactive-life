(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Cell', Cell);

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

            var self = this;
            var liveNeighbours = [];
            var nextGenLiveNeighbours = [];

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
                if (neighbourCell.alive) {
                    if (neighbourCell.generation == self.generation) {
                        liveNeighbours.push(neighbourCell);
                    }

                    nextGenLiveNeighbours.push(neighbourCell);
                } else {
                    if (neighbourCell.generation == self.generation) {
                        _.remove(liveNeighbours, function (curCell) {
                            return curCell.position.equals(neighbourCell.position);
                        });
                    }

                    _.remove(nextGenLiveNeighbours, function (curCell) {
                        return curCell.position.equals(neighbourCell.position);
                    });
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
                    self.setAlive();
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

            this.setAlive = function () {
                self.alive = true;
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
