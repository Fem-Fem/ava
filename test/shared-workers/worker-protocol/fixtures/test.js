import path from 'path';
import {fileURLToPath} from 'url';

import test from 'ava';

import declare from './_declare.js';
import plugin from './_plugin.js';

declare(fileURLToPath(import.meta.url));

test('test workers are released when they exit', async t => {
	for await (const message of plugin.subscribe()) {
		if ('cleanup' in message.data) {
			t.is(message.data.cleanup, path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'other.test.js'));
			return;
		}
	}
});
