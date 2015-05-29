(function() {
	'use strict';

	angular
		.module('vg.app')
		.constant('FIREBASEDATA', {
			'FBURL': 'https://wolfscontests.firebaseio.com'
		})
		.config(config);

	/* @ngInject */
	function config($stateProvider, $urlRouterProvider) {

		// Redirect any unmatched URL to /.
		$urlRouterProvider.otherwise('/');

		$stateProvider
		    .state('home', {
		    	url: '/',
		    	templateUrl: 'app/home/home.htm',
		    	controller: 'HomeController as home'
		    })

		    .state('registerOrLogin', {
		    	url: '/registerOrLogin',
		    	templateUrl: '/app/home/reg.htm',
		    	controller: 'RegController as reg'
		    })

		    .state('profile', {
		    	url: '/profile/:username',
		    	templateUrl: '/app/home/profile.htm',
		    	controller: 'ProfileController as profile'
		    })

		    .state('leaderboard', {
		    	url: '/leaderboard',
		    	templateUrl: '/app/home/leaderboard.htm',
		    	controller: 'LeaderboardController as leaderboard'
		    })

		    .state('event', {
		    	url: '/event/:eventName/main',
		    	templateUrl: '/app/event/main.htm',
		    	controller: 'EventMainController as event'
		    })

		    .state('customizeAvatar', {
		    	url: '/customizeAvatar',
		    	templateUrl: '/app/home/avatar.htm',
		    	controller: 'AvatarController as avatar',

		    	resolve: {
		    		'currentAuth': ['AuthWrapper', function(AuthWrapper) {
		    			return AuthWrapper.$requireAuth();
		    		}]
		    	}
		    })

		    .state('changePassword', {
		    	url: '/changePassword',
		    	templateUrl: '/app/home/changePassword.htm',
		    	controller: 'ChangePasswordController as pwchange',

		    	resolve: {
		    		'currentAuth': ['AuthWrapper', function(AuthWrapper) {
		    			return AuthWrapper.$requireAuth();
		    		}]
		    	}
		    });
	}
})();