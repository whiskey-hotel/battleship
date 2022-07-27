import Ships from './ships';

class Gameboard {
  constructor() {
    this.allAttacks = [];
    this.missedAttacks = [];
    this.allShips = [];
  }

  addShip(position, ship, length) {
    this.allShips.push(new Ships(position, ship, length));
  }

  coordinateValidation(coordinates) {
    if (coordinates > 0 && coordinates < 100) return true;
    return false;
  }

  recieveAttack(attackCoordinates) {
    if (!this.coordinateValidation(attackCoordinates)) return 'Invalid Coordinates';

    if (!this.allAttacks.includes(attackCoordinates)) {
      this.allAttacks.push(attackCoordinates);
    } else {
      return 'Duplicate attack!';
    }

    let shipObjectResult = [];
    this.allShips.every((ship) => {
      shipObjectResult = ship.hit(attackCoordinates);
      if (shipObjectResult[1] === 'Hit!') {
        return false; // a break statement for 'every' array method
      }
      return true; // a continue statement for 'every' array method
    });

    if (shipObjectResult[1] === 'Missed!') this.missedAttacks.push(shipObjectResult[0]);
    return shipObjectResult;
  }

  allShipsSunk() {
    return this.allShips.every((ship) => ship.isSunk);
  }
}

export default Gameboard;
