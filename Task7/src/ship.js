class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.locations = [];
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

module.exports = { Ship }; 