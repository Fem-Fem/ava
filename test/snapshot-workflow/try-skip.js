import test from '@ava/test';

import * as exec from '../helpers/exec.js';

import {beforeAndAfter} from './helpers/macros.js';

test.serial(
	't.snapshot.skip() in discarded t.try() doesn\'t copy over old value',
	beforeAndAfter,
	{
		cwd: exec.cwd('discard-skip'),
		cli: ['--update-snapshots'],
		expectChanged: true
	}
);

test.serial(
	't.snapshot.skip() in committed t.try() does copy over old value',
	beforeAndAfter,
	{
		cwd: exec.cwd('commit-skip'),
		cli: ['--update-snapshots'],
		expectChanged: false
	}
);
