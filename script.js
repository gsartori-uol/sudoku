let board = [];
let solution = [];
let selectedCell = null;
let timerInterval = null;
let seconds = 0;

function generateSolution() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(grid, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === num) return false;
            }
        }
        return true;
    }

    function fill(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (const num of nums) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (fill(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fill(grid);
    return grid;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createPuzzle(solution, difficulty) {
    const puzzle = solution.map(row => [...row]);
    const removals = { easy: 30, medium: 40, hard: 55 };
    let count = removals[difficulty] || 40;

    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            count--;
        }
    }
    return puzzle;
}

function newGame() {
    const difficulty = document.getElementById('difficulty').value;
    solution = generateSolution();
    board = createPuzzle(solution, difficulty);
    selectedCell = null;
    document.getElementById('status').textContent = '';
    renderBoard();
    startTimer();
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}`);

            if (board[row][col] !== 0) {
                cell.textContent = board[row][col];
                cell.classList.add('fixed');
            }

            // Add box border classes
            if (col === 2 || col === 5) cell.classList.add('border-right');
            if (row === 2 || row === 5) cell.classList.add('border-bottom');

            cell.addEventListener('click', () => selectCell(row, col));
            boardEl.appendChild(cell);
        }
    }
}

function selectCell(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(c => c.classList.remove('selected', 'highlight'));

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell.classList.contains('fixed')) return;

    selectedCell = { row, col };
    cell.classList.add('selected');

    // Highlight same row, col, and box
    cells.forEach(c => {
        const r = parseInt(c.dataset.row);
        const cCol = parseInt(c.dataset.col);
        if (r === row || cCol === col ||
            (Math.floor(r / 3) === Math.floor(row / 3) &&
             Math.floor(cCol / 3) === Math.floor(col / 3))) {
            if (r !== row || cCol !== col) {
                c.classList.add('highlight');
            }
        }
    });
}

function placeNumber(num) {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (num === 0) {
        cell.textContent = '';
        cell.classList.remove('user-input', 'error');
        board[row][col] = 0;
    } else {
        cell.textContent = num;
        cell.classList.add('user-input');
        cell.classList.remove('error');
        board[row][col] = num;

        if (num !== solution[row][col]) {
            cell.classList.add('error');
        }
    }

    // Check win
    if (JSON.stringify(board) === JSON.stringify(solution)) {
        clearInterval(timerInterval);
        document.getElementById('status').textContent = '🎉 Congratulations! Puzzle solved!';
    }
}

function checkSolution() {
    let hasErrors = false;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (board[row][col] !== 0 && board[row][col] !== solution[row][col]) {
            cell.classList.add('error');
            hasErrors = true;
        } else {
            cell.classList.remove('error');
        }
    });

    const status = document.getElementById('status');
    if (hasErrors) {
        status.textContent = '❌ There are errors in your solution.';
    } else if (JSON.stringify(board) === JSON.stringify(solution)) {
        status.textContent = '🎉 Congratulations! Puzzle solved!';
        clearInterval(timerInterval);
    } else {
        status.textContent = '✓ No errors so far. Keep going!';
    }
}

function solvePuzzle() {
    board = solution.map(row => [...row]);
    renderBoard();
    clearInterval(timerInterval);
    document.getElementById('status').textContent = 'Puzzle solved automatically.';
}

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
}

// Build numpad
function buildNumpad() {
    const numpad = document.getElementById('numpad');
    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.setAttribute('aria-label', `Place number ${i}`);
        btn.addEventListener('click', () => placeNumber(i));
        numpad.appendChild(btn);
    }
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '✕';
    clearBtn.setAttribute('aria-label', 'Clear cell');
    clearBtn.addEventListener('click', () => placeNumber(0));
    numpad.appendChild(clearBtn);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        placeNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        placeNumber(0);
    }
});

// Initialize
buildNumpad();
newGame();
