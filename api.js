'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.post('/api/check', (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check if all required fields are present
    if (!puzzle || !coordinate || !value) {
        return res.status(400).json({ error: 'Required field(s) missing' });
    }
    if (!/^[1-9.]+$/.test(puzzle)){
      return res.status(400).json({ error: 'Invalid characters in puzzle' });
    }
    if (puzzle.length !== 81) {
      return res.status(400).json({ error: 'Expected puzzle to be 81 characters long' });
    }
    // Validate the puzzle string
    if (puzzle.length !== 81 || !/^[1-9.]+$/.test(puzzle)) {
        return res.status(400).json({ error: 'Invalid puzzle string' });
    }

    // Validate the coordinate
    if (coordinate.length !== 2) {
        return res.status(400).json({ error: 'Invalid coordinate' });
    }

    const rowLetter = coordinate[0].toUpperCase();  // Extract the row letter
    const column = coordinate[1];  // Extract the column

    // Check if the row and column are valid
    const validRows = 'ABCDEFGHI';
    const validCols = '123456789';
    if (!validRows.includes(rowLetter) || !validCols.includes(column)) {
        return res.status(400).json({ error: 'Invalid coordinate' });
    }

    // Validate the value (must be between 1 and 9)
    if (!/^[1-9]$/.test(value)) {
        return res.status(400).json({ error: 'Invalid value' });
    }

    // Convert the row and column to zero-indexed values for further checking
    const row = validRows.indexOf(rowLetter);  // A -> 0, B -> 1, etc.
    const columnIdx = parseInt(column) - 1;

    // Check if the value is already placed at the coordinate
    const currentVal = puzzle[row * 9 + columnIdx];
    if (currentVal === value) {
        return res.json({ valid: true });
    }

    // Call validation methods from SudokuSolver
    const solver = new SudokuSolver();
    const rowConflict = !solver.checkRowPlacement(puzzle, row, columnIdx, value);
    const colConflict = !solver.checkColPlacement(puzzle, row, columnIdx, value);
    const regionConflict = !solver.checkRegionPlacement(puzzle, row, columnIdx, value);

    // Check for conflicts
    const conflicts = [];
    if (rowConflict) conflicts.push('row');
    if (colConflict) conflicts.push('column');
    if (regionConflict) conflicts.push('region');

    if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
    }

    // If no conflicts, return valid
    return res.json({ valid: true });
});


  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.status(400).json({ error: 'Required field missing' });
    }
    if (!/^[1-9.]+$/.test(puzzle)){
      return res.status(400).json({ error: 'Invalid characters in puzzle' });
    }
    if (puzzle.length !== 81) {
      return res.status(400).json({ error: 'Expected puzzle to be 81 characters long' });
    }
    if (!solver.validate(puzzle)) {
      return res.status(400).json({ error: 'Invalid puzzle' });
    }

    const solution = solver.solve(puzzle);
    if (solution) {
      return res.json({solution});
    } else {
      return res.status(400).json({ error: 'Puzzle cannot be solved' });
    }
  });
};
