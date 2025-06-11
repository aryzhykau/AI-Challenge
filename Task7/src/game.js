const readline = require('readline');
const { Board } = require('./board.js');
const { Player, CPUPlayer } = require('./player.js');

const boardSize = 10;
const numShips = 3;
const shipLength = 3;

class Game {
  constructor() {
    this.playerBoard = new Board(boardSize, numShips, shipLength);
    this.cpuBoard = new Board(boardSize, numShips, shipLength);
    this.player = new Player(this.cpuBoard);
    this.cpuPlayer = new CPUPlayer(this.playerBoard);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async startGame() {
    this.playerBoard.placeShipsRandomly();
    this.cpuBoard.placeShipsRandomly();
    this.printBoards();
    this.gameLoop();
  }

  printBoards() {
    console.log('\\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    const header = '  ' + [...Array(boardSize).keys()].join(' ');
    console.log(header + '     ' + header);

    for (let i = 0; i < boardSize; i++) {
      let rowStr = i + ' ';
      rowStr += this.cpuBoard.grid[i].join(' ').replace(/[S]/g, '~');
      rowStr += '    ' + i + ' ';
      rowStr += this.playerBoard.grid[i].join(' ');
      console.log(rowStr);
    }
    console.log('\\n');
  }

  async gameLoop() {
    while (true) {
      const answer = await this.askQuestion('Enter your guess (e.g., 00): ');
      if (this.handlePlayerGuess(answer)) {
        if (this.checkGameOver()) return;
        this.handleCpuTurn();
        if (this.checkGameOver()) return;
        this.printBoards();
      }
    }
  }

  handlePlayerGuess(guess) {
    if (guess === null || !/^[0-9]{2}$/.test(guess)) {
      console.log('Oops, input must be exactly two digits (e.g., 00, 34, 98).');
      return false;
    }
    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);
    const result = this.player.makeGuess(row, col);

    if (result === 'guessed') {
      console.log('You already guessed that location!');
      return false;
    } else if (result === 'hit') {
      console.log('PLAYER HIT!');
    } else if (result === 'sunk') {
      console.log('You sunk an enemy battleship!');
    } else {
      console.log('PLAYER MISS.');
    }
    return true;
  }

  handleCpuTurn() {
    console.log("\\n--- CPU's Turn ---");
    const { row, col, result } = this.cpuPlayer.makeGuess();
    if (result === 'hit') {
      console.log(`CPU HIT at ${row}${col}!`);
    } else if (result === 'sunk') {
      console.log(`CPU sunk your battleship at ${row}${col}!`);
    } else {
      console.log(`CPU MISS at ${row}${col}.`);
    }
  }

  checkGameOver() {
    if (this.cpuBoard.allShipsSunk()) {
      console.log(
        '\\n*** CONGRATULATIONS! You sunk all enemy battleships! ***',
      );
      this.printBoards();
      this.rl.close();
      return true;
    }
    if (this.playerBoard.allShipsSunk()) {
      console.log('\\n*** GAME OVER! The CPU sunk all your battleships! ***');
      this.printBoards();
      this.rl.close();
      return true;
    }
    return false;
  }

  askQuestion(query) {
    return new Promise((resolve) => this.rl.question(query, resolve));
  }
}

module.exports = Game; 