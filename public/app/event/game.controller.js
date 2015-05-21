(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('EventGameController', EventGameController);

    /* @ngInject */
    function EventGameController($scope, $filter, $stateParams, $timeout, $firebaseArray, eventService, authService) {

        $timeout(function() {
        	angular.element('#contentView')
        	    .css('opacity', '1')
        	    .css('position', 'inherit');
        }, 410);

        var FBURL = 'https://wolfscontests.firebaseio.com';
        var vm = this;

        vm.eventName = $stateParams.eventName;
        vm.gameName = $stateParams.gameName;

        vm.initGamePage = initGamePage;

        ///////////////////////////////

        function initGamePage() {

            var ref = new Firebase(FBURL);

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

                console.debug(vm.gameData);
                console.debug(vm.gameScores);
            });

        }

    }

})();