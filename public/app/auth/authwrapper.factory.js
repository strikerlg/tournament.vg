(function() {
    'use strict';

    angular
        .module('vg.app')
        .factory('AuthWrapper', AuthWrapper);

    /* @ngInject */
    function AuthWrapper($firebaseAuth) {

        var ref = new Firebase(FBURL);
        return $firebaseAuth(ref);

    }
    
})();