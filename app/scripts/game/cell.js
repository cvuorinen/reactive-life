(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Cell', Cell);

    function Cell() {
        /**
         * @param {Position} position
         */
        var cell = function(position) {
            this.position = position;
            this.alive = false;
        }

        cell.prototype.setAlive = function () {
            this.alive = true;

            console.log('Cell.setAlive', this.alive);
        }

        cell.prototype.setDead = function () {
            this.alive = false;

            console.log('Cell.setDead', this.alive);
        }

        return cell;
    }
})();
