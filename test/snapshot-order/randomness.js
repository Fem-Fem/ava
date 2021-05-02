import fs from 'fs';
import path from 'path';

import test from '@ava/test';

import * as exec from '../helpers/exec.js';

import getSnapshotIds from './helpers/get-snapshot-ids.js';

test('deterministic and sorted over a large, random test case', async t => {
	const options = {
		cwd: exec.cwd('randomness'),
		env: {
			AVA_FORCE_CI: 'not-ci'
		}
	};

	const snapshotPath = path.join(options.cwd, 'test.js.snap');
	const reportPath = path.join(options.cwd, 'test.js.md');

	// Run test
	await exec.fixture(['--update-snapshots'], options);

	// Assert snapshot is unchanged
	const snapshot = fs.readFileSync(snapshotPath);

	t.snapshot(snapshot, 'resulting snapshot in binary encoding');

	// Assert report is sorted
	const report = fs.readFileSync(reportPath);
	const ids = getSnapshotIds(report);

	t.deepEqual(ids, [...ids].sort((a, b) => a - b));
});
