import React, { useEffect, useState } from "react";

const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSolvable = (tiles: number[]) => {
  let countInversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
        countInversions++;
      }
    }
  }
  return countInversions % 2 === 0;
};

const isComplete = (tiles: number[]) => {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return true;
};

const App: React.FC = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let shuffledTiles;
    do {
      shuffledTiles = shuffleArray([...Array(16).keys()].map((i) => i + 1));
    } while (!isSolvable(shuffledTiles));
    setTiles(shuffledTiles);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf(16);
    const validMoves = [index - 1, index + 1, index - 4, index + 4];

    if (validMoves.includes(emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [
        newTiles[index],
        newTiles[emptyIndex],
      ];
      setTiles(newTiles);

      if (isComplete(newTiles)) {
        setEndTime(Date.now());
      }
    }
  };

  const autoSolve = () => {
    const solveStep = (tiles: number[], index: number): number[] => {
      const correctTile = index + 1;
      const currentIndex = tiles.indexOf(correctTile);
      const emptyIndex = tiles.indexOf(16);

      // Move the correct tile to the empty space
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[currentIndex]] = [
        newTiles[currentIndex],
        newTiles[emptyIndex],
      ];
      return newTiles;
    };

    let solvingTiles = [...tiles];
    for (let i = 0; i < 15; i++) {
      solvingTiles = solveStep(solvingTiles, i);
      setTiles(solvingTiles);
    }

    setEndTime(Date.now());
  };

  const renderTile = (tile: number, index: number) => (
    <div
      key={index}
      className={`tile ${tile === 16 ? "empty" : ""}`}
      onClick={() => handleTileClick(index)}
    >
      {tile !== 16 ? tile : ""}
    </div>
  );

  const renderBoard = () => {
    return (
      <div className="board">
        {tiles.map((tile, index) => renderTile(tile, index))}
      </div>
    );
  };

  const renderTime = () => {
    if (startTime && endTime) {
      const seconds = Math.floor((endTime - startTime) / 1000);
      return <div>Витрачений час: {seconds} секунд</div>;
    }
    return null;
  };

  return (
    <div className="App">
      <h1>Гра "П'ятнашки"</h1>
      {renderBoard()}
      <button onClick={startNewGame}>Нова гра</button>
      <button onClick={autoSolve}>Автоматично вирішити</button>
      {renderTime()}
      <style>{`
        .App {
          text-align: center;
        }
        .board {
          display: grid;
          grid-template-columns: repeat(4, 100px);
          grid-template-rows: repeat(4, 100px);
          gap: 5px;
          margin: 20px auto;
        }
        .tile {
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #61dafb;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          border: 2px solid #000;
        }
        .tile.empty {
          background-color: #fff;
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default App;
