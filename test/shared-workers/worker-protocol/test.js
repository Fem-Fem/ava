import test from '@ava/test';

import * as exec from '../../helpers/exec.js';

test('shared worker plugins work', async t => {
	const result = await exec.fixture();
	t.snapshot(result.stats.passed);
});
