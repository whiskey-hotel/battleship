class Ships {
  constructor(length, position, hitLocation, sunk) {
    this.length = length;
    this.position = position;
    this.hitLocation = hitLocation;
    this.sunk = sunk;
  }

  hit(location) {
    if (this.position.includes(location)) {
      this.hitLocation.push(location);
      return [location, 'Hit!'];
    }
    return [location, 'Missed!'];
  }

  get isSunk() {
    if (this.position.length === this.hitLocation.length) this.sunk = true;
    return this.sunk;
  }
}

export default Ships;
