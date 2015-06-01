(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgSingleGameLeaderboard', vgSingleGameLeaderboard);

    /* @ngInject */
    function vgSingleGameLeaderboard () {
        var directive = {
            bindToController: true,
            controller: SingleGameLeaderboardController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/singleGameLeaderboard.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function SingleGameLeaderboardController($scope, eventService) {
        /* jshint validthis: true */
    	var vm = this;

        $scope.$watchCollection(function() { return eventService.getLeaderboardLengthValue(); }, function(model) {
            $scope.$parent.$parent.event.leaderboardLength = model;
        }, true);

        $scope.$watchCollection(function() { return eventService.getSummarizedLeaderboardObject(); }, function(model) {
            $scope.$parent.$parent.event.summarizedLeaderboard = model;
        }, true);
    }
})();