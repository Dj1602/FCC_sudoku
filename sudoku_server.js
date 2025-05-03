const puzzlesAndSolutions = require('./puzzle-strings');

class SudokuSolver {
  validateInputs(row, column, value) {
    const isRowValid = /^[A-Ia-i]$/.test(row);
    const isColValid = Number.isInteger(column) && column >= 0 && column <= 8;
    const isValueValid = /^[1-9]$/.test(value);
    return isRowValid && isColValid && isValueValid;
  }

  validate(puzzleString) {
    if (typeof puzzleString !== 'string') {
      return { error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return false;
    }
    const validFormat = /^[1-9.]+$/;
    if (!validFormat.test(puzzleString)) {
      return false;
    }
    return true;
  }

  validateCoordinate(coordinate) {
    return /^[A-Ia-i][1-9]$/.test(coordinate);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (!this.validateInputs(row, column, value)) return false;
    const validation = this.validate(puzzleString);
    if (validation !== true) return false;

    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const start = rowIndex * 9;
    const rowValues = puzzleString.slice(start, start + 9);

    return rowValues[column] === value || !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (!this.validateInputs(row, column, value)) return false;
    const validation = this.validate(puzzleString);
    if (validation !== true) return false;

    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;

    for (let r = 0; r < 9; r++) {
      const index = r * 9 + column;
      const cell = puzzleString[index];
      if (cell === value && r !== rowIndex) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (!this.validateInputs(row, column, value)) return false;
    const validation = this.validate(puzzleString);
    if (validation !== true) return false;

    const rowIndex = row.toUpperCase().charCodeAt(0) - 65;
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currentRow = startRow + r;
        const currentCol = startCol + c;
        const index = currentRow * 9 + currentCol;

        // Skip the current cell being checked
        if (currentRow === rowIndex && currentCol === column) continue;

        if (puzzleString[index] === value) {
          return false;
        }
      }
    }
    return true;
  }


  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    const solveRecursive = (puzzle) => {
      const emptyIndex = puzzle.indexOf('.');
      if (emptyIndex === -1) return puzzle;

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;
      const rowLetter = String.fromCharCode(65 + row);

      for (let num = 1; num <= 9; num++) {
        const value = String(num);

        if (this.checkRowPlacement(puzzle, rowLetter, col, value) && this.checkColPlacement(puzzle, rowLetter, col, value) && this.checkRegionPlacement(puzzle, rowLetter, col, value)) {
          const newPuzzle = puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);

          const result = solveRecursive(newPuzzle);
          if (result) return result;
        }
      }
      return false;
    }
    return solveRecursive(puzzleString);
  }
}

module.exports = SudokuSolver;

