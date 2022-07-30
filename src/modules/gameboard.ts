import { Ships, IShips } from './ships';

class Gameboard {
  allAttacks: number[];
  missedAttacks: number[];
  allShips: IShips[];
  gameBoardMinCoordinate: number;
  gameBoardMaxCoordinate: number;

  constructor() {
    this.allAttacks = [];
    this.missedAttacks = [];
    this.allShips = [];
    this.gameBoardMinCoordinate = 0;
    this.gameBoardMaxCoordinate = 100;
  }

  addShip(position: number[], ship: string, length: number) {
    this.allShips.push(new Ships(position, ship, length));
  }

  coordinateValidation(coordinates: number) {
    if (coordinates >= this.gameBoardMinCoordinate && coordinates < this.gameBoardMaxCoordinate) {
      return true;
    }
    return false;
  }

  duplicateAttackValidation(Coordinates: number) {
    if (!this.allAttacks.includes(Coordinates)) {
      this.allAttacks.push(Coordinates);
      return true;
    }
    return false;
  }

  recieveAttack(attackCoordinates: number) {
    if (!this.coordinateValidation(attackCoordinates)) return 'Invalid coordinates';
    if (!this.duplicateAttackValidation(attackCoordinates)) return 'Duplicate attack!';
    let shipObjectResult: [number, string];
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
