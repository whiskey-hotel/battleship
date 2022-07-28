import Gameboard from './gameboard';

class Player {
  constructor(name) {
    this.player = name;
    this.fleet = { Carrier: 5, Battleship: 4, Destroyer: 3, Submarine: 3, PatrolBoat: 2 };
    this.playerBoard = new Gameboard();
  }

  setupBoard(ship, coordinates) {
    // while (this.playerBoard.allShips.length !== Object.keys(this.fleet).length) {
    // const ship = prompt('Which ship do you want to place?'); //
    // const coordinates = prompt('Where do you want to place the ship?'); //
    this.playerBoard.addShip(coordinates, ship, this.fleet[ship]);
    // }
  }

  attack(coordinates) {
    return this.playerBoard.recieveAttack(coordinates);
  }

  cpuAttack() {
    const MAX_NUMBER_BOARD_POSITIONS = 100;
    const generatedCoordinates = Math.floor(Math.random() * MAX_NUMBER_BOARD_POSITIONS);
    return this.playerBoard.recieveAttack(generatedCoordinates);
  }
}

export default Player;
