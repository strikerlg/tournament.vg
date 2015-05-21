(function() {
    'use strict';

    angular
        .module('vg.app')
        .factory('AuthWrapper', AuthWrapper);

    /* @ngInject */
    function AuthWrapper($firebaseAuth) {

        var ref = new Firebase('https://wolfscontests.firebaseio.com');
        return $firebaseAuth(ref);

    }
    
})();