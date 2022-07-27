import Player from './player';

describe('Player objects', () => {
  const testPlayer = new Player('Justin');

  test('All methods interact with other methods', () => {
    expect(testPlayer.player).toEqual('Justin');
  });
});
