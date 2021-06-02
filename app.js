/* create the following objects: game (module), gameBoard (module), 
displayController (module), player (factory) */

// Bonus: add aiController (module)


const Player = (name, mark) => {
    return { name, mark };
};

const gameBoard = (() => {
    const _board = new Array(9);

    const getBoard = () => {
        return _board;
    };

    const clear = () => {
        for (let i = 0; i < _board.length; ++i)
            _board[i] = '';
    };

    const isEmptySquare = (index) => {
        return !_board[index];
    };

    const getSquareValue = (index) => {
        return _board[index];
    };

    const setSquareValue = (index, mark) => {
        if (isEmptySquare(index)) {
            _board[index] = mark;
            return true;
        }
        else {
            return false;
        }
    };

    const isBoardFull = () => {
        for (let i = 0; i < _board.length; ++i)
            if (isEmptySquare(i)) {
                return false;
            }
            return true;
    };

    return {
        getBoard,
        clear,
        isEmptySquare,
        getSquareValue,
        setSquareValue,
        isBoardFull
    };
})();


const gameController = (() => {
    const _xPlayer = Player('Player', 'X');
    const _oPlayer = Player('Computer', 'O');
    let _currentPlayer = _xPlayer;
    let _inputDisabled = false;

    const resetGame = () => {
        _currentPlayer = _xPlayer;
        _inputDisabled = false;
        gameBoard.clear();
        _updateGameState();
    }

    const placeMark = (squareIndex) => {
        if (!gameBoard.isEmptySquare(squareIndex) || _inputDisabled) { // Square is already taken
            return;
        }
        gameBoard.setSquareValue(squareIndex, _currentPlayer.mark);
        _switchPlayer();
        _updateGameState();
    };

    const _updateGameState = () => {
        displayController.drawGameBoard(gameBoard.getBoard()); // Update gameboard
        displayController.setStatusMessage(_getGameStatus());
    };

    const _switchPlayer = () => {
        if (_currentPlayer === _xPlayer) {
            _currentPlayer = _oPlayer;
        }
        else {
            _currentPlayer = _xPlayer;
        }
    };

    const _getGameStatus = () => {
        // check if there's a winner
        const result = _checkThreeInARow();
        if (result) {
            _inputDisabled = true;
            return 'The winner is ' + result;
        }

        // check if there's a tie
        else if (gameBoard.isBoardFull()) {
            _inputDisabled = true;
            return 'It\'s a tie';
        }

        // Else the game is still running:
        return _currentPlayer.mark + '\'s turn...'
    };

    const _checkThreeInARow = () => {
        // This function returns the mark which has three in a row
        // Otherwise it returns false

        // Horizontal check
        for (let i = 0; i < 9; i +=3) {
            const mark = gameBoard.getSquareValue(i);
            if (mark && gameBoard.getSquareValue(i + 1) === mark && gameBoard.getSquareValue(i + 2) === mark) {
                return mark;
            }
        }

        // Vertical check
        for (let i = 0; i < 9; i++) {
            const mark = gameBoard.getSquareValue(i);
            if (mark && gameBoard.getSquareValue(i + 3) === mark && gameBoard.getSquareValue(i + 6) === mark) {
                return mark;
            }
        }

        // Diagonal check
        const mark = gameBoard.getSquareValue(4); // center square
        if (mark) {
            if (gameBoard.getSquareValue(0) === mark && gameBoard.getSquareValue(8) === mark) {
                return mark;
            }
            if (gameBoard.getSquareValue(2) === mark && gameBoard.getSquareValue(6) === mark) {
                return mark;
            }
        }

        // No three in a rows found
        return false;
    };

    return {
        resetGame,
        placeMark
    };
})();

const displayController = (() => {
    gameBoardSquares = document.querySelectorAll('.square');
    statusElement = document.getElementById('status');
    restartBtn = document.getElementById('restart');

    restartBtn.addEventListener('click', gameController.resetGame);

    gameBoardSquares.forEach((square, index) => {
        square.addEventListener('click', () => { gameController.placeMark(index) });
    });

    const setStatusMessage = (message) => {
        statusElement.innerText = message;
    };

    const clearStatusMessage = () => {
        statusElement.innerText = '';
    };

    const drawGameBoard = (board) => {
        for (let i = 0; i < board.length; i++) {
            gameBoardSquares[i].innerText = board[i] || '';
        }
    }

    return {
        drawGameBoard,
        setStatusMessage,
        clearStatusMessage
    };
})();



// Testing
// const testBoard = ['X', '', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];

gameController.resetGame();