import { useState, useEffect } from "react";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState("easy"); // Уровень сложности
  const winner = calculateWinner(board);

  useEffect(() => {
    if (!isXNext && !winner) {
      // Ход компьютера
      makeComputerMove();
    }
  }, [isXNext, winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return; // Игнорируем клики на занятые клетки или если игра окончена
    const newBoard = board.slice();
    newBoard[index] = 'X'; // Игрок всегда играет за 'X'
    setBoard(newBoard);
    setIsXNext(false); // Теперь ход компьютера
  };

  const makeComputerMove = () => {
    let newBoard = board.slice();
    if (difficulty === "easy") {
      // Легкий уровень: случайный ход
      const emptySquares = newBoard.map((value, index) => (value === null ? index : null)).filter(index => index !== null);
      if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        newBoard[emptySquares[randomIndex]] = 'O';
      }
    } else if (difficulty === "medium") {
      // Средний уровень: блокировка выигрыша игрока
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'O';
          if (calculateWinner(newBoard) === 'O') {
            setBoard(newBoard);
            setIsXNext(true);
            return;
          }
          newBoard[i] = null;
        }
      }
      // Если не было возможности блокировать, случайный ход
      const emptySquares = newBoard.map((value, index) => (value === null ? index : null)).filter(index => index !== null);
      if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        newBoard[emptySquares[randomIndex]] = 'O';
      }
    } else if (difficulty === "hard") {
      // Сложный уровень: минимакс алгоритм
      const bestMove = findBestMove(newBoard);
      if (bestMove !== null) {
        newBoard[bestMove] = 'O';
      }
    }
    setBoard(newBoard);
    setIsXNext(true); // Теперь снова ход игрока
  };

  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null; // Отменяем ход
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    const scores = {
      X: -1,
      O: 1,
      tie: 0,
    };
    const result = calculateWinner(board);
    if (result) {
      return scores[result];
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game">
      <h1>Крестики-нолики</h1>
      <div className="difficulty-selection">
        <label>
          Уровень сложности:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </label>
      </div>
      <div className="status">
        {winner ? `Победитель: ${winner}` : `Следующий ход: ${isXNext ? 'X' : 'O'}`}
      </div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button className="reset-button" onClick={resetGame}>Сбросить игру</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
