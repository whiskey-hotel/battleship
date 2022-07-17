import Ships from './ships';

describe('Ships objects', () => {
  test('is hit', () => {
    const testShip = new Ships(3, 0, true);
    expect(testShip.hit()).toBeTruthy();
  });
});
