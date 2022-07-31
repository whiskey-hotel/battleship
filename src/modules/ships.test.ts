import { Ships } from './ships';

describe('Ships objects', () => {
  const testShip = new Ships([3, 4, 5], 'Destroyer', 3);

  test('The ship will not be hit if a hit location is outside of the ship position array', () => {
    expect(testShip.hit(1)).toEqual([1, 'Missed!']);
  });

  test('The ship will be hit if a hit location is inside the ship position array', () => {
    expect(testShip.hit(4)).toEqual([4, 'Hit!']);
  });

  test('If the length of the hit location array is NOT equal to the length of the ship length, the ship is not sunk', () => {
    expect(testShip.isSunk()).toEqual(false);
  });

  test('If the length of the hit location array is equal to the length of the ship length, the ship is sunk', () => {
    testShip.hit(3);
    testShip.hit(5);
    expect(testShip.isSunk()).toEqual(true);
  });
});
