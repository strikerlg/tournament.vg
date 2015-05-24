(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('LeaderboardController', LeaderboardController);

    /* @ngInject */
    function LeaderboardController($q, $timeout, $firebaseArray, profileService) {

    	var FBURL = 'https://wolfscontests.firebaseio.com';

        var vm = this;

        $timeout(function() {
        	angular.element('#contentView')
                .css('opacity', '1')
                .css('position', 'inherit');
        }, 310);

        getProfileScores().then(function then(model) {
        	vm.profileScoreData = model;
        });

        profileService.getAvatarData().then(function then(model) {
        	vm.avatarData = model;
        });

        ////////////////

        function getProfileScores() {

        	var deferred = $q.defer();
        	var ref = new Firebase(FBURL);

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