(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Position', Position);

    /**
     * Class that represents a position in a grid
     */
    function Position() {
        /**
         * @param {integer} x
         * @param {integer} y
         */
        var Position = function(x, y) {
            this.x = x;
            this.y = y;
        }

        /**
         * @param {Position} anotherPosition
         * @returns {boolean}
         */
        Position.prototype.equals = function (anotherPosition) {
            return anotherPosition.x == this.x && anotherPosition.y == this.y;
        }

        return Position;
    }
})();
