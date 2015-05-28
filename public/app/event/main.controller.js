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
        vm.openBadgesModal = openBadgesModal;
        vm.openGameModal = openGameModal;
        vm.openGameModalFromPlayerModal = openGameModalFromPlayerModal;
        vm.openManagementModal = openManagementModal;
        vm.openMultiGameLeaderboardModal = openMultiGameLeaderboardModal;
        vm.openPlayerModal = openPlayerModal;
        vm.openPlayerModalFromGameModal = openPlayerModalFromGameModal;
        vm.openPlayerModalFromLeaderboardModal = openPlayerModalFromLeaderboardModal;
        vm.openRulesModal = openRulesModal;

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

        function openBadgesModal() {

            angular.element('#badgesModal').openModal();
            angular.element('#badgesModalContent').scrollTop(0);

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

            angular.element('#gameModal').openModal();
            angular.element('#gameModal').addClass('.open-modal');
            angular.element('#gameModalContent').scrollTop(0);

        }

        function openManagementModal() {

            angular.element('#managementModal').openModal();
            angular.element('#managementModalContent').scrollTop(0);

        }

        function openMultiGameLeaderboardModal() {

            eventService.getMultiGameLeaderboard(vm.eventName).then(function then(model) {
                vm.completeLeaderboard = model;
            });

            angular.element('#multiGameLeaderboardModal').openModal();
            angular.element('#multiGameLeaderboardModalContent').scrollTop(0);

        }

        function openPlayerModal(inputPlayer) {

            vm.focusPlayer = inputPlayer;

            eventService.getPlayerScores(vm.eventName, vm.gameList, vm.focusPlayer).then(function then(model) {
                vm.playerScores = model;
            });

            angular.element('#playerModal').openModal();
            angular.element('#playerModalContent').scrollTop(0);

        }

        function openGameModalFromPlayerModal(inputGame) {

            closeModal();
            $timeout(function() {
                openGameModal(inputGame);
            }, 450);

        }

        function openPlayerModalFromGameModal(inputPlayer) {

            closeModal();
            $timeout(function() {
                openPlayerModal(inputPlayer);
            }, 450);

        }

        function openPlayerModalFromLeaderboardModal(inputPlayer) {

            closeModal();
            $timeout(function() {
                openPlayerModal(inputPlayer);
            }, 450);

        }

        function openRulesModal() {
            angular.element('#rulesModal').openModal();
        }

    }

})();