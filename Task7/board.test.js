const { Board } = require('board.js');

describe('Board', () => {
  let board;
  const boardSize = 10;
  const numShips = 3;
  const shipLength = 3;

  beforeEach(() => {
    board = new Board(boardSize, numShips, shipLength);
  });

  test('should create a grid of the correct size', () => {
    expect(board.grid.length).toBe(boardSize);
    expect(board.grid[0].length).toBe(boardSize);
  });

  test('should place the correct number of ships', () => {
    board.placeShipsRandomly();
    expect(board.ships.length).toBe(numShips);
  });

  test('should correctly identify a hit', () => {
    board.grid[0][0] = 'S';
    const ship = { locations: [{ row: 0, col: 0 }], hit: jest.fn(), isSunk: () => false };
    board.ships.push(ship);
    expect(board.receiveGuess(0, 0)).toBe('hit');
    expect(board.grid[0][0]).toBe('X');
    expect(ship.hit).toHaveBeenCalled();
  });

  test('should correctly identify a miss', () => {
    expect(board.receiveGuess(0, 0)).toBe('miss');
    expect(board.grid[0][0]).toBe('O');
  });

  test('should identify a sunk ship', () => {
    board.grid[0][0] = 'S';
    const ship = {
      locations: [{ row: 0, col: 0 }],
      hit: jest.fn(),
      isSunk: () => true,
    };
    board.ships.push(ship);
    expect(board.receiveGuess(0, 0)).toBe('sunk');
  });

  test('should report all ships sunk', () => {
    board.placeShipsRandomly();
    for (const ship of board.ships) {
      jest.spyOn(ship, 'isSunk').mockReturnValue(true);
    }
    expect(board.allShipsSunk()).toBe(true);
  });

  test('should not allow ships to overlap', () => {
    // Manually place a ship
    board.grid[0][0] = 'S';
    board.grid[0][1] = 'S';
    board.grid[0][2] = 'S';

    // Attempt to place another ship that overlaps
    const canPlace = board.canPlaceShip(0, 0, 'horizontal');
    expect(canPlace).toBe(false);
  });
}); 