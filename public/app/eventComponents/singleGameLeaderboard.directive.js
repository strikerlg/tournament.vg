(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgSingleGameLeaderboard', vgSingleGameLeaderboard);

    /* @ngInject */
    function vgSingleGameLeaderboard () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: SingleGameLeaderboardController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/singleGameLeaderboard.directive.htm',
            scope: {
            	data: '=',
                avatarData: '=',
            	completeLength: '=',
                openLeaderboardFunction: '='
            }
        };
        return directive;
    }

    /* @ngInject */
    function SingleGameLeaderboardController() {
        /* jshint validthis: true */
    	var vm = this;
    }
})();