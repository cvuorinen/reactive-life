/// <reference path="../../typings/rx/rx.all.d.ts" />
//import {Rx} from 'rx';
/**
 * Class that represents one cell in a Game of Life. Holds all the game logic, listens to it's neighbours and
 * updates itself on each game "generation" according to the rules.
 */
var Cell = (function () {
    function Cell(position, generationStream, updateBroadcastStream) {
        this.position = position;
        this.generationStream = generationStream;
        this.updateBroadcastStream = updateBroadcastStream;
        this.alive = false;
        this.liveNeighbours = [];
        this.nextGenLiveNeighbours = [];
        this.generationStream
            .subscribe(this.updateCell.bind(this));
        this.updateBroadcastStream
            .filter(this.isNeighbour.bind(this))
            .subscribe(this.updateNeighbour.bind(this));
    }
    Cell.prototype.setAlive = function (color) {
        this.alive = true;
        this.color = color || Cell.defaultColor;
        this.updateBroadcastStream.onNext(this);
    };
    Cell.prototype.setDead = function () {
        this.alive = false;
        this.updateBroadcastStream.onNext(this);
    };
    Cell.prototype.isNeighbour = function (anotherCell) {
        return !this.position.equals(anotherCell.position)
            && isNeighbourPosition(anotherCell.position.x, this.position.x)
            && isNeighbourPosition(anotherCell.position.y, this.position.y);
        function isNeighbourPosition(pos1, pos2) {
            var diff = pos1 - pos2;
            return -1 <= diff && diff <= 1;
        }
    };
    Cell.prototype.updateNeighbour = function (neighbourCell) {
        if (neighbourCell.generation == this.generation) {
            updateNeighbourInArray(neighbourCell, this.liveNeighbours);
        }
        updateNeighbourInArray(neighbourCell, this.nextGenLiveNeighbours);
        function updateNeighbourInArray(neighbourCell, neighbourCellArray) {
            if (neighbourCell.alive) {
                neighbourCellArray.push(neighbourCell);
            }
            else {
                _.remove(neighbourCellArray, function (curCell) {
                    return curCell.position.equals(neighbourCell.position);
                });
            }
        }
    };
    /**
     * Update cell according to rules
     */
    Cell.prototype.updateCell = function (generation) {
        this.generation = generation;
        if (this.shouldDie()) {
            this.setDead();
        }
        else if (this.shouldComeAlive()) {
            this.setAlive(this.getDominantColor());
        }
        this.liveNeighbours = _.clone(this.nextGenLiveNeighbours);
    };
    Cell.prototype.shouldDie = function () {
        return this.alive && (this.liveNeighbours.length < 2 || this.liveNeighbours.length > 3);
    };
    Cell.prototype.shouldComeAlive = function () {
        return !this.alive && this.liveNeighbours.length == 3;
    };
    Cell.prototype.getDominantColor = function () {
        return Cell.defaultColor;
        /*let dominantColors = _(this.liveNeighbours)
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
            .first();*/
    };
    Cell.defaultColor = '#69f';
    return Cell;
})();
exports.Cell = Cell;
