(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('profileService', profileService);

    /* @ngInject */
    function profileService($rootScope, $q, $firebaseArray, $firebaseObject, eventService, FIREBASEDATA) {

    	this.getAvatarData = getAvatarData;
        this.getBadgesData = getBadgesData;
    	this.getTournamentHistory = getTournamentHistory;
        this.getTournamentStandings = getTournamentStandings;
        this.getUserData = getUserData;
        this.saveAvatarLink = saveAvatarLink;

        ////////////////

        function getAvatarData() {

            var deferred = $q.defer();
            var ref = new Firebase(FIREBASEDATA.FBURL);

            var avatarData = $firebaseObject(
                ref
                    .child('avatars')
            );

            avatarData.$loaded(function() {
                deferred.resolve(avatarData);
            });

            return deferred.promise;

        }

        function getBadgesData(inputUser) {

            var deferred = $q.defer();
            var ref = new Firebase(FIREBASEDATA.FBURL);

            var badgesData = $firebaseObject(
                ref
                    .child('badges')
                    .child(inputUser)
            );

            badgesData.$loaded(function() {
                deferred.resolve(badgesData);
            });

            return deferred.promise;

        }

        function getTournamentHistory(inputUserData) {

        	var deferred = $q.defer();
        	var ref = new Firebase(FIREBASEDATA.FBURL);

        	// Loop through each event in the pledgedTo object.
        	var eventsArray = [];
        	for (var key in inputUserData.pledgedTo) {
        		eventsArray.push(key);
        	}

        	deferred.resolve(eventsArray);

        	return deferred.promise;

        }

        function getTournamentStandings(inputTournamentHistory, inputUser) {

            var ref = new Firebase(FIREBASEDATA.FBURL);

            // Loop through each event in the user's history.
            var eventStandings = [];
            inputTournamentHistory.forEach(function(event) {

                eventService.getEventProperties(event).then(function(eventProperties) {

                    eventProperties.$loaded().then(function() {

                        // If concluded, get the user's standing.
                        if (eventProperties.state === 'concluded') {

                            var eventStandingData = $firebaseObject(
                                ref
                                    .child('standings')
                                    .child(event)
                            );

                            eventStandingData.$loaded().then(function() {

                                if (eventStandingData[inputUser]) {

                                    eventStandings.push({
                                        name: eventProperties.name,
                                        premier: eventProperties.premier ? true : null,
                                        shortName: event,
                                        state: 'concluded',
                                        color: eventProperties.color,
                                        position: eventStandingData[inputUser]
                                    });

                                } else {

                                    eventStandings.push({
                                        name: eventProperties.name,
                                        premier: eventProperties.premier ? true : null,
                                        shortName: event,
                                        state: 'concluded',
                                        color: eventProperties.color,
                                        position: -1
                                    });

                                }

                            });

                        } else if (eventProperties.state === 'inprogress' || eventProperties.state === 'upcoming') {

                            eventStandings.push({
                                name: eventProperties.name,
                                premier: eventProperties.premier ? true : null,
                                shortName: event,
                                color: eventProperties.color,
                                state: eventProperties.state
                            });

                        }

                    });

                });

            });

            return eventStandings;

        }

        function getUserData(inputUser) {

        	var deferred = $q.defer();
        	var ref = new Firebase(FIREBASEDATA.FBURL);

        	var usersData = $firebaseArray(
        		ref
        			.child('users')
        	);

        	usersData.$loaded(function() {

        		usersData.forEach(function(user) {
        			if (user.userName === inputUser) {
        				deferred.resolve(user);
        			}
        		});

        	});

        	return deferred.promise;

        }

        // FIXME: Make this server-side.
        function saveAvatarLink(inputLink, inputUser) {
            
            var ref = new Firebase(FIREBASEDATA.FBURL);

            var avatarData = $firebaseObject(
                ref
                    .child('avatars')
            );

            avatarData.$loaded(function() {
                avatarData[inputUser] = inputLink;
                avatarData.$save();
            });

        }

    }
})();