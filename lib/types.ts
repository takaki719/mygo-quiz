export type Song = {
  title: string;
  reading: string;
  kanji: [string, string, string];
};

export type Question = {
  answerSong: Song;
  reading: string;
  correctKanji: string[];
  panels: string[];
};

export type PanelMode = "fixedFake9" | "allKanji";

export type GameConfig = {
  panelMode: PanelMode;
  fakeCount: number;
};
