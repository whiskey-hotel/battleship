class Ships {
  constructor(length, hitLocation, isSunk) {
    this.length = length;
    this.hitLocation = hitLocation;
    this.isSunk = isSunk;
  }

  hit() {
    return this.isSunk;
  }

  get isSunk() {
    return this.isSunk;
  }
}

export default Ships;
