describe('application routes', function() {

	describe('state', function() {

		var controller;
		var view = 'public/index.htm';

		beforeEach(function() {
			module('vg.app');
			bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
		});

		beforeEach(function() {
			$templateCache.put(view, '');
		});

		it('should map state home to url #/', function() {
			expect($state.href('home', {})).toBe('#/');
		});

		it('should map state registerOrLogin to url #/registerOrLogin', function() {
			expect($state.href('registerOrLogin', {})).toBe('#/registerOrLogin');
		});

		it('should map state profile to url #/profile/:username', function() {
			expect($state.href('profile', { username: 'WCopeland' })).toBe('#/profile/WCopeland');
		});

		it('should map state leaderboard to url #/leaderboard', function() {
			expect($state.href('leaderboard', {})).toBe('#/leaderboard');
		});

		it('should map state event to url #/event/:eventName/main', function() {
			expect($state.href('event', { eventName: 'igby2' })).toBe('#/event/igby2/main');
		});

		it('should map state customizeAvatar to url #/customizeAvatar', function() {
			expect($state.href('customizeAvatar', {})).toBe('#/customizeAvatar');
		});

		it('should map state changePassword to url #/changePassword', function() {
			expect($state.href('changePassword', {})).toBe('#/changePassword');
		});

	});

});