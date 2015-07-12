import {Component, View, NgFor, CSSClass} from 'angular2/angular2';

import {Game} from 'game/game';
import {Cell} from 'game/cell';

@Component({
    selector: 'game-of-life'
})
@View({
    templateUrl: 'src/game/game.html',
    directives: [NgFor, CSSClass]
})
export class GameComponent {
    cells: Array<Array<Cell>>;
    game: Game;

    constructor() {
        this.game = new Game(3, 4, 300);
        this.cells = this.groupCellsByRow(this.game.cells);
    }

    public clickCell(cell: Cell) {
        if (cell.alive) {
            cell.setDead();
        } else {
            cell.setAlive(Cell.defaultColor);
        }
    }

    private groupCellsByRow(cells: Array<Cell>): Array<Array<Cell>> {
        return _.toArray(
            _.groupBy(cells, function (cell) {
                return cell.position.y;
            })
        );
    }
}
