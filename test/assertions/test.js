import test from '@ava/test';

import * as exec from '../helpers/exec.js';

test('happy path', async t => {
	const result = await exec.fixture(['happy-path.js']);
	t.snapshot(result.stats.passed.map(({title}) => title));
});
