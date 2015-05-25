(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('eventService', eventService);

    /* @ngInject */
    function eventService($q, $filter, $firebaseObject, $firebaseArray, FIREBASEDATA) {

        this.createMultiGameFinalStandings = createMultiGameFinalStandings;
        this.getEventProperties = getEventProperties;
        this.getGameData = getGameData;
        this.getGamesList = getGamesList;
        this.getMultiGameLeaderboard = getMultiGameLeaderboard;
        this.getSingleGameLeaderboard = getSingleGameLeaderboard;
        this.getPlayerScores = getPlayerScores;

        ////////////////

        function createMultiGameFinalStandings(inputEvent) {

            // Calculate the final standings of the event.
            getMultiGameLeaderboard(inputEvent).then(function(promiseResolution) {

                var ref = new Firebase(FIREBASEDATA.FBURL);
                var inputEventStandings = $firebaseObject(
                    ref
                        .child('standings')
                        .child(inputEvent)
                );

                inputEventStandings.$loaded().then(function() {

                    promiseResolution.forEach(function(standing) {
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

        function getGameData(inputEvent, inputGame) {

            var deferred = $q.defer();

            var ref = new Firebase(FIREBASEDATA.FBURL);

            getGamesList(inputEvent).then(function(gamesList) {

                gamesList.forEach(function(game) {

                    if (game.camelName === inputGame) {
                        deferred.resolve(game);
                    }

                })

            });

            return deferred.promise;

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

        function getMultiGameLeaderboard(inputEvent) {

        	var deferred = $q.defer();

        	// We need to get the top 12 players for every game.
        	var playerPoints = {};

        	getGamesList(inputEvent).then(function(promiseResolution) {

        		var gamesList = promiseResolution;
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
        		for (var i = 0; i < playerPoints.length; i++) {

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
                                playerPoints.forEach(function(pointsData) {
                                    if (pointsData.points === getScoreCountOf) {
                                        floorRange += 1;
                                    }
                                });

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

    }
})();