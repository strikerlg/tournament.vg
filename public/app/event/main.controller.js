(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('EventMainController', EventMainController);

    /* @ngInject */
    function EventMainController($scope, $rootScope, $filter, $stateParams, $state, $timeout, $firebaseArray, eventService, authService, profileService, teamService, FIREBASEDATA) {

        /* jshint validthis: true */
        var vm = this;

        vm.eventName = $stateParams.eventName;

        vm.createTeam = createTeam;
        vm.determinePoints = determinePoints;
        vm.goToPlayerProfile = goToPlayerProfile;
        vm.openGameModal = openGameModal;
        vm.openModal = openModal;
        vm.openMultiGameLeaderboardModal = openMultiGameLeaderboardModal;
        vm.openPlayerModal = openPlayerModal;
        vm.registerForEvent = registerForEvent;

        initEvent();

        /////////////////////////////////

        function closeModal() {
            angular.element('.modal').closeModal();
        }

        function createTeam() {
            teamService.createTeam(vm.eventName, vm.newTeam).then(function() {
                Materialize.toast('Team ' + vm.newTeam.shortName + ' created.', 4000);
                vm.newTeam = null;
            });
        }

        function determinePoints(inputScoreData, inputIndex) {

            var userGamePoints;

            // No position greater than 12 gets points.
            if (inputIndex > 11) {
                userGamePoints = 0;
                return userGamePoints;
            }

            userGamePoints = 12 - inputIndex;

            var sortedScores = $filter('orderBy')(vm.gameScores, '-score');

            // Am I tied with the person above me? If so, match their points.
            if (sortedScores[inputIndex - 1]) {

                if (sortedScores[inputIndex - 1].score === inputScoreData.score) {
                    userGamePoints += 1;
                }
            }

            return userGamePoints;

        }

        function goToPlayerProfile(inputPlayer) {

            closeModal();
            $state.go('profile', {username: inputPlayer});

        }

        function initEvent() {

            eventService.loadEventProperties(vm.eventName);

            profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });

            $scope.$watchCollection(function() { return eventService.getEventPropertiesObject(); }, function(model) {
                vm.eventProperties = model;
            }, true);

            $scope.$watchCollection(function() { return eventService.getTeamListObject(); }, function(model) {
                vm.teamList = model;
                console.debug(vm.teamList);
            }, true);

            eventService.getPlayerPool(vm.eventName).then(function then(model) {
                vm.playerPool = model;
            });

            // FIXME: There should be a better way to initialize Materialize.css components.
            $timeout(function() {
                angular.element('ul.tabs').tabs();
                angular.element('select').material_select();
            }, 600);

        }

        function openModal(inputModal) {

            // This will evaluate to true if a Materialize modal is open.
            if (angular.element('#lean-overlay').length === 1) {

                closeModal();
                $timeout(function() {
                    angular.element(inputModal).openModal();
                    angular.element(inputModal + 'Content').scrollTop(0);
                }, 450);

            } else {

                angular.element(inputModal).openModal();
                angular.element(inputModal + 'Content').scrollTop(0);

            }

        }

        function openGameModal(inputGameName) {

            var ref = new Firebase(FIREBASEDATA.FBURL);

            eventService.getGameData(vm.eventName, inputGameName).then(function then(model) {
                vm.gameData = model;

                vm.gameScores = $firebaseArray(
                    ref
                        .child('contests')
                        .child(vm.eventName)
                        .child('activeGames')
                        .child(vm.gameData.$id)
                        .child('scores')
                );
            });

            openModal('#gameModal');

        }

        function openMultiGameLeaderboardModal() {

            eventService.getMultiGameLeaderboard(vm.eventName).then(function then(model) {
                vm.completeLeaderboard = model;
            });

            openModal('#multiGameLeaderboardModal');

        }

        function openPlayerModal(inputPlayer) {

            vm.focusPlayer = inputPlayer;

            eventService.getPlayerScores(vm.eventName, vm.gameList, vm.focusPlayer).then(function then(model) {
                vm.playerScores = model;
            });

            openModal('#playerModal');

        }

        function registerForEvent() {

            if (vm.regForm.$valid) {

                // Disable the register button.
                vm.disableRegisterButton = true;
                
                if (vm.eventProperties.format.teamBased) {
                    eventService.submitTeamBasedRegistration(vm.eventName, vm.selectedRegTeam, $rootScope.profile.$id, $rootScope.profile.userName);
                } else {
                    // TODO: Registration for non team-based events.
                }

            }

        }

    }

})();