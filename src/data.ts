export type Word = {
  text: string;
  set: 0 | 1 | 2 | 3;
};

export type Game = Word[];

export const SAMPLE_GAME: Game = [
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
