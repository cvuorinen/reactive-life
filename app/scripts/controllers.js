(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl($scope, Game) {
        var vm = this;

        vm.game = new Game(20, 15);

        $scope.$createObservableFunction('toggleCell')
            .subscribe(function (cell) {
                if (cell.alive) {
                    cell.setDead();
                } else {
                    cell.setAlive();
                }
            });

        vm.clickCell = $scope.toggleCell;
    }
})();