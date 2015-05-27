(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('ChangePasswordController', ChangePasswordController);

    /* @ngInject */
    function ChangePasswordController($scope, $timeout, $state, AuthWrapper) {

        /* jshint validthis: true */
        var vm = this;
        
        vm.submitChangePassword = submitChangePassword;

        activate();

        //////////////////

        function activate() {
            $timeout(function() {
                angular.element('#contentView')
                    .css('opacity', '1')
                    .css('position', 'inherit');
            }, 310);
        }

        function submitChangePassword() {

            if ($scope.pwChangeForm.$valid) {

                AuthWrapper.$changePassword({
                    email: AuthWrapper.$getAuth().password.email,
                    oldPassword: vm.inputCurrentPassword,
                    newPassword: vm.inputNewPassword
                }).then(function() {

                    Materialize.toast('Your password was changed.', 4000);
                    $timeout(function() {
                        $state.go('home');
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