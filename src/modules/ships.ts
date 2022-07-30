class Ships {
  shipPosition: number[];
  length: number;
  type: string;
  hitLocation: number[];
  sunk: boolean;

  constructor(shipPosition: number[], type: string, length: number) {
    this.shipPosition = shipPosition;
    this.length = length;
    this.type = type;
    this.hitLocation = [];
    this.sunk = false;
  }

  hit(attackCoordinates) {
    if (this.shipPosition.includes(attackCoordinates)) {
      this.hitLocation.push(attackCoordinates);
      return [attackCoordinates, 'Hit!'];
    }
    return [attackCoordinates, 'Missed!'];
  }

  get isSunk() {
    if (this.shipPosition.length === this.hitLocation.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
export default Ships;
