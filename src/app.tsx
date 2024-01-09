import React from "react";
import classnames from "classnames";
import type { Game, Word } from "./data";
import shuffle from "lodash/shuffle";
import partition from "lodash/partition";

interface AppProps {
  game: Game;
}

export const App: React.FC<AppProps> = ({ game }) => {
  const [solvedSets, setSolvedSets] = React.useState<Word["set"][]>([]);
  const [selectedWords, setSelectedWords] = React.useState<Word["text"][]>([]);
  const [shuffled, setShuffled] = React.useState(false);

  const handleSelectTile = (word: Word) => {
    // deselect if already selected
    if (selectedWords.includes(word.text)) {
      const newSelectedTiles = selectedWords.filter((w) => w !== word.text);
      setSelectedWords(newSelectedTiles);
      return;
    }

    // don't allow more than 4 words to be selected
    if (selectedWords.length >= 4) {
      return;
    }

    const newSelectedWords = [...selectedWords, word.text];
    const selectedSets = new Set(
      newSelectedWords.map((w) => game.find((g) => g.text === w)?.set)
    );

    if (newSelectedWords.length === 4 && selectedSets.size === 1) {
      setSolvedSets([...solvedSets, word.set]);
      setSelectedWords([]);
      return;
    }
    setSelectedWords(newSelectedWords);
  };

  // now divide the game into solved and unsolved sets
  const gameSets = React.useMemo(() => {
    const [solved, unsolved] = partition(game, (word) =>
      solvedSets.includes(word.set)
    );

    return { solved, unsolved: shuffle(unsolved) };
    // including the shuffled bool is a cheat to force the game to re-shuffle
    // this is not Good React™️ but here we are
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

        {gameSets.unsolved.map((word) => (
          <button
            key={word.text}
            className={classnames(
              "tile",
              selectedWords.includes(word.text) ? "selected" : ""
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
