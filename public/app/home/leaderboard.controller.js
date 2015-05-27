(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('LeaderboardController', LeaderboardController);

    /* @ngInject */
    function LeaderboardController($q, $timeout, $firebaseArray, profileService, FIREBASEDATA) {

        /* jshint validthis: true */
    	var vm = this;

        activate();

        ////////////////

        function activate() {
            getProfileScores().then(function then(model) {
                vm.profileScoreData = model;
            });

            profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });
        }

        function getProfileScores() {

        	var deferred = $q.defer();
        	var ref = new Firebase(FIREBASEDATA.FBURL);

        	var profileScoreData = $firebaseArray(
        		ref
        			.child('badges')
        	);

        	profileScoreData.$loaded(function() {
        		deferred.resolve(profileScoreData);
        	});

        	return deferred.promise;

        }

    }
})();