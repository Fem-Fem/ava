'use strict';
require('../lib/chalk').set({level: 0});
require('../lib/worker/options').set({});

const {test} = require('tap');
const Test = require('../lib/test');

function ava(fn) {
	return new Test({
		contextRef: null,
		failWithoutAssertions: true,
		fn,
		metadata: {type: 'test'},
		title: '[anonymous]'
	});
}

function pass() {
	return new Promise(resolve => {
		setImmediate(resolve);
	});
}

function fail() {
	return new Promise((resolve, reject) => {
		setImmediate(() => {
			reject(new Error('unicorn'));
		});
	});
}

test('assertion plan is tested after returned promise resolves', t => {
	const start = Date.now();
	const instance = ava(a => {
		a.plan(2);

		a.pass();
		a.pass();

		return new Promise(resolve => {
			setTimeout(() => resolve(), 500);
		});
	});
	return instance.run().then(result => {
		t.equal(result.passed, true);
		t.equal(instance.planCount, 2);
		t.equal(instance.assertCount, 2);
		t.ok(Date.now() - start >= 500);
	});
});

test('missing assertion will fail the test', t => {
	return ava(a => {
		a.plan(2);

		return new Promise(resolve => {
			setTimeout(() => {
				a.pass();
				resolve();
			}, 200);
		});
	}).run().then(result => {
		t.equal(result.passed, false);
		t.equal(result.error.assertion, 'plan');
	});
});

test('extra assertion will fail the test', t => {
	return ava(a => {
		a.plan(2);

		setTimeout(() => {
			a.pass();
			a.pass();
		}, 200);

		return new Promise(resolve => {
			setTimeout(() => {
				a.pass();
				resolve();
			}, 500);
		});
	}).run().then(result => {
		t.equal(result.passed, false);
		t.equal(result.error.assertion, 'plan');
	});
});

test('assert pass', t => {
	const instance = ava(a => {
		return pass().then(() => {
			a.pass();
		});
	});
	return instance.run().then(result => {
		t.equal(result.passed, true);
		t.equal(instance.assertCount, 1);
	});
});

test('assert fail', t => {
	return ava(a => {
		return pass().then(() => {
			a.fail();
		});
	}).run().then(result => {
		t.equal(result.passed, false);
		t.equal(result.error.name, 'AssertionError');
	});
});

test('reject', t => {
	return ava(a => {
		return fail().then(() => {
			a.pass();
		});
	}).run().then(result => {
		t.equal(result.passed, false);
		t.equal(result.error.name, 'AssertionError');
		t.equal(result.error.message, 'Rejected promise returned by test');
		t.equal(result.error.values.length, 1);
		t.equal(result.error.values[0].label, 'Rejected promise returned by test. Reason:');
		t.match(result.error.values[0].formatted, /.*Error.*\n.*message: 'unicorn'/);
	});
});

test('reject with non-Error', t => {
	return ava(() => {
		return Promise.reject('failure'); // eslint-disable-line prefer-promise-reject-errors
	}).run().then(result => {
		t.equal(result.passed, false);
		t.equal(result.error.name, 'AssertionError');
		t.equal(result.error.message, 'Rejected promise returned by test');
		t.equal(result.error.values.length, 1);
		t.equal(result.error.values[0].label, 'Rejected promise returned by test. Reason:');
		t.match(result.error.values[0].formatted, /failure/);
	});
});
