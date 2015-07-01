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

        vm.addGame = addGame;
        vm.createTeam = createTeam;
        vm.determinePoints = determinePoints;
        vm.goToPlayerProfile = goToPlayerProfile;
        vm.openGameModal = openGameModal;
        vm.openModal = openModal;
        vm.openMultiGameLeaderboardModal = openMultiGameLeaderboardModal;
        vm.openPlayerModal = openPlayerModal;
        vm.openTeamScoresModal = openTeamScoresModal;
        vm.registerForEvent = registerForEvent;
        vm.submitScore = submitScore;

        initEvent();

        /////////////////////////////////

        function addGame() {

            eventService.addGame(vm.eventName, vm.newGame.inputFormalGameName, vm.newGame.inputMameRomset, vm.newGame.inputRules).then(function then(model) {

                vm.newGame.inputFormalGameName = null;
                vm.newGame.inputMameRomset = null;
                vm.newGame.inputRules = null;

                Materialize.toast('Game added.', 4000);

            });

        }

        function calculateTeamScores() {

            var sortedScores = $filter('orderBy')(vm.gameScores, '-score');
            var teamTracker = {};
            var potentialPoints = (vm.teamList.length * 5);

            sortedScores.forEach(function(gameScore) {
                
                if (!teamTracker[gameScore.team]) {
                    teamTracker[gameScore.team] = 1;
                } else {
                    teamTracker[gameScore.team] += 1;
                }

                // We only care about a team's top five scores.
                if (teamTracker[gameScore.team] <= 5) {
                    
                    gameScore.points = potentialPoints;
                    if (potentialPoints > 0) { potentialPoints -= 1; }

                } else {
                    gameScore.points = 0;
                }

            });

        }

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
            }, true);

            // FIXME: Remove when multi-game submit is working...
            $scope.$watchCollection(function() { return eventService.getGameListObject(); }, function(model) {
                vm.gameList = model;
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

                vm.gameScores.$loaded().then(function() {
                    if (vm.eventProperties.format.teamBased) {
                        calculateTeamScores();
                    }
                })
            });

            openModal('#gameModal');

        }

        function openMultiGameLeaderboardModal() {

            eventService.getTeamBasedMultiGamePlayerLeaderboard(vm.eventName).then(function then(model) {
                vm.completeLeaderboard = model;
            });

            openModal('#multiGameLeaderboardModal');

        }

        function openPlayerModal(inputPlayer) {

            vm.focusPlayer = inputPlayer;

            // FIXME: Make this cleaner.
            if (vm.eventProperties.format.teamBased) {

                eventService.getPlayerTeamScores(vm.eventName, vm.gameList, vm.focusPlayer).then(function then(model) {

                    vm.playerScores = model;
                    if (vm.playerScores.length > 0) {
                        vm.teamList.forEach(function(team) {
                            if (team.$id === vm.playerScores[0].team) {
                                vm.playerTeam = team.fullName;
                            }
                        });
                    }

                });

            } else {

                eventService.getPlayerScores(vm.eventName, vm.gameList, vm.focusPlayer).then(function then(model) {
                    vm.playerScores = model;
                });

            }

            openModal('#playerModal');

        }

        function openTeamScoresModal(inputTeam) {

            vm.focusTeam = inputTeam;

            eventService.getTeamGameScores(vm.eventName, vm.focusTeam.key).then(function then(model) {
                vm.teamScores = model;
            });

            openModal('#teamScoresModal');

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

        function submitScore() {

            if (vm.scoreSubmitForm.$valid) {

                if (vm.eventProperties.format.teamBased && vm.eventProperties.format.multiGame) {
                    eventService.submitTeamMultiGameScore(vm.eventName,
                                                          vm.submitSelectedGame, 
                                                          vm.playerPool[$rootScope.profile.$id].team, 
                                                          vm.submitUserScore, 
                                                          vm.submitTwitchUrl, 
                                                          vm.submitScreenshotUrl, 
                                                          vm.submitInpUrl, 
                                                          vm.submitInpMameVersion)
                        .then(function then(model) {
                            $timeout(function() {
                                closeModal();
                            }, 300);
                        });
                }

            } else {
                Materialize.toast('Please be sure all required information is filled out.', 4000);
            }

        }

    }

})();