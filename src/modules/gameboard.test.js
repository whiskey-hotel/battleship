import Gameboard from './gameboard';

describe('Gameboard objects', () => {
  const testGame = new Gameboard();
  testGame.addShip([3, 4, 5]);
  testGame.addShip([7, 8, 9]);
  testGame.addShip([10, 13, 16]);

  test('All ship objects should be saved to allShips property', () => {
    expect(testGame.allShips.length).toEqual(3);
  });

  test('All missed shots should save to missedShots property in Gameboard class', () => {
    testGame.recieveAttack(12);
    expect(testGame.missedShots).toEqual([12]);
  });

  test('An attack should read allShips and determine if the input attack coordinate hits a Ships position', () => {
    expect(testGame.recieveAttack(8)).toEqual([8, 'Hit!']);
  });
});
