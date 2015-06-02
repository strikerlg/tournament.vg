(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('eventService', eventService);

    /* @ngInject */
    function eventService($q, $filter, $firebaseObject, $firebaseArray, FIREBASEDATA, teamService) {

        var _eventProperties = null;
        var _gameList = null;
        var _leaderboardLength = null;
        var _summarizedLeaderboard = null;
        var _teamList = null;

        this.createMultiGameFinalStandings = createMultiGameFinalStandings;
        this.getEventProperties = getEventProperties;
        this.getEventPropertiesObject = getEventPropertiesObject;
        this.getGameData = getGameData;
        this.getGameListObject = getGameListObject;
        this.getGamesList = getGamesList;
        this.getLeaderboardLengthValue = getLeaderboardLengthValue;
        this.getMultiGameLeaderboard = getMultiGameLeaderboard;
        this.getPlayerScores = getPlayerScores;
        this.getSingleGameLeaderboard = getSingleGameLeaderboard;
        this.getSummarizedLeaderboardObject = getSummarizedLeaderboardObject;
        this.getTeamListObject = getTeamListObject;
        this.loadEventProperties = loadEventProperties;

        ////////////////

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

                    if (game.camelName === inputGame) {
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
        	var gamesList = $firebaseArray(
        		ref
        			.child('contests')
        			.child(inputEvent)
        			.child('activeGames')
        	);

        	gamesList.$loaded().then(function() {
        		deferred.resolve(gamesList);
        	});

        	return deferred.promise;

        }

        function getLeaderboardLengthValue() {
            return _leaderboardLength;
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

        function getTeamListObject() {
            return _teamList;
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
                        _gameList = model;
                        getFirstPlaceScores();
                    });

                    getMultiGameLeaderboard(inputEvent).then(function then(model) {
                        var leaderboard = model;
                        _leaderboardLength = leaderboard.length;
                        _summarizedLeaderboard = leaderboard.slice(0, 8);
                    });

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

    }
})();