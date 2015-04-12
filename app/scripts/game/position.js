(function() {
    'use strict';

    angular
        .module('gameOfLife')
        .factory('Position', Position);

    function Position() {
        var position = function(x, y) {
            this.x = x;
            this.y = y;
        }

        return position;
    }
})();
