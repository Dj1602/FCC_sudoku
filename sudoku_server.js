class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) return false;
    if (!/^[1-9.]+$/.test(puzzleString)) return false;
    return true;
  }
  

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let col = 0; col < 9; col++) {
      if (puzzleString[start + col] === value) {
        return false; // Conflict in row
      }
    }
    return true;
  }
  

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (puzzleString[column + r * 9] === value) {
        return false; // Conflict in column
      }
    }
    return true;
  }
  

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r !== row || c !== column) {
          if (puzzleString[r * 9 + c] === value) {
            return false; // Conflict in region
          }
        }
      }
    }
    return true;
  }
  

  solve(puzzleString) {
    if (!this.validate(puzzleString)) return false;
    
    const puzzle = puzzleString.split('');
    
    const solvePuzzle = () => {
      const emptySpot = puzzle.indexOf('.');
      if (emptySpot === -1) return true; // Puzzle solved
      
      const row = Math.floor(emptySpot / 9);
      const col = emptySpot % 9;
      
      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, row, col, value) &&
          this.checkColPlacement(puzzle, row, col, value) &&
          this.checkRegionPlacement(puzzle, row, col, value)
        ) {
          puzzle[emptySpot] = value;
          
          if (solvePuzzle()) return true; // Continue solving
          
          puzzle[emptySpot] = '.'; // Backtrack
        }
      }
      return false; // No solution found
    };
    
    return solvePuzzle() ? puzzle.join('') : false;
  }
  
}

module.exports = SudokuSolver;

