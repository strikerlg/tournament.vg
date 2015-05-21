(function() {
    'use strict';

    angular
        .module('vg.app')
        .run(run);

    function run($rootScope, $location, $firebaseObject, AuthWrapper) {

        $rootScope.$on('$stateChangeSuccess', function() {

            // If user is logged in, download their profile data to an object in $rootScope.
            if (AuthWrapper.$getAuth()) {
                
                var authData = AuthWrapper.$getAuth();
                var ref = new Firebase('https://wolfscontests.firebaseio.com');

                var profileData = $firebaseObject(ref.child('users').child(authData.uid));
                profileData.$bindTo($rootScope, 'profile').then(function(unbind) {
                    $rootScope.unbindFunction = unbind;
                });

            }

        });

    }

})();