/// <reference path="../../typings/rx/rx.all.d.ts" />
//import {Rx} from 'rx';
var cell_1 = require('game/cell');
var position_1 = require('game/position');
/**
 * An implementation of Conway's Game of Life using reactive programming
 */
var Game = (function () {
    function Game(cols, rows, interval) {
        var _this = this;
        this.cols = cols;
        this.rows = rows;
        this.generation = 0;
        this.started = false;
        // Create a stream that "ticks" every interval to trigger a new "generation" in the game
        var generation = Rx.Observable
            .interval(interval);
        // Publish to be able to broadcast a single stream to multiple subscribers
        var generationStream = generation
            .publish();
        generationStream.connect();
        // Change the generation stream to pausable and pause initially
        this.generationStream = generationStream.pausable();
        this.generationStream.pause();
        this.generationStream
            .subscribe(function (_) { return _this.nextGeneration(); });
        // Create a Subject stream for cells to broadcast when they update.
        // Subject allows for both publish and subscribe, so cells can also subscribe
        // to get notified about updates to neighbour cells.
        this.updateBroadcastStream = new Rx.Subject();
        this.cells = this.createCells(0, 0, []);
    }
    Game.prototype.start = function () {
        this.started = true;
        this.generationStream.resume();
    };
    Game.prototype.pause = function () {
        this.started = false;
        this.generationStream.pause();
    };
    Game.prototype.nextGeneration = function () {
        this.generation++;
    };
    Game.prototype.createCells = function (x, y, cells) {
        if (x == this.cols) {
            x = 0;
            y++;
        }
        if (y == this.rows) {
            return cells;
        }
        cells.push(new cell_1.Cell(new position_1.Position(x, y), this.generationStream, this.updateBroadcastStream));
        x++;
        return this.createCells(x, y, cells);
    };
    return Game;
})();
exports.Game = Game;
