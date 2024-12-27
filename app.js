const initialBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

const WINNING_COMBINATIONS = [
    [{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }],
    [{ row: 1, column: 0 }, { row: 1, column: 1 }, { row: 1, column: 2 }],
    [{ row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 }],
    [{ row: 0, column: 0 }, { row: 1, column: 0 }, { row: 2, column: 0 }],
    [{ row: 0, column: 1 }, { row: 1, column: 1 }, { row: 2, column: 1 }],
    [{ row: 0, column: 2 }, { row: 1, column: 2 }, { row: 2, column: 2 }],
    [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }],
    [{ row: 0, column: 2 }, { row: 1, column: 1 }, { row: 2, column: 0 }]
];

let players = { X: 'Player 1', O: 'Player 2' };
let gameTurns = [];
let activePlayer = 'X';

function renderBoard() {
    const boardElement = document.querySelector('#game-board ol');
    boardElement.innerHTML = '';

    initialBoard.forEach((row, rowIndex) => {
        const rowElement = document.createElement('li');
        const rowList = document.createElement('ol');

        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = cell || '';
            button.disabled = !!cell;
            button.onclick = () => handleSelect(rowIndex, colIndex);
            cellElement.appendChild(button);
            rowList.appendChild(cellElement);
        });

        rowElement.appendChild(rowList);
        boardElement.appendChild(rowElement);
    });
}

function updateGameBoard() {
    initialBoard.forEach((row, rowIndex) => row.fill(null));

    gameTurns.forEach(turn => {
        const { row, col } = turn.square;
        initialBoard[row][col] = turn.player;
    });
}

function deriveWinner() {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const first = initialBoard[a.row][a.column];
        const second = initialBoard[b.row][b.column];
        const third = initialBoard[c.row][c.column];

        if (first && first === second && first === third) {
            return players[first];
        }
    }
    return null;
}

function handleSelect(rowIndex, colIndex) {
    gameTurns.unshift({ square: { row: rowIndex, col: colIndex }, player: activePlayer });
    updateGameBoard();

    const winner = deriveWinner();
    const hasDrawn = gameTurns.length === 9 && !winner;

    if (winner || hasDrawn) {
        document.querySelector('#game-over').style.display = 'block';
        document.querySelector('#game-result').textContent = winner ? `${winner} has won!` : "The game's a draw!";
    } else {
        activePlayer = activePlayer === 'X' ? 'O' : 'X';
        updateActivePlayerDisplay();
    }

    renderBoard();
    renderLog();
}

function renderLog() {
    const logElement = document.querySelector('#log');
    logElement.innerHTML = '';
    gameTurns.forEach(turn => {
        const logEntry = document.createElement('li');
        logEntry.textContent = `${turn.player} selected (${turn.square.row}, ${turn.square.col})`;
        logElement.appendChild(logEntry);
    });
}

function editPlayerName(symbol) {
    const playerNameElement = document.querySelector(`#player-${symbol}-name`);
    const newName = prompt(`Enter new name for ${symbol}:`, playerNameElement.textContent);
    if (newName) {
        players[symbol] = newName;
        playerNameElement.textContent = newName;
    }
}

function updateActivePlayerDisplay() {
    document.querySelector('#player-X').classList.toggle('active', activePlayer === 'X');
    document.querySelector('#player-O').classList.toggle('active', activePlayer === 'O');
}

function restartGame() {
    gameTurns = [];
    activePlayer = 'X';
    document.querySelector('#game-over').style.display = 'none';
    updateGameBoard();
    renderBoard();
    renderLog();
    updateActivePlayerDisplay();
}

// Initializing the game
updateGameBoard();
renderBoard();
updateActivePlayerDisplay();
document.querySelector('#game-over').style.display = 'none';