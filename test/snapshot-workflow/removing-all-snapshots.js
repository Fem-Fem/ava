import test from '@ava/test';

import * as exec from '../helpers/exec.js';

import {beforeAndAfter} from './helpers/macros.js';

test.serial(
	'Removing all snapshots from a test retains its data',
	beforeAndAfter,
	{
		cwd: exec.cwd('removing-all-snapshots'),
		expectChanged: false
	}
);

test.serial(
	'With --update-snapshots, removing all snapshots from a test removes the block',
	beforeAndAfter,
	{
		cwd: exec.cwd('removing-all-snapshots'),
		cli: ['--update-snapshots'],
		expectChanged: true
	}
);
