import Ships from './ships';

class Gameboard {
  constructor() {
    this.allAttacks = [];
    this.missedAttacks = [];
    this.allShips = [];
  }

  addShip(position) {
    this.allShips.push(new Ships(position));
  }

  recieveAttack(attackCoordinates) {
    if (!this.allAttacks.includes(attackCoordinates)) {
      this.allAttacks.push(attackCoordinates);
    } else {
      return 'Duplicate attack!';
    }

    let value = [];
    this.allShips.every((ship) => {
      value = ship.hit(attackCoordinates);
      if (value[1] === 'Hit!') {
        return false; // a break statement for 'every' array method
      }
      return true; // a continue statement for 'every' array method
    });

    if (value[1] === 'Missed!') this.missedAttacks.push(value[0]);
    return value;
  }

  allShipsSunk() {
    return this.allShips.every((ship) => ship.isSunk);
  }
}

export default Gameboard;
