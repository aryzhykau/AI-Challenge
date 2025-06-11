class Player {
  constructor(board) {
    this.board = board;
    this.guesses = new Set();
  }

  makeGuess(row, col) {
    const guess = `${row}${col}`;
    if (this.guesses.has(guess)) {
      return 'guessed';
    }
    this.guesses.add(guess);
    return this.board.receiveGuess(row, col);
  }
}

class CPUPlayer extends Player {
  constructor(board) {
    super(board);
    this.mode = 'hunt';
    this.targetQueue = [];
    this.lastHit = null;
  }

  makeGuess() {
    let row, col;
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      ({ row, col } = this.targetQueue.shift());
      if (this.guesses.has(`${row}${col}`)) {
        return this.makeGuess();
      }
    } else {
      this.mode = 'hunt';
      do {
        row = Math.floor(Math.random() * this.board.size);
        col = Math.floor(Math.random() * this.board.size);
      } while (this.guesses.has(`${row}${col}`));
    }

    const result = super.makeGuess(row, col);

    if (result === 'hit' || result === 'sunk') {
      this.mode = 'target';
      this.lastHit = { row, col };
      this.addAdjacentToQueue(row, col);
      if (result === 'sunk') {
        this.targetQueue = [];
        this.mode = 'hunt';
      }
    }
    return { row, col, result };
  }

  addAdjacentToQueue(row, col) {
    const adjacent = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const { row: r, col: c } of adjacent) {
      if (
        r >= 0 &&
        r < this.board.size &&
        c >= 0 &&
        c < this.board.size &&
        !this.guesses.has(`${r}${c}`)
      ) {
        this.targetQueue.push({ row: r, col: c });
      }
    }
  }
}

module.exports = { Player, CPUPlayer }; 