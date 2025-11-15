import { Song, Question, GameConfig } from "./types";

/**
 * Hit & Blow判定関数
 */
export const judgeHitBlow = (answer: string[], guess: string[]) => {
  let hit = 0;
  const answerRemain: string[] = [];
  const guessRemain: string[] = [];

  // 1. ヒット判定
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === guess[i]) {
      hit++;
    } else {
      answerRemain.push(answer[i]);
      guessRemain.push(guess[i]);
    }
  }

  // 2. ブロウ判定
  let blow = 0;
  const used = new Array(answerRemain.length).fill(false);
  for (const g of guessRemain) {
    const idx = answerRemain.findIndex((a, i) => !used[i] && a === g);
    if (idx !== -1) {
      blow++;
      used[idx] = true;
    }
  }

  return { hit, blow };
};

/**
 * 問題生成関数
 */
export const createQuestion = (
  songs: Song[],
  config: GameConfig,
  bannedKanji: string[] = []
): Question => {
  const answerSong = songs[Math.floor(Math.random() * songs.length)];
  const correctKanji = [...answerSong.kanji];

  const allKanjiPool = Array.from(
    new Set(songs.flatMap((s) => s.kanji))
  );

  // BAN済み漢字を除外
  const availableKanjiPool = allKanjiPool.filter(
    (k) => !bannedKanji.includes(k)
  );

  const fakeCandidates = availableKanjiPool.filter(
    (k) => !correctKanji.includes(k)
  );

  let panelKanji: string[];

  // モードによる分岐
  if (config.panelMode === "fixedFake9") {
    const shuffled = [...fakeCandidates].sort(() => Math.random() - 0.5);
    const fake = shuffled.slice(0, config.fakeCount);
    panelKanji = [...correctKanji, ...fake];
  } else {
    // ハードモード: BAN済み漢字を除外した全漢字
    panelKanji = [...correctKanji, ...fakeCandidates];
  }

  const panels = [...panelKanji].sort(() => Math.random() - 0.5);

  return {
    answerSong,
    reading: answerSong.reading,
    correctKanji,
    panels
  };
};
