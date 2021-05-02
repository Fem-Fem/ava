import test from '@ava/test';

import * as exec from '../helpers/exec.js';

import {beforeAndAfter} from './helpers/macros.js';

test.serial(
	'Removing a test retains its data',
	beforeAndAfter,
	{
		cwd: exec.cwd('removing-test'),
		expectChanged: false
	}
);

test.serial(
	'With --update-snapshots, removing a test removes its block',
	beforeAndAfter,
	{
		cwd: exec.cwd('removing-test'),
		cli: ['--update-snapshots'],
		expectChanged: true
	}
);
