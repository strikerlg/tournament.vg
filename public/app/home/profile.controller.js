(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($scope, $stateParams, $q, $timeout, $state, $firebaseArray, authService, profileService, eventService) {

        /* jshint validthis: true */
        var vm = this;
        
        activate();

        /////////////////////////////////

        function activate() {

            profileService.getUserData($stateParams.username).then(function then(model) {
                vm.profileData = model;

                profileService.getTournamentHistory(vm.profileData).then(function then(model) {
                    var tournamentHistoryData = model;
                    vm.eventStandings = profileService.getTournamentStandings(tournamentHistoryData, $stateParams.username);
                });

                $('.collapsible').collapsible({
                    accordion: true
                });
            });

            profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });

            profileService.getBadgesData($stateParams.username).then(function then(model) {
                vm.badgesData = model;
            });

        }

    }

})();