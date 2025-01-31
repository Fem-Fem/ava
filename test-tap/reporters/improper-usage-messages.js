'use strict';
require('../../lib/chalk').set();

const {test} = require('tap');
const improperUsageMessages = require('../../lib/reporters/improper-usage-messages');

test('results when nothing is applicable', t => {
	const err = {
		assertion: 'assertion',
		improperUsage: {
			name: 'VersionMismatchError',
			snapPath: 'path',
			snapVersion: 2,
			expectedVersion: 1
		}
	};

	const actualOutput = improperUsageMessages.forError(err);

	t.equal(actualOutput, null);
	t.end();
});
