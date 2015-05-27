describe('Team Service', function() {

	var teamService,
	    $httpBackend;

	beforeEach(function() {

		module('vg.app');

		inject(function(_teamService_) {
			teamService = _teamService_;
		});

	});

	// TODO
	it('can add a new team to an event', function() {});

	// TODO
	it('can retrieve the team list of an event', function() {});

});