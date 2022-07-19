import Ships from './ships';

class Gameboard {
  constructor() {
    this.missedShots = [];
    this.allShips = [];
  }

  addShip(position) {
    this.allShips.push(new Ships(position));
  }

  recieveAttack(guessInputLocation) {
    let value = [];
    this.allShips.every((ship) => {
      value = ship.hit(guessInputLocation);
      if (value[1] === 'Hit!') {
        return false; // a break statement for 'every' array method
      }
      return true; // a continue statement for 'every' array method
    });

    if (value[1] === 'Missed!' && !this.missedShots.includes(value[0])) this.missedShots.push(value[0]);
    return value;
  }
}

export default Gameboard;
