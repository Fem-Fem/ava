'use strict';
const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const stripAnsi = require('strip-ansi');
const {test} = require('tap');
const {execCli} = require('../helper/cli');

test('timeout', t => {
	execCli(['long-running.js', '-T', '1s'], (err, stdout) => {
		t.ok(err);
		t.match(stdout, /Timed out/);
		t.end();
	});
});

// FIXME: This test fails in CI, but not locally. Re-enable at some point…
// test('interrupt', t => {
// 	const proc = execCli(['long-running.js'], (_, stdout) => {
// 		t.match(stdout, /SIGINT/);
// 		t.end();
// 	});
//
// 	setTimeout(() => {
// 		proc.kill('SIGINT');
// 	}, 2000);
// });

test('include anonymous functions in error reports', t => {
	execCli('error-in-anonymous-function.js', (err, stdout) => {
		t.ok(err);
		t.match(stdout, /error-in-anonymous-function\.js:4:8/);
		t.end();
	});
});

test('--match works', t => {
	execCli(['-m=foo', '-m=bar', '-m=!baz', '-m=t* a* f*', '-m=!t* a* n* f*', 'matcher-skip.js'], err => {
		t.error(err);
		t.end();
	});
});

for (const tapFlag of ['--tap', '-t']) {
	test(`${tapFlag} should produce TAP output`, t => {
		execCli([tapFlag, 'test.js'], {dirname: 'fixture/watcher'}, err => {
			t.ok(!err);
			t.end();
		});
	});
}

test('works when no files are found', t => {
	execCli([], {dirname: 'fixture/globs/no-files'}, (err, stdout) => {
		t.equal(err.code, 1);
		t.match(stdout, 'Couldn’t find any files to test');
		t.end();
	});
});

test('should warn ava is required without the cli', t => {
	childProcess.execFile(process.execPath, [path.resolve(__dirname, '../../entrypoints/main.cjs')], error => {
		t.ok(error);
		t.match(error.message, /Test files must be run with the AVA CLI/);
		t.end();
	});
});

test('tests without assertions do not fail if failWithoutAssertions option is set to false', t => {
	execCli([], {dirname: 'fixture/pkg-conf/fail-without-assertions'}, err => {
		t.error(err);
		t.end();
	});
});

test('--no-color disables formatting colors', t => {
	execCli(['--no-color', '--verbose', 'formatting-color.js'], (err, stdout) => {
		t.ok(err);
		t.equal(stripAnsi(stdout), stdout);
		t.end();
	});
});

test('--color enables formatting colors', t => {
	execCli(['--color', '--verbose', 'formatting-color.js'], (err, stdout) => {
		t.ok(err);
		t.not(stripAnsi(stdout), stdout);
		t.end();
	});
});

test('sets NODE_ENV to test when it is not set', t => {
	execCli('node-env-test.js', {env: {}}, (err, stdout) => {
		t.error(err);
		t.match(stdout, /1 test passed/);
		t.end();
	});
});

test('doesn’t set NODE_ENV when it is set', t => {
	execCli('node-env-foo.js', {env: {NODE_ENV: 'foo'}}, (err, stdout) => {
		t.error(err);
		t.match(stdout, /1 test passed/);
		t.end();
	});
});

test('additional arguments are forwarded to the worker', t => {
	execCli(['worker-argv.js', '--serial', '--', '--hello', 'world'], err => {
		t.error(err);
		t.end();
	});
});

test('reset-cache resets cache', t => {
	const cacheDir = path.join(__dirname, '..', 'fixture', 'reset-cache', 'node_modules', '.cache', 'ava');
	fs.mkdirSync(cacheDir, {recursive: true});
	fs.writeFileSync(path.join(cacheDir, 'file'), '');
	t.ok(fs.readdirSync(cacheDir).length > 0);

	execCli(['reset-cache'], {dirname: 'fixture/reset-cache'}, err => {
		t.error(err);
		t.ok(fs.readdirSync(cacheDir).length === 0);
		t.end();
	});
});

test('selects .cjs test files', t => {
	execCli('cjs.cjs', (err, stdout) => {
		t.error(err);
		t.match(stdout, /1 test passed/);
		t.end();
	});
});

test('load .mjs test files', t => {
	execCli('mjs.mjs', (err, stdout) => {
		t.error(err);
		t.match(stdout, /1 test passed/);
		t.end();
	});
});

test('load .js test files as ESM modules', t => {
	execCli('test.js', {dirname: 'fixture/pkg-type-module'}, (err, stdout) => {
		t.error(err);
		t.match(stdout, /1 test passed/);
		t.end();
	});
});
