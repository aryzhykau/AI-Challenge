const { Ship } = require('./ship.js');

class Board {
  constructor(size, numShips, shipLength) {
    this.size = size;
    this.numShips = numShips;
    this.shipLength = shipLength;
    this.grid = this.createGrid();
    this.ships = [];
  }

  createGrid() {
    const grid = [];
    for (let i = 0; i < this.size; i++) {
      grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        grid[i][j] = '~';
      }
    }
    return grid;
  }

  placeShipsRandomly() {
    let placedShips = 0;
    while (placedShips < this.numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let row, col;

      if (orientation === 'horizontal') {
        row = Math.floor(Math.random() * this.size);
        col = Math.floor(Math.random() * (this.size - this.shipLength + 1));
      } else {
        row = Math.floor(Math.random() * (this.size - this.shipLength + 1));
        col = Math.floor(Math.random() * this.size);
      }

      if (this.canPlaceShip(row, col, orientation)) {
        const newShip = new Ship(this.shipLength);
        for (let i = 0; i < this.shipLength; i++) {
          let current_row = row;
          let current_col = col;
          if (orientation === 'horizontal') {
            current_col += i;
          } else {
            current_row += i;
          }
          this.grid[current_row][current_col] = 'S';
          newShip.locations.push({ row: current_row, col: current_col });
        }
        this.ships.push(newShip);
        placedShips++;
      }
    }
  }

  canPlaceShip(row, col, orientation) {
    for (let i = 0; i < this.shipLength; i++) {
      let current_row = row;
      let current_col = col;
      if (orientation === 'horizontal') {
        current_col += i;
      } else {
        current_row += i;
      }
      if (
        current_row >= this.size ||
        current_col >= this.size ||
        this.grid[current_row][current_col] !== '~'
      ) {
        return false;
      }
    }
    return true;
  }

  receiveGuess(row, col) {
    const cell = this.grid[row][col];

    if (cell === 'S') {
      this.grid[row][col] = 'X';
      const ship = this.getShipAt(row, col);
      ship.hit();
      if (ship.isSunk()) {
        return 'sunk';
      }
      return 'hit';
    } else if (cell === '~') {
      this.grid[row][col] = 'O';
      return 'miss';
    } else {
      return 'guessed';
    }
  }

  getShipAt(row, col) {
    for (const ship of this.ships) {
      for (const location of ship.locations) {
        if (location.row === row && location.col === col) {
          return ship;
        }
      }
    }
    return null;
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

module.exports = { Board }; 