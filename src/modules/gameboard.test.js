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
    testGame.recieveAttack(1);
    testGame.recieveAttack(12);
    testGame.recieveAttack(5);
    expect(testGame.missedShots).toEqual([1, 12]);
  });

  test('An attack should read allShips and determine if the input attack coordinate hits a Ships position', () => {
    expect(testGame.recieveAttack(8)).toEqual([8, 'Hit!']);
  });

  test('Check if all your ships have sunk', () => {
    testGame.recieveAttack(3);
    testGame.recieveAttack(4);
    testGame.recieveAttack(5);
    testGame.recieveAttack(7);
    testGame.recieveAttack(8);
    testGame.recieveAttack(9);
    testGame.recieveAttack(10);
    testGame.recieveAttack(13);
    testGame.recieveAttack(16);
    expect(testGame.allShipsSunk()).toEqual(true);
  });
});
