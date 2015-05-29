(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgGamesList', vgGamesList);

    /* @ngInject */
    function vgGamesList () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: GamesListController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/gamesList.directive.htm',
            scope: {
            	data: '=',
            	openGameFunction: '='
            }
        };
        return directive;
    }

    /* @ngInject */
    function GamesListController() {
        /* jshint validthis: true */
    	var vm = this;
    }
})();