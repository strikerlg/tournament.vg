(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController($scope, $timeout) {

        /* jshint validthis: true */
        var vm = this;

        activate();

        ////////////////////////

        function activate() {
            $timeout(function() {
                angular.element('#contentView')
                    .css('opacity', '1')
                    .css('position', 'inherit');
            }, 310);
        }

    }

})();