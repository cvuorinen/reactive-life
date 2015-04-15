(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl($scope, Game, Patterns) {
        var vm = this;

        vm.game = new Game(50, 30, 300, $scope);
        vm.reset = _.partial(Patterns.reset, vm.game);
        vm.loadPattern = _.partial(Patterns.loadPattern, vm.game);
        vm.availablePatterns = Patterns.getAvailablePatterns();

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
