const sum = require('./fn.js');

test('add 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3);
});

test('add 3 + 3 not to equal 7',() => {
	expect(sum(3,3)).not.toBe(7);
});