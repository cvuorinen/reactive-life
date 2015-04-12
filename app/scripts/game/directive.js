(function() {
    'use strict';

    /**
     * @desc Conway's game of life
     * @example <game-of-life game="vm.game"></game-of-life>
     */
    angular
        .module('gameOfLife')
        .directive('gameOfLife', gameOfLife);

    function gameOfLife(Game) {
        var directive = {
            restrict: 'EA',
            scope: {
                game: '=',
            },
            templateUrl: 'views/game.html',
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            assertValidGame();
            initialize();

            function initialize() {

            }

            function assertValidGame() {
                if (!scope.game || !(scope.game instanceof Game)) {
                    throw 'Cannot initialize game of life, invalid game object provided';
                }
            }
        }
    }
})();