(function() {
    'use strict';

    angular
        .module('vg.app')
        .service('teamService', teamService);

    /* @ngInject */
    function teamService($q, $firebaseArray, $firebaseObject, FIREBASEDATA) {

    	this.createTeam = createTeam;
        this.getTeamList = getTeamList;

        ////////////////

        function createTeam(inputEvent, inputNewTeamProperties) {

        	var deferred = $q.defer();

        	var ref = new Firebase(FIREBASEDATA.FBURL);
        	var teamPool = $firebaseObject(
        		ref
        			.child('contests')
        			.child(inputEvent)
        			.child('teamPool')
        	);

        	teamPool.$loaded().then(function() {

        		teamPool[inputNewTeamProperties.shortName] = {
        			fullName: inputNewTeamProperties.formalName
        		};
        		teamPool.$save();
        		deferred.resolve();

        	});

        	return deferred.promise;

        }

        function getTeamList(inputEvent) {

        	var deferred = $q.defer();

        	var ref = new Firebase(FIREBASEDATA.FBURL);
        	var teamList = $firebaseArray(
        		ref
        			.child('contests')
        			.child(inputEvent)
        			.child('teamPool')
        	);

        	teamList.$loaded().then(function() {
        		deferred.resolve(teamList);
        	});

        	return deferred.promise;

        }
    }
})();