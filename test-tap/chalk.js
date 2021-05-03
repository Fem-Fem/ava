import {test} from 'tap';

import chalk from '../lib/chalk.js';

test('throws an error when trying to access chalk config and chalk config is not configured', t => {
	t.throws(chalk.get, 'Chalk has not yet been configured');
	t.end();
});

test('throws an error when trying to set chalk config and chalk config is configured', t => {
	chalk.set({});
	t.throws(chalk.set, 'Chalk has already been configured');
	t.end();
});
