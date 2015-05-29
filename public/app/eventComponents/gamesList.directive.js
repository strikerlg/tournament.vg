(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgGamesList', vgGamesList);

    /* @ngInject */
    function vgGamesList () {
        var directive = {
            bindToController: true,
            controller: GamesListController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/gamesList.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function GamesListController($scope, eventService) {
        /* jshint validthis: true */
    	var vm = this;

        $scope.$watch(function() { return eventService.getGameListObject(); }, function(model) {
            $scope.$parent.$parent.event.gameList = model;
        }, true);
    }
})();