(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgRulesDisplay', vgRulesDisplay);

    /* @ngInject */
    function vgRulesDisplay() {
        var directive = {
            bindToController: true,
            controller: RulesDisplayController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/rulesDisplay.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function RulesDisplayController($timeout) {
        /* jshint validthis: true */
    	var vm = this;

        // FIXME: This is a temporary hack. Initialize the Materialize.css dropdowns after the component is loaded.
        $timeout(function() {
            angular.element('.collapsible').collapsible({
                accordion: false
            });
        }, 600);
    }
})();