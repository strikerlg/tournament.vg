describe('Event Service', function() {

	var eventService,
	    $httpBackend;

	beforeEach(function() {

		module('vg.app');

		inject(function(_eventService_) {
			eventService = _eventService_;
		});

	});

	// TODO
	it('can calculate the final standings of a multi-game event', function() {});

	// TODO
	it('can get an event\'s properties', function() {});

	// TODO
	it('can get all data related to a game in an event', function() {});

	// TODO
	it('can get a multi-game event\'s game list', function() {});

	// TODO
	it('can get the leaderboard for a multi-game event', function() {});

	// TODO
	it('can get the leaderboard for a single-game event', function() {});

	// TODO
	it('can get a specified player\'s scores in an event', function() {});

});