(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgTeamTeamsLeaderboard', vgTeamTeamsLeaderboard);

    /* @ngInject */
    function vgTeamTeamsLeaderboard() {
        var directive = {
            bindToController: true,
            controller: TeamTeamsLeaderboardController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/teamTeamsLeaderboard.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function TeamTeamsLeaderboardController($scope, eventService) {
        /* jshint validthis: true */
    	var vm = this;

    	$scope.$watchCollection(function() { return eventService.getTeamLeaderboardLengthValue(); }, function(model) {
            $scope.$parent.$parent.event.teamLeaderboardLength = model;
        }, true);

        $scope.$watchCollection(function() { return eventService.getTeamSummarizedLeaderboardObject(); }, function(model) {
            $scope.$parent.$parent.event.teamSummarizedLeaderboard = model;
        }, true);
    }
})();