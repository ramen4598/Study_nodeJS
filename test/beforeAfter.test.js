/*
let num;

beforeEach(() => {
  num = 0;
});

test("0 + 1 =", () => {
  num += 1;
  expect(num).toBe(1);
});

test("0 + 1 =", () => {
  num += 1;
  expect(num).toBe(1);
});

describe("plus 2", () => {
  test("0 + 2 =", () => {
    num += 2;
    expect(num).toBe(2);
  });

  test("0 + 2 =", () => {
    num += 2;
    expect(num).toBe(2);
  });
});
*/
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});
