'use strict';
require('../lib/chalk').set({level: 1});

const fs = require('fs');
const tempWrite = require('temp-write');
const {Instance: ChalkInstance} = require('chalk'); // eslint-disable-line unicorn/import-style
const {test} = require('tap');
const codeExcerpt = require('../lib/code-excerpt');

const chalk = new ChalkInstance({level: 1});

test('read code excerpt', t => {
	const file = tempWrite.sync([
		'function a() {',
		'\talert();',
		'}'
	].join('\n'));

	const excerpt = codeExcerpt({file, line: 2, isWithinProject: true, isDependency: false});
	const expected = [
		` ${chalk.grey('1:')} function a() {`,
		chalk.bgRed(' 2:   alert();    '),
		` ${chalk.grey('3:')} }             `
	].join('\n');

	t.equal(excerpt, expected);
	t.end();
});

test('truncate lines', t => {
	const file = tempWrite.sync([
		'function a() {',
		'\talert();',
		'}'
	].join('\n'));

	const excerpt = codeExcerpt({file, line: 2, isWithinProject: true, isDependency: false}, {maxWidth: 14});
	const expected = [
		` ${chalk.grey('1:')} functio…`,
		chalk.bgRed(' 2:   alert…'),
		` ${chalk.grey('3:')} }       `
	].join('\n');

	t.equal(excerpt, expected);
	t.end();
});

test('format line numbers', t => {
	const file = tempWrite.sync([
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'',
		'function a() {',
		'\talert();',
		'}'
	].join('\n'));

	const excerpt = codeExcerpt({file, line: 10, isWithinProject: true, isDependency: false});
	const expected = [
		` ${chalk.grey(' 9:')} function a() {`,
		chalk.bgRed(' 10:   alert();    '),
		` ${chalk.grey('11:')} }             `
	].join('\n');

	t.equal(excerpt, expected);
	t.end();
});

test('noop if file cannot be read', t => {
	const file = tempWrite.sync('');
	fs.unlinkSync(file);

	const excerpt = codeExcerpt({file, line: 10, isWithinProject: true, isDependency: false});
	t.equal(excerpt, null);
	t.end();
});

test('noop if file is not within project', t => {
	const excerpt = codeExcerpt({isWithinProject: false, file: __filename, line: 1});
	t.equal(excerpt, null);
	t.end();
});

test('noop if file is a dependency', t => {
	const excerpt = codeExcerpt({isWithinProject: true, isDependency: true, file: __filename, line: 1});
	t.equal(excerpt, null);
	t.end();
});
