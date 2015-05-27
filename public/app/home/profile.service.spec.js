describe('Profile Service', function() {

	var profileService,
	    $httpBackend;

	beforeEach(function() {

		module('vg.app');

		inject(function(_profileService_) {
			profileService = _profileService_;
		});

	});

	// TODO
	it('can retrieve the avatars object', function() {});

	// TODO
	it('can retrieve the badges object', function() {});

	// TODO
	it('can retrieve the tournament history of a specified user', function() {});

	// TODO
	it('can calculate the tournament standings of a specified user and their history', function() {});

	// TODO
	it('can get data binded to the user\'s personal user object', function() {});

});