(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('RegController', RegController);

    /* @ngInject */
    function RegController($scope, $rootScope, $timeout, $window, $state, $firebaseObject, authService, AuthWrapper) {

        $timeout(function() {
        	angular.element('#contentView')
        	    .css('opacity', '1')
        	    .css('position', 'inherit');
        }, 410);

        var vm = this;

        vm.loginToAccount = loginToAccount;
        vm.passwordReset = passwordReset;
        vm.submitNewAccount = submitNewAccount;

        /////////////////////

        function loginToAccount() {

            authService.loginToAccount(vm.loginEmail, vm.loginPassword).then(function(promiseResolution) {

                vm.showInvalidUserError = false;
                vm.showInvalidPasswordError = false;

                if (promiseResolution === 'LOGIN_SUCCESS') {

                    $state.go('home');

                } else if (promiseResolution === 'INVALID_USER') {
                    vm.showInvalidUserError = true;
                    return;
                } else if (promiseResolution === 'INVALID_PASSWORD') {
                    vm.showInvalidPasswordError = true;
                }

            });

        }

        function passwordReset() {

            if (!vm.loginEmail) {
                vm.showPasswordResetEmailMessage = true;
                return;
            }

            AuthWrapper.$resetPassword({
                email: vm.loginEmail
            }).then(function() {
                vm.showPasswordResetEmailMessage = false;
                Materialize.toast('A password reset email has been sent to ' + vm.loginEmail + '.', 4000);
            });

        }

        function submitNewAccount() {
            
            // Does the user exist? If so, show an error message.
            authService.checkIfUserExists(vm.newUsername).then(function(userExists) {

                vm.showDuplicateUserError = false;
                vm.showEmailTakenError = false;

                if (userExists) {

                    vm.showDuplicateUserError = true;
                    return;

                // Try to create the new user.
                } else {

                    authService.createNewUser(vm.newEmail, vm.newPassword, vm.newUsername).then(function(promiseResolution) {

                        if (promiseResolution === 'EMAIL_TAKEN') {

                            vm.showEmailTakenError = true;
                            return;

                        } else if (promiseResolution === 'ACCOUNT_CREATED') {

                            $state.go('profile', {username: vm.newUsername});

                        }

                    });

                }

            });

        }

    }

})();