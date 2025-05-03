'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // 1. Check for missing fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // 2. Validate puzzle string characters
      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      // 3. Validate puzzle length
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      // 4. Validate coordinate (e.g., A1–I9)
      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // 5. Validate value (must be 1–9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Parse coordinate to row and column
      const row = coordinate[0].toUpperCase();
      const column = parseInt(coordinate[1], 10) - 1;

      const conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      res.json({ valid: true });
    });
    
    app.post('/api/solve', (req, res) => {
      const { puzzle } = req.body;
    
      // 1. Check for missing field
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
    
      // 2. Validate characters
      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }
    
      // 3. Validate length
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
    
      // 4. Attempt to solve
      const solution = solver.solve(puzzle);
    
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      } else {
        res.json({ solution });
      }
    });
};
