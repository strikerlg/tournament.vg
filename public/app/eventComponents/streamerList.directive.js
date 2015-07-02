(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgStreamerList', vgStreamerList);

    /* @ngInject */
    function vgStreamerList() {
        var directive = {
            bindToController: true,
            controller: StreamerListController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/streamerList.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function StreamerListController($scope, $http, $interval, $timeout, $firebaseArray, $firebaseObject, eventService, FIREBASEDATA) {
        /* jshint validthis: true */
    	var vm = this;

        vm.buildStreamerList = buildStreamerList;

        activate();

        //////////////////////

        function activate() {

            $timeout(function() {

                buildStreamerList();

            }, 2000);

        }

        function buildStreamerList() {

            var ref = new Firebase(FIREBASEDATA.FBURL);
            vm.activeStreamerList = [];

            vm.igby2PlayerPoolArray = $firebaseArray(
                ref
                    .child('contests')
                    .child('igby2')
                    .child('playerPool')
            );

            vm.activeStreamerList = [];
            vm.igby2PlayerPoolArray.$loaded().then(function() {

                // Iterate through the player pool and build the streamer list array.
                vm.igby2PlayerPoolArray.forEach(function(element) {

                    var playerRef = $firebaseObject(
                        ref
                            .child('users')
                            .child(element.$id)
                    );

                    playerRef.$loaded().then(function() {
                        if (playerRef.twitch) {

                            $http
                                .jsonp('https://api.twitch.tv/kraken/streams/' + playerRef.twitch + '?callback=JSON_CALLBACK')
                                .success(function(data) {

                                    // If there is stream data, the user must be live. Add them to our list to display.
                                    if (data.stream) {
                                        vm.activeStreamerList.push({
                                            userName: playerRef.userName,
                                            twitch: playerRef.twitch,
                                            team: element.team
                                        });
                                    }

                                });

                        }
                    });

                });

            });

        }


    }
})();