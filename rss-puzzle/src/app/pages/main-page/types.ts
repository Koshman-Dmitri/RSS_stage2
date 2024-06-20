type Sentence = {
  audioExample: string;
  id: number;
  textExample: string;
  textExampleTranslate: string;
  word: string;
  wordTranslate: string;
};

type LevelData = {
  author: string;
  cutSrc: string;
  id: string;
  imageSrc: string;
  name: string;
  year: string;
};

type Round = {
  levelData: LevelData;
  words: Sentence[];
};

export type Level = {
  rounds: Round[];
  roundsCount: number;
};

export type GameInfo = {
  curLevel: number;
  curRound: number;
  isAudioHint: boolean;
  isTranslateHint: boolean;
  isPictureHint: boolean;
  curSentenceNumber: number;
  complLevels: number[];
  complRounds: number[];
  known: string[][];
  unknown: string[][];
};

export type TouchStartPos = {
  x: number;
  y: number;
};
