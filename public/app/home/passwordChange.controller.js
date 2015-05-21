(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('PasswordChangeController', PasswordChangeController);

    /* @ngInject */
    function PasswordChangeController($scope, $timeout, $state, AuthWrapper) {

        var vm = this;

        $timeout(function() {
        	angular.element('#contentView')
                .css('opacity', '1')
                .css('position', 'inherit');
        }, 310);

        vm.submitChangePassword = submitChangePassword;

        //////////////////

        function submitChangePassword() {

            if ($scope.pwChangeForm.$valid) {

                AuthWrapper.$changePassword({
                    email: AuthWrapper.$getAuth().password.email,
                    oldPassword: vm.inputCurrentPassword,
                    newPassword: vm.inputNewPassword
                }).then(function() {

                    Materialize.toast('Your password was changed.', 4000);
                    $timeout(function() {
                        $state.go('index');
                    }, 1000);

                }).catch(function(error) {
                    
                    if (error.code === 'INVALID_PASSWORD') {
                        vm.showChangePasswordMessage = true;
                    }

                });

            }

        };

    }

})();