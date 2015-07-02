(function() {
    'use strict';

    angular
        .module('vg.app')
        .directive('vgShoutbox', vgShoutbox);

    /* @ngInject */
    function vgShoutbox () {
        var directive = {
            bindToController: true,
            controller: ShoutboxController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: './app/eventComponents/shoutbox.directive.htm',
            scope: false,
            transclude: false
        };
        return directive;
    }

    /* @ngInject */
    function ShoutboxController($scope, $firebaseArray, $timeout, $rootScope, eventService, FIREBASEDATA) {

        /* jshint validthis: true */
    	var vm = this;
		vm.postMessage = postMessage;

		activate();

		///////////////////

		function activate() {
			getShoutboxData();
		}

		function getShoutboxData() {

			var ref = new Firebase(FIREBASEDATA.FBURL);
        	vm.shoutboxData = $firebaseArray(
        		ref
        			.child('shoutbox')
        			.child('igby2')
        	);

        	vm.shoutboxData.$loaded().then(function() {
        		$timeout(function() {
        			$('.shoutbox-panel').scrollTop($('.shoutbox-panel')[0].scrollHeight);
        		}, 500);
        	});

		}

		function postMessage() {

			console.debug($scope.$parent.$parent.event.playerPool);

			var newMessage = {
				user: $rootScope.profile.userName,
				role: $scope.$parent.$parent.event.playerPool[$rootScope.profile.$id].status,
				message: vm.newMessage,
				team: $scope.$parent.$parent.event.playerPool[$rootScope.profile.$id].team
			};

			vm.shoutboxData.$add(newMessage).then(function() {

			});

		}

    }
})();