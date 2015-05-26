(function() {
    'use strict';

    angular
        .module('vg.app')
        .controller('AvatarController', AvatarController);

    /* @ngInject */
    function AvatarController($rootScope, $state, $stateParams, $timeout, Upload, imgur, profileService) {

        var vm = this;

        vm.initAvatar = initAvatar;
        vm.uploadAvatar = uploadAvatar;

        ////////////////

        function initAvatar() {
        	profileService.getAvatarData().then(function then(model) {
                vm.avatarData = model;
            });

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