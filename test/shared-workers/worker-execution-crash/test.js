import test from '@ava/test';

import * as exec from '../../helpers/exec.js';

test('shared worker plugins work', async t => {
	const result = await t.throwsAsync(exec.fixture());
	t.snapshot(result.stats.passed);
	t.is(result.stats.sharedWorkerErrors[0].message, '🙈');
});
