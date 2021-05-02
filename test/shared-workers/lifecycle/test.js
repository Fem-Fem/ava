import test from '@ava/test';

import * as exec from '../../helpers/exec.js';

test('availability', async t => {
	await t.notThrowsAsync(exec.fixture(['available.js']));
});

test('teardown', async t => {
	const result = await exec.fixture('teardown.js');
	t.true(result.stderr.includes('TEARDOWN CALLED'));
});
