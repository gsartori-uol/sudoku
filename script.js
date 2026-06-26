// ============================================
// Sudoku v1.2.0 | Released: Jun 26, 2026
// ============================================

let board = [];
let solution = [];
let selectedCell = null;
let timerInterval = null;
let seconds = 0;

// --- Theme System ---

const THEMES = {
    midnight: {
        '--bg': '#1a1b26',
        '--container': '#24283b',
        '--cell': '#2f3347',
        '--cell-hover': '#3b3f5c',
        '--accent': '#7aa2f7',
        '--accent-hover': '#5d8be6',
        '--text': '#c0caf5',
        '--text-muted': '#565f89',
        '--text-fixed': '#9aa5ce',
        '--border': '#3b4261',
        '--highlight': '#292e42',
        '--selected': '#33467c',
        '--error-bg': '#3d2026',
        '--error-text': '#f7768e',
        '--user-input': '#7dcfff'
    },
    ocean: {
        '--bg': '#1b2838',
        '--container': '#213243',
        '--cell': '#2a3f52',
        '--cell-hover': '#33495c',
        '--accent': '#4fc1e9',
        '--accent-hover': '#3aadd4',
        '--text': '#d4e5f7',
        '--text-muted': '#6b8fa3',
        '--text-fixed': '#a3c4d9',
        '--border': '#3a5568',
        '--highlight': '#243a4d',
        '--selected': '#2a4a60',
        '--error-bg': '#3d2530',
        '--error-text': '#ff6b7a',
        '--user-input': '#67d4a8'
    },
    forest: {
        '--bg': '#1e2a1e',
        '--container': '#263326',
        '--cell': '#2e3d2e',
        '--cell-hover': '#374737',
        '--accent': '#7bc67e',
        '--accent-hover': '#5fad62',
        '--text': '#d4e6d4',
        '--text-muted': '#6a8a6a',
        '--text-fixed': '#a3c4a3',
        '--border': '#3f5a3f',
        '--highlight': '#283828',
        '--selected': '#345834',
        '--error-bg': '#3d2525',
        '--error-text': '#e85d5d',
        '--user-input': '#a8d8ea'
    },
    sunset: {
        '--bg': '#2d2024',
        '--container': '#382830',
        '--cell': '#44303a',
        '--cell-hover': '#4f3944',
        '--accent': '#e8836d',
        '--accent-hover': '#d06b55',
        '--text': '#f0dcd8',
        '--text-muted': '#8a6b74',
        '--text-fixed': '#c9a8a0',
        '--border': '#5a4048',
        '--highlight': '#362530',
        '--selected': '#5a3545',
        '--error-bg': '#4a2020',
        '--error-text': '#ff7070',
        '--user-input': '#f0b86e'
    },
    lavender: {
        '--bg': '#262335',
        '--container': '#302b45',
        '--cell': '#3a3455',
        '--cell-hover': '#443e60',
        '--accent': '#b39ddb',
        '--accent-hover': '#9a82c4',
        '--text': '#e8e0f0',
        '--text-muted': '#7a6f8f',
        '--text-fixed': '#b8aed0',
        '--border': '#4a4368',
        '--highlight': '#2d2840',
        '--selected': '#45386b',
        '--error-bg': '#3d2030',
        '--error-text': '#f06292',
        '--user-input': '#80cbc4'
    }
};

function toggleThemePanel() {
    const panel = document.getElementById('themePanel');
    panel.hidden = !panel.hidden;
}

function applyPreset(name) {
    const theme = THEMES[name];
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
    });
    localStorage.setItem('sudoku-theme', name);
    localStorage.removeItem('sudoku-custom-theme');
    updateColorInputs(theme);
}

function applyCustomTheme() {
    const custom = {
        '--bg': document.getElementById('customBg').value,
        '--container': document.getElementById('customContainer').value,
        '--cell': document.getElementById('customCell').value,
        '--accent': document.getElementById('customAccent').value,
        '--text': document.getElementById('customText').value
    };

    // Derive other colors from the base ones
    custom['--cell-hover'] = lighten(custom['--cell'], 10);
    custom['--accent-hover'] = darken(custom['--accent'], 15);
    custom['--text-muted'] = blend(custom['--text'], custom['--bg'], 0.5);
    custom['--text-fixed'] = blend(custom['--text'], custom['--bg'], 0.3);
    custom['--border'] = lighten(custom['--container'], 15);
    custom['--highlight'] = blend(custom['--cell'], custom['--bg'], 0.5);
    custom['--selected'] = blend(custom['--accent'], custom['--cell'], 0.6);
    custom['--error-bg'] = '#44272b';
    custom['--error-text'] = '#ed4245';
    custom['--user-input'] = custom['--accent'];

    const root = document.documentElement;
    Object.entries(custom).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
    });
    localStorage.setItem('sudoku-custom-theme', JSON.stringify(custom));
    localStorage.removeItem('sudoku-theme');
}

function updateColorInputs(theme) {
    const map = {
        customBg: '--bg',
        customContainer: '--container',
        customCell: '--cell',
        customAccent: '--accent',
        customText: '--text'
    };
    Object.entries(map).forEach(([id, prop]) => {
        const el = document.getElementById(id);
        if (el && theme[prop]) el.value = theme[prop];
    });
}

function loadSavedTheme() {
    const customRaw = localStorage.getItem('sudoku-custom-theme');
    if (customRaw) {
        const custom = JSON.parse(customRaw);
        const root = document.documentElement;
        Object.entries(custom).forEach(([prop, value]) => {
            root.style.setProperty(prop, value);
        });
        updateColorInputs(custom);
        return;
    }
    const preset = localStorage.getItem('sudoku-theme');
    if (preset && THEMES[preset]) {
        applyPreset(preset);
    }
}

// Color utility helpers
function lighten(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function darken(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
    const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
    const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function blend(hex1, hex2, ratio) {
    const n1 = parseInt(hex1.replace('#', ''), 16);
    const n2 = parseInt(hex2.replace('#', ''), 16);
    const r = Math.round((n1 >> 16) * (1 - ratio) + (n2 >> 16) * ratio);
    const g = Math.round(((n1 >> 8) & 0xFF) * (1 - ratio) + ((n2 >> 8) & 0xFF) * ratio);
    const b = Math.round((n1 & 0xFF) * (1 - ratio) + (n2 & 0xFF) * ratio);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// --- Game Logic ---

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
loadSavedTheme();
buildNumpad();
newGame();
