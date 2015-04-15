(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Position', Position);

    function Position() {
        /**
         * @param {integer} x
         * @param {integer} y
         */
        var position = function(x, y) {
            this.x = x;
            this.y = y;
        }

        /**
         * @param {Position} anotherPosition
         * @returns {boolean}
         */
        position.prototype.equals = function (anotherPosition) {
            return anotherPosition.x == this.x && anotherPosition.y == this.y;
        }

        return position;
    }
})();
