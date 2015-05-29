(function() {
    'use strict';

    angular
        .module('vg.app')
        .factory('AuthWrapper', AuthWrapper);

    /* @ngInject */
    function AuthWrapper($firebaseAuth, FIREBASEDATA) {

        var ref = new Firebase(FIREBASEDATA.FBURL);
        return $firebaseAuth(ref);

    }
    
})();