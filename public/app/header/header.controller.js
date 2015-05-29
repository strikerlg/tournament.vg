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
        }

        function logOut() {
            authService.logOut();
            $window.location.reload();
        }

    }
})();