import React from "react";
import ReactDOM from "react-dom/client";
import classnames from "classnames";
import "./index.css";

type Word = {
  text: string;
  set: 0 | 1 | 2 | 3;
};

type Game = Word[];

const SAMPLE_GAME: Game = [
  { text: "apple", set: 0 },
  { text: "banana", set: 0 },
  { text: "orange", set: 0 },
  { text: "pear", set: 0 },
  { text: "cat", set: 1 },
  { text: "dog", set: 1 },
  { text: "fish", set: 1 },
  { text: "bird", set: 1 },
  { text: "car", set: 2 },
  { text: "bus", set: 2 },
  { text: "train", set: 2 },
  { text: "plane", set: 2 },
  { text: "red", set: 3 },
  { text: "blue", set: 3 },
  { text: "green", set: 3 },
  { text: "yellow", set: 3 },
];

const shuffleGame = (game: Game) => {
  const shuffledGame = [...game];
  for (let i = shuffledGame.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledGame[i], shuffledGame[j]] = [shuffledGame[j], shuffledGame[i]];
  }
  return shuffledGame;
};

const App: React.FC<{ game: Game }> = ({ game }) => {
  const [solvedSets, setSolvedSets] = React.useState<Word["set"][]>([]);
  const [selectedTiles, setSelectedTiles] = React.useState<string[]>([]);
  const [shuffled, setShuffled] = React.useState(false);

  const handleSelectTile = (word: Word) => {
    if (selectedTiles.includes(word.text)) {
      const newSelectedTiles = selectedTiles.filter((w) => w !== word.text);
      setSelectedTiles(newSelectedTiles);
      return;
    }

    if (selectedTiles.length >= 4) {
      return;
    }

    const newSelectedTiles = [...selectedTiles, word.text];
    if (
      newSelectedTiles.length === 4 &&
      new Set(newSelectedTiles.map((w) => game.find((g) => g.text === w)?.set))
        .size === 1
    ) {
      setSolvedSets([...solvedSets, word.set]);
      setSelectedTiles([]);
      return;
    }
    setSelectedTiles(newSelectedTiles);
  };

  // now divide the game into solved and unsolved sets
  const gameSets = React.useMemo(() => {
    const solved = game.filter((word) => solvedSets.includes(word.set));
    const unSolved = shuffleGame(
      game.filter((word) => !solvedSets.includes(word.set))
    );

    return { solved, unSolved };
    // including the shuffled bool is kind of a cheat to force the game to re-shuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, solvedSets, shuffled]);

  return (
    <>
      <div className="board">
        {gameSets.solved.map((word) => (
          <button
            key={word.text}
            disabled
            className={classnames("tile", "solved")}
          >
            {word.text}
          </button>
        ))}

        {gameSets.unSolved.map((word) => (
          <button
            key={word.text}
            className={classnames(
              "tile",
              selectedTiles.includes(word.text) ? "selected" : ""
            )}
            onClick={() => handleSelectTile(word)}
          >
            {word.text}
          </button>
        ))}
      </div>

      <footer>
        {solvedSets.length === 4 ? (
          <h1>You win!</h1>
        ) : (
          <button id="shuffle" onClick={() => setShuffled(!shuffled)}>
            Shuffle
          </button>
        )}
      </footer>
    </>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App game={SAMPLE_GAME} />
  </React.StrictMode>
);
