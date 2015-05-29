(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('EventMainController', EventMainController);

    /* @ngInject */
    function EventMainController($scope, $filter, $stateParams, $state, $timeout, $firebaseArray, eventService, authService, profileService, teamService, FIREBASEDATA) {

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

            $scope.$watch(function() { return eventService.getEventPropertiesObject(); }, function(model) {
                vm.eventProperties = model;
            }, true);

            $scope.$watch(function() { return eventService.getGameListObject(); }, function(model) {
                vm.gameList = model;
            }, true);

            $scope.$watch(function() { return eventService.getLeaderboardLengthValue(); }, function(model) {
                vm.leaderboardLength = model;
            }, true);

            $scope.$watch(function() { return eventService.getSummarizedLeaderboardObject(); }, function(model) {
                vm.summarizedLeaderboard = model;
            }, true);

            $scope.$watch(function() { return eventService.getTeamListObject(); }, function(model) {
                vm.teamList = model;
            }, true);

            profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });

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

    }

})();