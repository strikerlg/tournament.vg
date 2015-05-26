(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('authService', authService);

    /* @ngInject */
    function authService($q, $rootScope, $state, $firebaseObject, AuthWrapper, FIREBASEDATA) {
        
    	this.checkIfUserExists = checkIfUserExists;
    	this.createNewUser = createNewUser;
        this.loginToAccount = loginToAccount;
        this.logOut = logOut;

    	///////////////////

    	function checkIfUserExists(inputUsername) {

    		var deferred = $q.defer();

    		var doesUserExist = false;
    		var usersRef = new Firebase(FIREBASEDATA.FBURL + '/users');

    		usersRef.once('value', function(dataSnapshot) {

    			dataSnapshot.forEach(function(user) {
    				if (user.val().userName === inputUsername) {
    					doesUserExist = true;
    				}
    			});

    			deferred.resolve(doesUserExist);

    		});

    		return deferred.promise;

    	}

    	function createNewUser(inputEmail, inputPassword, inputUsername) {

            var deferred = $q.defer();

    		AuthWrapper.$createUser({
    			email: inputEmail,
    			password: inputPassword
    		}).then(function(userData) {

    			// Create a data entry for the new username.
    			new Firebase(FIREBASEDATA.FBURL).child('users/' + userData.uid).set({

    				userName: inputUsername,
    				role: 'User'

    			}, function(errorData) {
    				console.error(errorData);
                    return errorData.code;
    			});

                // Create a data entry for the user's avatar.
                new Firebase(FIREBASEDATA.FBURL).child('avatars').child(inputUsername).set('http://api.adorable.io/avatars/42/' + inputUsername);

    			// Log the user in.
    			AuthWrapper.$authWithPassword({
    				email: inputEmail,
    				password: inputPassword
    			}).then(function() {
                    deferred.resolve('ACCOUNT_CREATED');
                });

    		}).catch(function(errorData) {

    			console.error(errorData);

    			if (errorData.code === 'EMAIL_TAKEN') {
                    deferred.resolve(errorData.code);
    			}

    		});

            return deferred.promise;

    	}

        function loginToAccount(inputEmail, inputPassword) {

            var deferred = $q.defer();

            AuthWrapper.$authWithPassword({
                email: inputEmail,
                password: inputPassword
            }).then(function(authData) {

                deferred.resolve('LOGIN_SUCCESS');

            }).catch(function(errorData) {

                if (errorData.code === 'INVALID_USER') {
                    deferred.resolve('INVALID_USER');
                } else if (errorData.code === 'INVALID_PASSWORD') {
                    deferred.resolve('INVALID_PASSWORD');
                }

            });

            return deferred.promise;

        }

        function logOut() {
            AuthWrapper.$unauth();
            $rootScope.unbindFunction();
        }

    }
})();