(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgMultiGameLeaderboard', vgMultiGameLeaderboard);

    /* @ngInject */
    function vgMultiGameLeaderboard () {
        var directive = {
            bindToController: true,
            controller: MultiGameLeaderboardController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/multiGameLeaderboard.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function MultiGameLeaderboardController($scope, eventService) {
        /* jshint validthis: true */
    	var vm = this;

        $scope.$watch(function() { return eventService.getLeaderboardLengthValue(); }, function(model) {
            $scope.$parent.$parent.event.leaderboardLength = model;
        }, true);

        $scope.$watch(function() { return eventService.getSummarizedLeaderboardObject(); }, function(model) {
            $scope.$parent.$parent.event.summarizedLeaderboard = model;
        }, true);
    }
})();