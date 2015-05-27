describe('Auth Service', function() {

	var authService,
	    $httpBackend;

	beforeEach(function() {

		module('vg.app');

		inject(function(_authService_) {
			authService = _authService_;
		});

	});

	it('has a function checkIfUserExists', function() {
		expect(angular.isFunction(authService.checkIfUserExists)).toBe(true);
	});

	// TODO
	it('can check if a user exists', function() {});

	// TODO
	it('can create a new user', function() {});

	// TODO
	it('can log a user in', function() {});

	// TODO
	it('can log a user out', function() {});

});