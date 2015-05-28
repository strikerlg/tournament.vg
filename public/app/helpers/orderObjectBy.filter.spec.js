describe('orderObjectBy filter', function() {

	beforeEach(function() {
		module('vg.app');
		bard.inject('$filter');
	});

	it('should sort objects by a specified property', function() {

		var sample = {
			'Test A': {score: 5},
			'Test B': {score: 15},
			'Test C': {score: 10}
		};

		var result = $filter('orderObjectBy')(sample, 'score', true);

		expect(result[0].score === 15 && result[2].score === 5).toBeTruthy();

	});

});