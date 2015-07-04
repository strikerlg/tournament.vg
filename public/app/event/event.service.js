(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('eventService', eventService);

    /* @ngInject */
    function eventService($q, $filter, $rootScope, $firebaseObject, $firebaseArray, FIREBASEDATA, teamService) {

        var _eventProperties = null;
        var _gameList = null;
        var _leaderboardLength = null;
        var _summarizedLeaderboard = null;
        var _teamLeaderboardLength = null;
        var _teamSummarizedLeaderboard = null;
        var _teamList = null;

        this.addGame = addGame;
        this.createMultiGameFinalStandings = createMultiGameFinalStandings;
        this.getEventProperties = getEventProperties;
        this.getEventPropertiesObject = getEventPropertiesObject;
        this.getGameData = getGameData;
        this.getGameListObject = getGameListObject;
        this.getGamesList = getGamesList;
        this.getLeaderboardLengthValue = getLeaderboardLengthValue;
        this.getLogs = getLogs;
        this.getMultiGameLeaderboard = getMultiGameLeaderboard;
        this.getPlayerScores = getPlayerScores;
        this.getPlayerTeamScores = getPlayerTeamScores;
        this.getPlayerPool = getPlayerPool;
        this.getSingleGameLeaderboard = getSingleGameLeaderboard;
        this.getSummarizedLeaderboardObject = getSummarizedLeaderboardObject;
        this.getTeamBasedMultiGamePlayerLeaderboard = getTeamBasedMultiGamePlayerLeaderboard;
        this.getTeamGameScores = getTeamGameScores;
        this.getTeamLeaderboardLengthValue = getTeamLeaderboardLengthValue;
        this.getTeamListObject = getTeamListObject;
        this.getTeamSummarizedLeaderboardObject = getTeamSummarizedLeaderboardObject;
        this.incrementSubmissions = incrementSubmissions;
        this.loadEventProperties = loadEventProperties;
        this.submitTeamBasedRegistration = submitTeamBasedRegistration;
        this.submitTeamMultiGameScore = submitTeamMultiGameScore;

        ////////////////

        function addGame(inputEvent, inputFormalGameName, inputMameRomset, inputRules) {

            return $q(function(resolve, reject) {

                var newGame = {
                    name: inputFormalGameName,
                    mameSet: inputMameRomset,
                    rules: inputRules
                };

                _gameList.$add(newGame);

                resolve();

            });

        }

        function addScoreToLogs(inputEvent, inputGame, inputTeam, inputScore, inputTwitchUrl, inputScreenshotUrl, inputInpUrl, inputMameVersion) {

            var newLog = {
                game: inputGame.name,
                team: inputTeam,
                score: inputScore,
                userName: $rootScope.profile.userName,
                twitchUrl: inputTwitchUrl ? inputTwitchUrl : null,
                screenshotUrl: inputScreenshotUrl ? inputScreenshotUrl : null,
                inpUrl: inputInpUrl ? inputInpUrl : null,
                mameVersion: inputMameVersion ? inputMameVersion : null
            };

            getLogs(inputEvent).then(function(eventLogs) {
                eventLogs.$add(newLog);
            });

        }

        function createMultiGameFinalStandings(inputEvent) {

            // Calculate the final standings of the event.
            getMultiGameLeaderboard(inputEvent).then(function then(model) {

                var ref = new Firebase(FIREBASEDATA.FBURL);
                var inputEventStandings = $firebaseObject(
                    ref
                        .child('standings')
                        .child(inputEvent)
                );

                inputEventStandings.$loaded().then(function() {

                    model.forEach(function(standing) {
                        inputEventStandings[standing.key] = standing.position;
                    });

                    inputEventStandings.$save();

                });

            });

        }

        function getEventProperties(inputEvent) {

            var deferred = $q.defer();

        	var ref = new Firebase(FIREBASEDATA.FBURL);
        	var eventProperties = $firebaseObject(
        		ref
        			.child('contests')
        			.child(inputEvent)
        			.child('properties')
        	);

            deferred.resolve(eventProperties);

        	return deferred.promise;

        }

        function getEventPropertiesObject() {
            return _eventProperties;
        }

        function getFirstPlaceScores() {

            _gameList.forEach(function(game) {

                // If there are scores, get the top one.
                if (game.scores) {

                    var scoresArray = $.map(game.scores, function(el) { return el; });
                    scoresArray = $filter('orderBy')(scoresArray, '-score');
                    game.firstScore = scoresArray[0];

                }

            });

        }

        function getGameData(inputEvent, inputGame) {

            var deferred = $q.defer();

            var ref = new Firebase(FIREBASEDATA.FBURL);

            getGamesList(inputEvent).then(function(gamesList) {

                gamesList.forEach(function(game) {

                    if (game.name === inputGame) {
                        deferred.resolve(game);
                    }

                });

            });

            return deferred.promise;

        }

        function getGameListObject() {
            return _gameList;
        }

        function getGamesList(inputEvent) {

        	var deferred = $q.defer();

        	var ref = new Firebase(FIREBASEDATA.FBURL);
        	_gameList = $firebaseArray(
        		ref
        			.child('contests')
        			.child(inputEvent)
        			.child('activeGames')
        	);

        	_gameList.$loaded().then(function() {

                getFirstPlaceScores();

                _gameList.$watch(function(event) {
                    getFirstPlaceScores();
                });

        		deferred.resolve(_gameList);
        	});

        	return deferred.promise;

        }

        function getLeaderboardLengthValue() {
            return _leaderboardLength;
        }

        function getLogs(inputEvent) {

            return $q(function(resolve, reject) {

                var ref = new Firebase(FIREBASEDATA.FBURL);
                var eventLogs = $firebaseArray(
                    ref
                        .child('logs')
                        .child(inputEvent)
                );

                eventLogs.$loaded().then(function() {
                    resolve(eventLogs);
                });

            })

        }

        function getMultiGameLeaderboard(inputEvent) {

        	var deferred = $q.defer();

        	// We need to get the top 12 players for every game.
        	var playerPoints = {};

        	getGamesList(inputEvent).then(function then(model) {

        		var gamesList = model;
        		gamesList.forEach(function(game) {

        			if (game.scores) {

        				// Convert the game's scores to an array.
        				var scoresArray = $.map(game.scores, function(el) { return el; });
        				scoresArray = $filter('orderBy')(scoresArray, '-score');

        				var totalAward = 12;

        				// Iterate through the top scores awarding points.
        				for (var i = 0; i < scoresArray.length; i++) {

        					if (!playerPoints[scoresArray[i].userName]) {
        						playerPoints[scoresArray[i].userName] = {
        							points: 0
        						};
        					}

        					playerPoints[scoresArray[i].userName].points += totalAward;

        					if (totalAward > 0) {
        						totalAward -= 1;
        					}

        				}

        			}

        		});

        		// Find and resolve ties.
        		playerPoints = $filter('orderObjectBy')(playerPoints, 'points', true);
                var haveBottomScorersFloor = false;
                var floorRange = 0;
        		for (var i = 0; i < playerPoints.length; i += 1) {

        			if (playerPoints[i-1] && playerPoints[i].points && playerPoints[i-1].points) {

        				if (playerPoints[i].points === playerPoints[i-1].points) {
        					playerPoints[i].position = playerPoints[i-1].position;
        				} else {
        					playerPoints[i].position = (i+1);
        				}

        			} else {

        				if (i === 0) {
        					playerPoints[i].position = 1;
        				} else {

                            if (!haveBottomScorersFloor) {
                                // Get count of players in one position higher.
                                var getScoreCountOf = playerPoints[i-1].points;

                                for (var j = 0; j < playerPoints.length; j += 1) {
                                    if (playerPoints[j].points === getScoreCountOf) {
                                        floorRange += 1;
                                    }
                                }

                                haveBottomScorersFloor = true;
                            }

        					playerPoints[i].position = (playerPoints.length + 1) - floorRange;
        				}

        			}

        		}

        		deferred.resolve(playerPoints);

        	});

			return deferred.promise;

        }

        function getSingleGameLeaderboard(inputEvent) {

            var deferred = $q.defer();

            var ref = new Firebase(FIREBASEDATA.FBURL);
            var leaderboardData = $firebaseArray(
                ref
                    .child('contests')
                    .child(inputEvent)
                    .child('scores')
            );

            deferred.resolve(leaderboardData);

            return deferred.promise;

        }

        function getSummarizedLeaderboardObject() {
            return _summarizedLeaderboard;
        }

        function getTeamBasedMultiGamePlayerLeaderboard(inputEvent) {

            return $q(function(resolve, reject) {

                var playerPoints = {};
                _gameList.forEach(function(game) {

                    if (game.scores) {

                        var scoresArray = $.map(game.scores, function(el) { return el; });
                        scoresArray = $filter('orderBy')(scoresArray, '-score');
                        var totalAward = _teamList.length * 5;
                        var teamTracker = {};

                        for (var i = 0; i < scoresArray.length; i++) {

                            if (!teamTracker[scoresArray[i].team]) {
                                teamTracker[scoresArray[i].team] = 1;
                            } else {
                                teamTracker[scoresArray[i].team] += 1;
                            }

                            if (!playerPoints[scoresArray[i].userName]) {
                                playerPoints[scoresArray[i].userName] = {
                                    points: 0
                                };
                            }

                            if (teamTracker[scoresArray[i].team] <= 5) {

                                playerPoints[scoresArray[i].userName].points += totalAward;
                                playerPoints[scoresArray[i].userName].team = scoresArray[i].team;

                                if (totalAward > 0) {
                                    totalAward -= 1;
                                }

                            }

                        }

                    }

                });

                playerPoints = $filter('orderObjectBy')(playerPoints, 'points', true);
                resolve(playerPoints);

            });

        }

        function getTeamGameScores(inputEvent, inputTeam) {

            return $q(function(resolve, reject) {

                var playerPoints = {};
                var teamPoints = {};
                var gamePoints = [];

                _gameList.forEach(function(game) {

                    if (game.scores) {

                        var scoresArray = $.map(game.scores, function(el) { return el; });
                        scoresArray = $filter('orderBy')(scoresArray, '-score');
                        var totalAward = _teamList.length * 5;
                        var teamTracker = {};

                        for (var i = 0; i < scoresArray.length; i++) {

                            if (!teamTracker[scoresArray[i].team]) {
                                teamTracker[scoresArray[i].team] = 1;
                            } else {
                                teamTracker[scoresArray[i].team] += 1;
                            }

                            if (!teamPoints[scoresArray[i].team]) {
                                teamPoints[scoresArray[i].team] = {
                                    points: 0
                                };
                            }

                            if (teamTracker[scoresArray[i].team] <= 5) {

                                teamPoints[scoresArray[i].team].points += totalAward;

                                if (totalAward > 0) {
                                    totalAward -= 1;
                                }

                            }

                        }

                        gamePoints.push({
                            name: game.name,
                            camelName: game.camelName,
                            points: (teamPoints[inputTeam] && teamPoints[inputTeam].points) ? teamPoints[inputTeam].points : 0
                        });

                        if (teamPoints[inputTeam] && teamPoints[inputTeam].points) {
                            teamPoints[inputTeam].points = 0;
                        }

                    }

                });

                teamPoints = $filter('orderObjectBy')(teamPoints, 'points', true);
                resolve(gamePoints);

            });

        }

        function getTeamLeaderboard(inputEvent) {

            return $q(function(resolve, reject) {

                var playerPoints = {};
                var teamPoints = {};
                _gameList.forEach(function(game) {

                    if (game.scores) {

                        var scoresArray = $.map(game.scores, function(el) { return el; });
                        scoresArray = $filter('orderBy')(scoresArray, '-score');
                        var totalAward = _teamList.length * 5;
                        var teamTracker = {};

                        for (var i = 0; i < scoresArray.length; i++) {

                            if (!teamTracker[scoresArray[i].team]) {
                                teamTracker[scoresArray[i].team] = 1;
                            } else {
                                teamTracker[scoresArray[i].team] += 1;
                            }

                            if (!teamPoints[scoresArray[i].team]) {
                                teamPoints[scoresArray[i].team] = {
                                    points: 0
                                };
                            }

                            if (teamTracker[scoresArray[i].team] <= 5) {

                                teamPoints[scoresArray[i].team].points += totalAward;

                                if (totalAward > 0) {
                                    totalAward -= 1;
                                }

                            }

                        }

                    }

                });

                teamPoints = $filter('orderObjectBy')(teamPoints, 'points', true);

                // Get the full name of the teams.
                teamPoints.forEach(function(team) {

                    // Find this team in the teamList array.
                    _teamList.forEach(function(completeTeam) {

                        if (team.key === completeTeam.$id) {
                            team.fullName = completeTeam.fullName;
                        }

                    });

                });

                resolve(teamPoints);

            });

        }

        function getTeamListObject() {
            return _teamList;
        }

        function getPlayerPool(inputEvent) {

            var deferred = $q.defer();

            var ref = new Firebase(FIREBASEDATA.FBURL);
            var playerPoolData = $firebaseObject(
                ref
                    .child('contests')
                    .child(inputEvent)
                    .child('playerPool')
            );

            deferred.resolve(playerPoolData);

            return deferred.promise;

        }

        function getPlayerTeamScores(inputEvent, inputGamesList, inputPlayer) {

            return $q(function(resolve, reject) {

                var displayScores = [];
                var playerPoints = {};
                var teamTracker = {};

                // Iterate through every game.
                inputGamesList.forEach(function(game) {

                    if (game.scores) {

                        var scoresArray = $.map(game.scores, function(el) { return el; });
                        scoresArray = $filter('orderBy')(scoresArray, '-score');
                        var totalAward = _teamList.length * 5;
                        var teamTracker = {};

                        for (var i = 0; i < scoresArray.length; i++) {

                            if (!teamTracker[scoresArray[i].team]) {
                                teamTracker[scoresArray[i].team] = 1;
                            } else {
                                teamTracker[scoresArray[i].team] += 1;
                            }

                            if (!playerPoints[scoresArray[i].userName]) {
                                playerPoints[scoresArray[i].userName] = {
                                    points: 0
                                };
                            }

                            if (scoresArray[i].userName === inputPlayer) {

                                var newScoreObject = {};
                                newScoreObject.position = i+1;
                                newScoreObject.name = game.name;
                                newScoreObject.team = scoresArray[i].team;
                                newScoreObject.score = scoresArray[i].score;
                                newScoreObject.inpUrl = scoresArray[i].inpUrl ? scoresArray[i].inpUrl : null;
                                newScoreObject.twitchUrl = scoresArray[i].twitchUrl ? scoresArray[i].twitchUrl : null;
                                newScoreObject.screenshotUrl = scoresArray[i].screenshotUrl ? scoresArray[i].screenshotUrl : null;
                                newScoreObject.mameVersion = scoresArray[i].mameVersion ? scoresArray[i].mameVersion : null;

                                if (teamTracker[scoresArray[i].team] <= 5) {
                                    newScoreObject.pointsEarned = totalAward;
                                } else {
                                    newScoreObject.pointsEarned = 0;
                                }

                                displayScores.push(newScoreObject);

                            } else {
                                totalAward -= 1;
                            }

                        }

                    }

                });

                resolve(displayScores);

            });

        }

        function getPlayerScores(inputEvent, inputGamesList, inputPlayer) {

            var deferred = $q.defer();

            var displayScores = [];

            // Iterate through every game.
            inputGamesList.forEach(function(game) {

                if (game.scores) {

                    // Convert the game's scores to an array.
                    var scoresArray = $.map(game.scores, function(el) { return el; });
                    scoresArray = $filter('orderBy')(scoresArray, '-score');

                    var totalAward = 12;

                    // Iterate through the scores starting from the top and find our user.
                    for (var i = 0; i < scoresArray.length; i++) {

                        // Found our player.
                        if (scoresArray[i].userName === inputPlayer) {

                            var newScoreObject = game;
                            newScoreObject.position = i+1;
                            newScoreObject.score = scoresArray[i].score;
                            newScoreObject.pointsEarned = totalAward;
                            newScoreObject.inpUrl = scoresArray[i].inpUrl ? scoresArray[i].inpUrl : null;
                            newScoreObject.twitchUrl = scoresArray[i].twitchUrl ? scoresArray[i].twitchUrl : null;
                            newScoreObject.mameVersion = scoresArray[i].mameVersion ? scoresArray[i].mameVersion : null;

                            displayScores.push(newScoreObject);
                            totalAward = 12;
                            break;

                        } else {
                            if (totalAward > 0) {
                                totalAward -= 1;
                            }
                        }

                    }

                }

            });

            deferred.resolve(displayScores);

            return deferred.promise;

        }

        function getTeamLeaderboardLengthValue() {
            return _teamLeaderboardLength;
        }

        function getTeamSummarizedLeaderboardObject() {
            return _teamSummarizedLeaderboard;
        }

        function incrementSubmissions() {
            _eventProperties.submissions += 1;
            _eventProperties.$save();
        }

        function loadEventProperties(inputEvent) {

            var ref = new Firebase(FIREBASEDATA.FBURL);
            var inputEventProperties = $firebaseObject(
                ref
                    .child('contests')
                    .child(inputEvent)
                    .child('properties')
            );

            inputEventProperties.$loaded().then(function() {
                _eventProperties = inputEventProperties;

                // If this is a multigame event, get the data needed for multigame components.
                if (_eventProperties.format.multiGame) {

                    getGamesList(inputEvent).then(function then(model) {
                        getFirstPlaceScores();
                    });

                    // Is this a team-based event?
                    if (!_eventProperties.format.teamBased) {

                        getMultiGameLeaderboard(inputEvent).then(function then(model) {
                            var leaderboard = model;
                            _leaderboardLength = leaderboard.length;
                            _summarizedLeaderboard = leaderboard.slice(0, 8);
                        });

                    } else {

                        teamService.getTeamList(inputEvent).then(function then(model) {
                            _teamList = model;

                            getTeamBasedMultiGamePlayerLeaderboard(inputEvent).then(function then(model) {
                                var leaderboard = model;
                                _leaderboardLength = leaderboard.length;
                                _summarizedLeaderboard = leaderboard.slice(0, 8);
                            });

                            getTeamLeaderboard(inputEvent).then(function then(model) {
                                var leaderboard = model;
                                _teamLeaderboardLength = leaderboard.length;
                                _teamSummarizedLeaderboard = leaderboard.slice(0, 8);
                            });
                        });

                    }

                // If this is a single game event, get the data needed for single game components.
                } else {

                    getSingleGameLeaderboard(inputEvent).then(function then(model) {
                        var leaderboard = model;
                        _leaderboardLength = leaderboard.length;
                        _summarizedLeaderboard = leaderboard;
                    });

                }

                // If this is a team-based event, get the data needed for team event components.
                if (_eventProperties.format.teamBased) {

                    teamService.getTeamList(inputEvent).then(function then(model) {
                        _teamList = model;
                    });

                }

            });

        }

        function submitTeamBasedRegistration(inputEvent, inputTeamObject, inputUID, inputUsername) {

            var ref = new Firebase(FIREBASEDATA.FBURL);
            
            var eventData = $firebaseObject(
                ref
                    .child('contests')
                    .child(inputEvent)
            );

            var teamPlayers = $firebaseObject(
                ref
                    .child('contests')
                    .child(inputEvent)
                    .child('teamPool')
                    .child(inputTeamObject.$id)
                    .child('players')
            );

            var profilePledgedData = $firebaseObject(
                ref
                    .child('users')
                    .child(inputUID)
                    .child('pledgedTo')
            );

            eventData.$loaded().then(function() {

                eventData.playerPool[inputUID] = {
                    status: 'active',
                    team: inputTeamObject.$id,
                    userName: inputUsername
                };

                eventData.$save();

            });

            teamPlayers.$loaded().then(function() {

                teamPlayers[inputUsername] = true;
                teamPlayers.$save();

            });

            profilePledgedData.$loaded().then(function() {
                profilePledgedData[inputEvent] = true;
                profilePledgedData.$save();
            });

            Materialize.toast('You are now registered for IGBY2.', 4000);

        }

        function submitTeamMultiGameScore(inputEvent, inputGame, inputTeam, inputScore, inputTwitchUrl, inputScreenshotUrl, inputInpUrl, inputMameVersion) {

            return $q(function(resolve, reject) {

                var ref = new Firebase(FIREBASEDATA.FBURL);

                var userGameScore = $firebaseObject(
                    ref
                        .child('contests')
                        .child(inputEvent)
                        .child('activeGames')
                        .child(inputGame.$id)
                        .child('scores')
                );

                userGameScore.$loaded().then(function() {

                    if (inputTwitchUrl) {
                        inputTwitchUrl = inputTwitchUrl.replace(/.*?:\/\//g, "");
                    }

                    if (inputInpUrl) {
                        inputInpUrl = inputInpUrl.replace(/.*?:\/\//g, "");
                    }

                    if (inputScreenshotUrl) {
                        inputScreenshotUrl = inputScreenshotUrl.replace(/.*?:\/\//g, "");
                    }

                    userGameScore[$rootScope.profile.userName] = {
                        score: Number(inputScore),
                        userName: $rootScope.profile.userName,
                        twitchUrl: inputTwitchUrl ? inputTwitchUrl : null,
                        inpUrl: inputInpUrl ? inputInpUrl : null,
                        mameVersion: inputMameVersion ? inputMameVersion : null,
                        screenshotUrl: inputScreenshotUrl ? inputScreenshotUrl : null,
                        team: inputTeam
                    };

                    userGameScore.$save();
                    addScoreToLogs(inputEvent, inputGame, inputTeam, inputScore, inputTwitchUrl, inputScreenshotUrl, inputInpUrl, inputMameVersion);
                    Materialize.toast('Your score was submitted!', 4000);
                    resolve();

                    // TODO: Add to recent activity.

                });

            });

        }

    }
})();