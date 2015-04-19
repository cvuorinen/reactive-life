(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl($scope, $location, Game, Patterns) {
        var vm = this;

        var options = {
            cols: 50,
            rows: 30,
            interval: 300
        };
        var urlParams = $location.search();

        angular.extend(options, urlParams);

        vm.game = new Game(
            options.cols,
            options.rows,
            options.interval,
            $scope
        );

        vm.reset = _.partial(Patterns.reset, vm.game);
        vm.loadPattern = _.partial(Patterns.loadPattern, vm.game);
        vm.availablePatterns = Patterns.getAvailablePatterns();
        vm.hideControls = urlParams.hideControls;
        vm.color = urlParams.color;

        if (!!urlParams.pattern && _.includes(vm.availablePatterns, urlParams.pattern)) {
            vm.loadPattern(urlParams.pattern, vm.color);
        }

        if (!!urlParams.autostart) {
            vm.game.start();
        }

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
