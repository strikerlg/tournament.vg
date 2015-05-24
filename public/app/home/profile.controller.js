(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($scope, $stateParams, $q, $timeout, $state, $firebaseArray, authService, profileService, eventService) {

        $timeout(function() {
        	angular.element('#contentView')
        	    .css('opacity', '1')
        	    .css('position', 'inherit');

            $('.collapsible').collapsible({
                accordion: true
            });
        }, 410);

        var vm = this;

        vm.initProfile = initProfile;

        /////////////////////////////////

        function initProfile() {
            profileService.getUserData($stateParams.username).then(function(promiseResolution) {
                vm.profileData = promiseResolution;

                profileService.getTournamentHistory(vm.profileData).then(function(promiseResolution) {
                    var tournamentHistoryData = promiseResolution;
                    vm.eventStandings = profileService.getTournamentStandings(tournamentHistoryData, $stateParams.username);
                });
            });

            profileService.getAvatarData().then(function(promiseResolution) {
                vm.avatarData = promiseResolution;
            });

            profileService.getBadgesData($stateParams.username).then(function then(model) {
                vm.badgesData = model;
            });
        }

    }

})();