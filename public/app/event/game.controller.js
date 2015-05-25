(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('EventGameController', EventGameController);

    /* @ngInject */
    function EventGameController($scope, $filter, $stateParams, $timeout, $firebaseArray, eventService, authService, FIREBASEDATA) {

        $timeout(function() {
        	angular.element('#contentView')
        	    .css('opacity', '1')
        	    .css('position', 'inherit');
        }, 410);

        var vm = this;

        vm.eventName = $stateParams.eventName;
        vm.gameName = $stateParams.gameName;

        vm.initGamePage = initGamePage;

        ///////////////////////////////

        function initGamePage() {

            var ref = new Firebase(FIREBASEDATA.FBURL);

            vm.eventProperties = eventService.getEventProperties(vm.eventName);

            eventService.getGameData(vm.eventName, vm.gameName).then(function(promiseResolution) {
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

        }

    }

})();