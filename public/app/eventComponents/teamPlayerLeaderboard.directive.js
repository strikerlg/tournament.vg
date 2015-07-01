(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgTeamPlayerLeaderboard', vgTeamPlayerLeaderboard);

    /* @ngInject */
    function vgTeamPlayerLeaderboard() {
        var directive = {
            bindToController: true,
            controller: TeamPlayerLeaderboardController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/teamPlayerLeaderboard.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function TeamPlayerLeaderboardController($scope, eventService) {
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