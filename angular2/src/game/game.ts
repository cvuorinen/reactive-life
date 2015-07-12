/// <reference path="../../typings/rx/rx.all.d.ts" />
//import {Rx} from 'rx';

import {Cell} from 'game/cell';
import {Position} from 'game/position';

/**
 * An implementation of Conway's Game of Life using reactive programming
 */
export class Game {
    public cells: Array<Cell>;

    private generation: number = 0;
    private started: boolean = false;
    private generationStream: Rx.PausableObservable;
    private updateBroadcastStream: Rx.Subject;

    constructor(private cols: number, private rows: number, private interval: number) {
        /*this.generation = 0;
        this.started = false;*/
console.debug("Game.constructor", Rx.Observable);
        // Create a stream that "ticks" every interval to trigger a new "generation" in the game
        let generation = Rx.Observable
            .interval(interval)
            /*.safeApply(scope, function () {
                // just to trigger Angular digest cycle on each interval
            })*/;

        // Publish to be able to broadcast a single stream to multiple subscribers
        let generationStream = generation
            .publish();
        generationStream.connect();

        // Change the generation stream to pausable and pause initially
        this.generationStream = generationStream.pausable();
        this.generationStream.pause();

        this.generationStream.subscribe(this.nextGeneration);

        // Create a Subject stream for cells to broadcast when they update.
        // Subject allows for both publish and subscribe, so cells can also subscribe
        // to get notified about updates to neighbour cells.
        this.updateBroadcastStream = new Rx.Subject();

        this.cells = this.createCells(0, 0, []);
        console.debug("cells", this.cells);
    }

    public start() {
        this.started = true;
        this.generationStream.resume();
    }

    public pause() {
        this.started = false;
        this.generationStream.pause();
    }

    private nextGeneration() {
        this.generation++;
    }

    private createCells(x: number, y: number, cells: Array<Cell>): Array<Cell> {
        if (x == this.cols) {
            x = 0;
            y++;
        }

        if (y == this.rows) {
            return cells;
        }

        cells.push(
            new Cell(
                new Position(x, y),
                this.generationStream,
                this.updateBroadcastStream
            )
        );

        x++;

        return this.createCells(x, y, cells);
    }
}
