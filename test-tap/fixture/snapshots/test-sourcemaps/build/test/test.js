const test = require('../../../../../../entrypoints/main.cjs');
test('test title', t => {
    t.snapshot({ foo: 'bar' });
    t.snapshot({ answer: 43 });
});
test('another test', t => {
    t.snapshot(new Map());
});
//# sourceMappingURL=test.js.map
