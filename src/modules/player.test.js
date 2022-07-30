import Player from './player';

describe('Player objects', () => {
  const testPlayer = new Player('Justin');
  test('Adding a player ship should be added to the gameboard', () => {
    testPlayer.setupBoard('Carrier', [0, 1, 2, 3, 4]);
    expect(testPlayer.playerBoard.allShips.length).toEqual(1);
  });
  test('The ship type and length should populate the ship class properties', () => {
    expect(testPlayer.playerBoard.allShips[0].type).toEqual('Carrier');
    expect(testPlayer.playerBoard.allShips[0].length).toEqual(5);
  });
  test('Attack function should hit ship if coordinates match position', () => {
    expect(testPlayer.attack(3)).toEqual([3, 'Hit!']);
  });
  test('Duplicate attackes will not attack', () => {
    expect(testPlayer.attack(3)).toEqual('Duplicate attack!');
  });
  test('Invalid coordinates will not attack', () => {
    expect(testPlayer.attack(101)).toEqual('Invalid coordinates');
    expect(testPlayer.attack('attack')).toEqual('Invalid coordinates');
    expect(testPlayer.attack(-1)).toEqual('Invalid coordinates');
  });
});
