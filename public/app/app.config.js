(function() {
	'use strict';

	angular
		.module('vg.app')
		.constant('FBURL', 'https://wolfscontests.firebaseio.com')
		.config(config);

	/* @ngInject */
	function config($stateProvider, $urlRouterProvider) {

		// Redirect any unmatched URL to /.
		$urlRouterProvider.otherwise('/');

		$stateProvider
		    .state('index', {
		    	url: '/',

		    	views: {
		    		'header': {
		    			templateUrl: 'app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: 'app/home/home.htm',
		    			controller: 'HomeController as home'
		    		}
		    	}
		    })

		    .state('registerOrLogin', {
		    	url: '/registerOrLogin',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/home/reg.htm',
		    			controller: 'RegController as reg'
		    		}
		    	}
		    })

		    .state('profile', {
		    	url: '/profile/:username',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/home/profile.htm',
		    			controller: 'ProfileController as profile'
		    		}
		    	}
		    })

		    .state('leaderboard', {
		    	url: '/leaderboard',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/home/leaderboard.htm',
		    			controller: 'LeaderboardController as leaderboard'
		    		}
		    	}
		    })

		    .state('eventMain', {
		    	url: '/event/:eventName/main',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/event/main.htm',
		    			controller: 'EventMainController as event'
		    		}
		    	}
		    })

		    .state('customizeAvatar', {
		    	url: '/customizeAvatar',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/home/avatar.htm',
		    			controller: 'AvatarController as avatar'
		    		}
		    	},

		    	resolve: {
		    		'currentAuth': ['AuthWrapper', function(AuthWrapper) {
		    			return AuthWrapper.$requireAuth();
		    		}]
		    	}
		    })

		    .state('passwordChange', {
		    	url: '/passwordChange',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/home/passwordChange.htm',
		    			controller: 'PasswordChangeController as pwchange'
		    		}
		    	},

		    	resolve: {
		    		'currentAuth': ['AuthWrapper', function(AuthWrapper) {
		    			return AuthWrapper.$requireAuth();
		    		}]
		    	}
		    })

		    .state('eventGame', {
		    	url: '/event/:eventName/game/:gameName',

		    	views: {
		    		'header': {
		    			templateUrl: '/app/header/homeHeader.htm',
		    			controller: 'HeaderController as header',
		    			data: {
		    				headerType: 'tall'
		    			}
		    		},
		    		'content': {
		    			templateUrl: '/app/event/game.htm',
		    			controller: 'EventGameController as game'
		    		}
		    	}
		    });
	}
})();