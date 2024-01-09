import React from "react";
import classnames from "classnames";
import type { Game, Word } from "./data";

const shuffleGame = (game: Game) => {
  const shuffledGame = [...game];
  for (let i = shuffledGame.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledGame[i], shuffledGame[j]] = [shuffledGame[j], shuffledGame[i]];
  }
  return shuffledGame;
};

interface AppProps {
  game: Game;
}

export const App: React.FC<AppProps> = ({ game }) => {
  const [solvedSets, setSolvedSets] = React.useState<Word["set"][]>([]);
  const [selectedTiles, setSelectedTiles] = React.useState<Word["text"][]>([]);
  const [shuffled, setShuffled] = React.useState(false);

  const handleSelectTile = (word: Word) => {
    // deselect if already selected
    if (selectedTiles.includes(word.text)) {
      const newSelectedTiles = selectedTiles.filter((w) => w !== word.text);
      setSelectedTiles(newSelectedTiles);
      return;
    }

    // don't allow more than 4 tiles to be selected
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
      <main>
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
      </main>

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
