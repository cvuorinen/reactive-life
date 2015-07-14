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
    public options: {
        embedded: boolean,
        noGrid: boolean,
        noFade: boolean,
        color: string
    } = {
        embedded: false,
        noGrid: false,
        noFade: false,
        color: Cell.defaultColor
    };
    public game: Game;
    public availablePatterns: Array<string>;

    private defaultParams = {
        cols: 50,
        rows: 30,
        interval: 300
    };

    constructor() {
        let urlParams: {
            cols?: number,
            rows?: number,
            interval?: number,
            pattern?: string,
            color?: string,
            color2?: string,
            autostart?: boolean,
            embedded?: boolean,
            noGrid?: boolean,
            noFade?: boolean
        } = this.getUrlParams();

        let params = _.defaults(
            _.pick(urlParams, ['cols', 'rows', 'interval']),
            this.defaultParams
        );

        this.game = new Game(
            params.cols,
            params.rows,
            params.interval
        );

        this.cells = this.groupCellsByRow(this.game.cells);
        this.availablePatterns = Patterns.getAvailablePatterns();

        this.options = _.defaults(
            _.pick(urlParams, ['embedded', 'noGrid', 'noFade', 'color']),
            this.options
        );

        if (params.interval < 300) {
            this.options.noFade = true;
        }

        if (!!urlParams.pattern && _.contains(this.availablePatterns, urlParams.pattern)) {
            let colors = [this.options.color];

            if (urlParams.color2) {
                colors.push(urlParams.color2);
            }

            this.loadPattern(urlParams.pattern, colors);
        }

        if (!!urlParams.autostart) {
            this.game.start();
        }
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

    public loadPattern(pattern: string, color: Array<string>) {
        Patterns.loadPattern(this.game, pattern, color);
    }

    private groupCellsByRow(cells: Array<Cell>): Array<Array<Cell>> {
        let groupedCells = _.groupBy(cells, cell => cell.position.y);

        return _.toArray(groupedCells);
    }

    private getUrlParams(): Object {
        let queryString = location.search.length
            ? location.search.substr(1)
            : location.hash.split("?")[1];

        return _(queryString.split("&"))
            .groupBy(item => item.split("=")[0])
            .mapValues(values => decodeURIComponent(values[0].split("=")[1]))
            .mapValues(value => value.replace("+", " "))
            .mapValues(value => value == 'true' ? true : value)
            .mapValues(value => value == 'false' ? false : value)
            .value();
    }
}
