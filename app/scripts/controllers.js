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
        vm.noGrid = urlParams.noGrid;
        vm.embedded = urlParams.embedded;
        vm.color = urlParams.color || '#69f';
        vm.spectrumOptions = getSpectrumOptions();

        if (!!urlParams.pattern && _.includes(vm.availablePatterns, urlParams.pattern)) {
            var colors = [vm.color];

            if (urlParams.color2) {
                colors.push(urlParams.color2);
            }

            vm.loadPattern(urlParams.pattern, colors);
        }

        if (!!urlParams.autostart) {
            vm.game.start();
        }

        $scope.$createObservableFunction('toggleCell')
            .subscribe(function (cell) {
                if (cell.alive) {
                    cell.setDead();
                } else {
                    cell.setAlive(vm.color);
                }
            });

        vm.clickCell = $scope.toggleCell;

        function getSpectrumOptions() {
            return {
                showPaletteOnly: true,
                hideAfterPaletteSelect: true,
                togglePaletteOnly: true,
                togglePaletteMoreText: 'more',
                togglePaletteLessText: 'less',
                clickoutFiresChange: true,
                //color: 'blanchedalmond',
                palette: [
                    ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                    ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                    ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                    ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                    ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6699ff","#8e7cc3","#c27ba0"],
                    ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                    ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                    ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                ]
            }
        }
    }
})();
