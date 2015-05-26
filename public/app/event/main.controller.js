(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('EventMainController', EventMainController);

    /* @ngInject */
    function EventMainController($scope, $filter, $stateParams, $state, $timeout, $firebaseArray, eventService, authService, profileService, teamService, FIREBASEDATA) {

        // Enable Materialize.css collapsibles.
        $timeout(function() {
            $('.collapsible').collapsible({
                accordion: true
            });

            $('ul.tabs').tabs();
        }, 1000);

        $timeout(function() {
            $('.collapsible').collapsible({
                accordion: true
            });

            $('ul.tabs').tabs();
        }, 3000);

        var vm = this;

        vm.eventName = $stateParams.eventName;

        vm.closeGameModal = closeGameModal;
        vm.closeMultiGameLeaderboardModal = closeMultiGameLeaderboardModal;
        vm.closePlayerModal = closePlayerModal;
        vm.createTeam = createTeam;
        vm.determinePoints = determinePoints;
        vm.getFirstPlaceScores = getFirstPlaceScores;
        vm.goToPlayerProfile = goToPlayerProfile;
        vm.initEvent = initEvent;
        vm.openBadgesModal = openBadgesModal;
        vm.openGameModal = openGameModal;
        vm.openGameModalFromPlayerModal = openGameModalFromPlayerModal;
        vm.openManagementModal = openManagementModal;
        vm.openMultiGameLeaderboardModal = openMultiGameLeaderboardModal;
        vm.openPlayerModal = openPlayerModal;
        vm.openPlayerModalFromGameModal = openPlayerModalFromGameModal;
        vm.openPlayerModalFromLeaderboardModal = openPlayerModalFromLeaderboardModal;
        vm.openRulesModal = openRulesModal;

        /////////////////////////////////

        function closeGameModal() {
            angular.element('#gameModal').closeModal();
        }

        function closeMultiGameLeaderboardModal() {
            angular.element('#multiGameLeaderboardModal').closeModal();
        }

        function closePlayerModal() {
            angular.element('#playerModal').closeModal();
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

        };

        function getFirstPlaceScores() {

            vm.gameList.forEach(function(game) {

                // If there are scores, get the top one.
                if (game.scores) {

                    var scoresArray = $.map(game.scores, function(el) { return el; });
                    scoresArray = $filter('orderBy')(scoresArray, '-score');
                    game.firstScore = scoresArray[0];

                }

            });

        }

        function goToPlayerProfile(inputPlayer) {

            angular.element('#playerModal').closeModal();
            $state.go('profile', {username: inputPlayer});

        }

        function initEvent() {

            eventService.getEventProperties(vm.eventName).then(function(promiseResolution) {

                vm.eventProperties = promiseResolution;

                vm.eventProperties.$loaded().then(function() {

                    // If this is a multigame event, get the data needed for multigame components.
                    if (vm.eventProperties.format.multiGame) {

                        eventService.getGamesList(vm.eventName).then(function(promiseResolution) {
                            vm.gameList = promiseResolution;
                            getFirstPlaceScores();
                        });

                        eventService.getMultiGameLeaderboard(vm.eventName).then(function(promiseResolution) {
                            var leaderboard = promiseResolution;
                            vm.leaderboardLength = leaderboard.length;
                            vm.summarizedLeaderboard = leaderboard.slice(0, 8);
                        });

                    // If this is a single game event, get the data needed for single game components.
                    } else {

                        eventService.getSingleGameLeaderboard(vm.eventName).then(function(promiseResolution) {
                            var leaderboard = promiseResolution;
                            vm.leaderboardLength = leaderboard.length;
                            vm.summarizedLeaderboard = leaderboard;
                        });

                    }

                    // If this is a team-based event, get the data needed for team event components.
                    if (vm.eventProperties.format.teamBased) {

                        teamService.getTeamList(vm.eventName).then(function then(model) {
                            vm.teamList = model;
                        });
                        
                    }

                });

            });

            profileService.getAvatarData().then(function(promiseResolution) {
                vm.avatarData = promiseResolution;
            });

        }

        function openBadgesModal() {

            angular.element('#badgesModal').openModal();
            angular.element('#badgesModalContent').scrollTop(0);

        }

        function openGameModal(inputGameName) {

            var ref = new Firebase(FIREBASEDATA.FBURL);

            eventService.getGameData(vm.eventName, inputGameName).then(function(promiseResolution) {
                vm.gameData = promiseResolution;

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
            angular.element('#gameModalContent').scrollTop(0);

        }

        function openManagementModal() {

            angular.element('#managementModal').openModal();
            angular.element('#managementModalContent').scrollTop(0);

        }

        function openMultiGameLeaderboardModal() {

            eventService.getMultiGameLeaderboard(vm.eventName).then(function(promiseResolution) {
                vm.completeLeaderboard = promiseResolution;
            });

            angular.element('#multiGameLeaderboardModal').openModal();
            angular.element('#multiGameLeaderboardModalContent').scrollTop(0);

        }

        function openPlayerModal(inputPlayer) {

            vm.focusPlayer = inputPlayer;

            eventService.getPlayerScores(vm.eventName, vm.gameList, vm.focusPlayer).then(function(promiseResolution) {
                vm.playerScores = promiseResolution;
            });

            angular.element('#playerModal').openModal();
            angular.element('#playerModalContent').scrollTop(0);

        }

        function openGameModalFromPlayerModal(inputGame) {

            closePlayerModal();

            $timeout(function() {
                openGameModal(inputGame);
            }, 450);

        }

        function openPlayerModalFromGameModal(inputPlayer) {

            closeGameModal();

            $timeout(function() {
                openPlayerModal(inputPlayer);
            }, 450);

        }

        function openPlayerModalFromLeaderboardModal(inputPlayer) {

            closeMultiGameLeaderboardModal();

            $timeout(function() {
                openPlayerModal(inputPlayer);
            }, 450);

        }

        function openRulesModal() {
            angular.element('#rulesModal').openModal();
        }

    }

})();