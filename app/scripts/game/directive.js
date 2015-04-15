(function() {
    'use strict';

    /**
     * @desc UI for a Conway's Game of Life implementation in Angular
     * @example <game-of-life game="vm.game" click-cell="vm.clickCell(cell)"></game-of-life>
     */
    angular
        .module('gameOfLife')
        .directive('gameOfLife', gameOfLife);

    function gameOfLife(Game) {
        var directive = {
            restrict: 'EA',
            scope: {
                game: '=',
                clickCell: '&'
            },
            templateUrl: 'views/game.html',
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            assertValidGame();
            initialize();

            function initialize() {
                scope.cells = _.toArray(
                    _.groupBy(scope.game.cells, function (cell) {
                        return cell.position.y;
                    })
                );
            }

            function assertValidGame() {
                if (!scope.game || !(scope.game instanceof Game)) {
                    throw 'Cannot initialize game of life, invalid game object provided';
                }
            }
        }
    }
})();
