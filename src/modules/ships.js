class Ships {
  constructor(position, type, length) {
    this.shipPosition = position;
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
    if (this.shipPosition.length === this.hitLocation.length) this.sunk = true;
    return this.sunk;
  }
}

export default Ships;
