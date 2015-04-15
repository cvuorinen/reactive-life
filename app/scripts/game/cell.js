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
        var cell = function(position, generationStream, updateBroadcastStream) {
            this.position = position;
            this.alive = false;
            this.generation;

            var self = this;
            var liveNeighbours = [];
            var nextGenLiveNeighbours = [];

            generationStream.subscribe(function (generation) {
                self.update(generation);
            });

            updateBroadcastStream.subscribe(function (updatedCell) {
                if (self.isNeighbour(updatedCell)) {
                    self.updateNeighbour(updatedCell);
                }
            });

            /**
             * @returns {boolean}
             */
            this.shouldDie = function () {
                return self.alive && (liveNeighbours.length < 2 || liveNeighbours.length > 3);
            }

            /**
             * @returns {boolean}
             */
            this.shouldComeAlive = function () {
                return !self.alive && liveNeighbours.length == 3;
            }

            /**
             * @param {Cell} anotherCell
             * @returns {boolean}
             */
            this.isNeighbour = function (anotherCell) {
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
            this.updateNeighbour = function (neighbourCell) {
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

            this.setAlive = function () {
                self.alive = true;
                updateBroadcastStream.onNext(self);
            }

            this.setDead = function () {
                self.alive = false;
                updateBroadcastStream.onNext(self);
            }

            /**
             * Update cell according to rules
             */
            this.update = function (generation) {
                self.generation = generation;

                if (self.shouldDie()) {
                    self.setDead();
                } else if (self.shouldComeAlive()) {
                    self.setAlive();
                }

                liveNeighbours = nextGenLiveNeighbours.slice(0);
            }
        }

        return cell;
    }
})();
