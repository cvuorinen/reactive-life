(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl(Game) {
        var vm = this;

        vm.game = new Game(20, 15);
    }
})();