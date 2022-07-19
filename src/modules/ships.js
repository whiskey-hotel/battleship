class Ships {
  constructor(position) {
    this.position = position;
    this.length = position.length;
    this.hitLocation = [];
    this.sunk = false;
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
