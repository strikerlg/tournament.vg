(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('AvatarController', AvatarController);

    /* @ngInject */
    function AvatarController($rootScope, $state, $stateParams, $timeout, Upload, imgur, profileService) {

        /* jshint validthis: true */
        var vm = this;
        vm.uploadAvatar = uploadAvatar;

        activate();

        ////////////////

        function activate() {
        	profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });

            // FIXME: This needs to be triggered by a $rootScope broadcast of when it receives profile data.
            $timeout(function() {
                profileService.getBadgesData($rootScope.profile.userName).then(function then(model) {
                    vm.badgesData = model;
                });
            }, 500);
        }

        function uploadAvatar() {

        	vm.disableButton = true;

        	imgur.setAPIKey('Client-ID f53d6d5833b07bc');
        	imgur.upload(vm.file).then(function then(model) {
        		profileService.saveAvatarLink(model[0].link, $rootScope.profile.userName);
        		Materialize.toast('Your avatar was uploaded', 4000);

        		$timeout(function() {
        			$state.go('home');
        		}, 1000);
        	});

        }

    }
})();