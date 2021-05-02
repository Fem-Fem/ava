import test from '@ava/test';

import * as exec from '../../helpers/exec.js';

test('opt-in is required', async t => {
	const result = await t.throwsAsync(exec.fixture());
	t.is(result.exitCode, 1);
	t.is(result.stats.uncaughtExceptions.length, 1);
	t.snapshot(result.stats.uncaughtExceptions[0].message);
});

