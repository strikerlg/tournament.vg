(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgStickyMessage', vgStickyMessage);

    /* @ngInject */
    function vgStickyMessage () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: StickyMessageController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/stickyMessage.directive.htm',
            scope: {
            	properties: '='
            }
        };
        return directive;
    }

    /* @ngInject */
    function StickyMessageController($timeout) {
        /* jshint validthis: true */
    	var vm = this;
    }
})();