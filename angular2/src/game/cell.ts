/// <reference path="../../typings/rx/rx.all.d.ts" />
//import {Rx} from 'rx.all';

import {Position} from 'game/position';

/**
 * Class that represents one cell in a Game of Life. Holds all the game logic, listens to it's neighbours and
 * updates itself on each game "generation" according to the rules.
 */
export class Cell {
    static defaultColor: string = '#69f';

    public position: Position;
    public alive: boolean = false;
    public generation: number;
    public color: string;

    private liveNeighbours: Array<Cell> = [];
    private nextGenLiveNeighbours: Array<Cell> = [];

    constructor(
        public position: Position,
        private generationStream: Rx.Observable,
        private updateBroadcastStream: Rx.Subject
    ) {
        this.generationStream
            .subscribe(this.updateCell.bind(this));

        this.updateBroadcastStream
            .filter(this.isNeighbour.bind(this))
            .subscribe(this.updateNeighbour.bind(this));
    }

    public setAlive(color: string) {
        this.alive = true;
        this.color = color || Cell.defaultColor;

        this.updateBroadcastStream.onNext(this);
    }

    public setDead() {
        this.alive = false;

        this.updateBroadcastStream.onNext(this);
    }

    private isNeighbour(anotherCell: Cell): boolean {
        return !this.position.equals(anotherCell.position)
            && isNeighbourPosition(anotherCell.position.x, this.position.x)
            && isNeighbourPosition(anotherCell.position.y, this.position.y);

        function isNeighbourPosition(pos1, pos2) {
            var diff = pos1 - pos2;

            return -1 <= diff && diff <= 1;
        }
    }

    private updateNeighbour(neighbourCell: Cell) {
        if (neighbourCell.generation == this.generation) {
            updateNeighbourInArray(neighbourCell, this.liveNeighbours);
        }

        updateNeighbourInArray(neighbourCell, this.nextGenLiveNeighbours);

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
    private updateCell(generation: number) {
        this.generation = generation;

        if (this.shouldDie()) {
            this.setDead();
        } else if (this.shouldComeAlive()) {
            this.setAlive(
                this.getDominantColor()
            );
        }

        this.liveNeighbours = _.clone(this.nextGenLiveNeighbours);
    }

    private shouldDie(): boolean {
        return this.alive && (this.liveNeighbours.length < 2 || this.liveNeighbours.length > 3);
    }

    private shouldComeAlive(): boolean {
        return !this.alive && this.liveNeighbours.length == 3;
    }

    private getDominantColor(): string {
        let dominantColors = _(this.liveNeighbours)
            .countBy('color')
            .invert()
            .groupBy(function (color, count) {
                return count;
            })
            .toArray()
            .last();

        // randomize if more than one
        return _.sample(dominantColors);
    }
}
