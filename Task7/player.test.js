const { Player, CPUPlayer } = require('player.js');
const { Board } = require('board.js');

describe('Player', () => {
  let player;
  let board;

  beforeEach(() => {
    board = new Board(10, 3, 3);
    player = new Player(board);
  });

  test('should be able to make a guess', () => {
    const result = player.makeGuess(0, 0);
    expect(result).toBe('miss');
    expect(player.guesses.has('00')).toBe(true);
  });

  test('should not allow guessing the same spot twice', () => {
    player.makeGuess(0, 0);
    const result = player.makeGuess(0, 0);
    expect(result).toBe('guessed');
  });
});

describe('CPUPlayer', () => {
  let cpuPlayer;
  let board;

  beforeEach(() => {
    board = new Board(10, 1, 3);
    cpuPlayer = new CPUPlayer(board);
  });

  test('should make a random guess in hunt mode', () => {
    const guess = cpuPlayer.makeGuess();
    expect(guess.result).toBeDefined();
    expect(cpuPlayer.guesses.has(`${guess.row}${guess.col}`)).toBe(true);
  });

  test('should switch to target mode after a hit', () => {
    board.grid[5][5] = 'S';
    board.ships.push({ locations: [{ row: 5, col: 5 }], hit: () => {}, isSunk: () => false });
    
    // Mock to force a hit at 5,5
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    cpuPlayer.makeGuess(); // This should hit at 5,5
    expect(cpuPlayer.mode).toBe('target');
    expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
  });

  test('should return to hunt mode after sinking a ship', () => {
    board.grid[5][5] = 'S';
    const ship = { locations: [{ row: 5, col: 5 }], hit: () => {}, isSunk: () => true };
    board.ships.push(ship);
    
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    cpuPlayer.makeGuess(); // This sinks the ship
    expect(cpuPlayer.mode).toBe('hunt');
    expect(cpuPlayer.targetQueue.length).toBe(0);
  });
}); 