import path from 'path';

import figures from 'figures';
import {test} from 'tap';

import chalk from '../../lib/chalk.js';
import prefixTitle from '../../lib/reporters/prefix-title.js';

const sep = ' ' + chalk.gray.dim(figures.pointerSmall) + ' ';

test('removes base if found at start of path', t => {
	t.equal(prefixTitle(`test${path.sep}`, path.normalize('test/run-status.js'), 'title'), `run-status${sep}title`);
	t.end();
});

test('does not remove base if found but not at start of path', t => {
	t.equal(prefixTitle(path.sep, path.normalize('test/run-status.js'), 'title'), `test${sep}run-status${sep}title`);
	t.end();
});

test('removes .js extension', t => {
	t.equal(prefixTitle(path.sep, 'run-status.js', 'title'), `run-status${sep}title`);
	t.end();
});

test('does not remove .js from middle of path', t => {
	t.equal(prefixTitle(path.sep, 'run-.js-status.js', 'title'), `run-.js-status${sep}title`);
	t.end();
});

test('removes __tests__ from path', t => {
	t.equal(prefixTitle(path.sep, path.normalize('backend/__tests__/run-status.js'), 'title'), `backend${sep}run-status${sep}title`);
	t.end();
});

test('removes .spec from path', t => {
	t.equal(prefixTitle(path.sep, path.normalize('backend/run-status.spec.js'), 'title'), `backend${sep}run-status${sep}title`);
	t.end();
});

test('removes .test from path', t => {
	t.equal(prefixTitle(path.sep, path.normalize('backend/run-status.test.js'), 'title'), `backend${sep}run-status${sep}title`);
	t.end();
});

test('removes test- from path', t => {
	t.equal(prefixTitle(path.sep, path.normalize('backend/test-run-status.js'), 'title'), `backend${sep}run-status${sep}title`);
	t.end();
});
