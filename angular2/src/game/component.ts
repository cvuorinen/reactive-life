import {Component, View, NgFor, NgIf, CSSClass} from 'angular2/angular2';

import {Game} from 'game/game';
import {Cell} from 'game/cell';
import {Patterns} from 'game/patterns';

@Component({
    selector: 'game-of-life'
})
@View({
    templateUrl: 'src/game/game.html',
    directives: [NgFor, NgIf, CSSClass]
})
export class GameComponent {
    public cells: Array<Array<Cell>>;
    public embedded: boolean = false;
    public game: Game;
    public availablePatterns: Array<string>;

    private defaultOptions = {
        cols: 50,
        rows: 30,
        interval: 300
    };

    constructor() {
        this.game = new Game(
            this.defaultOptions.cols,
            this.defaultOptions.rows,
            this.defaultOptions.interval
        );

        this.cells = this.groupCellsByRow(this.game.cells);

        this.availablePatterns = Patterns.getAvailablePatterns();
    }

    public reset() {
        _(this.game.cells)
            .filter(cell => cell.alive)
            .map(cell => cell.setDead())
            .value();
    }

    public clickCell(cell: Cell) {
        if (cell.alive) {
            cell.setDead();
        } else {
            cell.setAlive(Cell.defaultColor);
        }
    }

    public loadPattern(pattern: string) {
        Patterns.loadPattern(this.game, pattern, [Cell.defaultColor]);
    }

    private groupCellsByRow(cells: Array<Cell>): Array<Array<Cell>> {
        let groupedCells = _.groupBy(cells, cell => cell.position.y);

        return _.toArray(groupedCells);
    }
}
