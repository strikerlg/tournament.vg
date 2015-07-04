(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('HeaderController', HeaderController);

    /* @ngInject */
    function HeaderController($timeout, $rootScope, $window, $state, authService) {

        /* jshint validthis: true */
        var vm = this;
        vm.logOut = logOut;

        activate();

        //////////////////////////

        function activate() {
            // FIXME: Materialize and AngularJS do not play nicely together. If the dropdown is
            //        initialized before all content has been rendered, the dropdown will not actually work.
            //        This is a messy hack for the time being, but revisit this later.
            $timeout(function() {
                angular.element('.dropdown-button')
                    .dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrain_width: false,
                        hover: false,
                        gutter: -114,
                        belowOrigin: true
                    });
            }, 400);

            $timeout(function() {
                angular.element('.dropdown-button')
                    .dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrain_width: false,
                        hover: false,
                        gutter: -114,
                        belowOrigin: true
                    });
            }, 1000);

            $timeout(function() {
                angular.element('.dropdown-button')
                    .dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrain_width: false,
                        hover: false,
                        gutter: -114,
                        belowOrigin: true
                    });
            }, 5000);
        }

        function logOut() {
            authService.logOut();
            $window.location.reload();
        }

    }
})();