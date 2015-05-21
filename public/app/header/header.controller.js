(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('HeaderController', HeaderController);

    /* @ngInject */
    function HeaderController($timeout, $rootScope, $window, $state, authService) {

        $timeout(function() {
            angular.element('.dropdown-button')
                .dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    constrain_width: false, // Does not change width of dropdown to that of the activator
                    hover: false, // Activate on hover
                    gutter: -114, // Spacing from edge
                    belowOrigin: true // Displays dropdown below the button
                });
        }, 400);

        var vm = this;
        vm.headerType = $state.current.views.header.data.headerType;

        vm.logOut = logOut;

        //////////////////////////

        function logOut() {
            authService.logOut();
            $window.location.reload();
        }

    }
})();