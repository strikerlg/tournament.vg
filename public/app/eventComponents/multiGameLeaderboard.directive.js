(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgMultiGameLeaderboard', vgMultiGameLeaderboard);

    /* @ngInject */
    function vgMultiGameLeaderboard () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: MultiGameLeaderboardController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: './app/eventComponents/multiGameLeaderboard.directive.htm',
            scope: {
            	data: '=',
                avatarData: '=',
            	completeLength: '=',
            	openPlayerFunction: '=',
                openLeaderboardFunction: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function MultiGameLeaderboardController() {
        /* jshint validthis: true */
    	var vm = this;
    }
})();