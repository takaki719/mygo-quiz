"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PanelMode, GameConfig, Question } from "@/lib/types";
import { SONGS } from "@/data/songs";
import { createQuestion, judgeHitBlow } from "@/lib/gameLogic";

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as PanelMode) || "fixedFake9";

  const [config] = useState<GameConfig>({
    panelMode: mode,
    fakeCount: 9,
  });

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [bannedKanji, setBannedKanji] = useState<string[]>([]);
  const [result, setResult] = useState<{
    visible: boolean;
    isCorrect: boolean;
    hit: number;
    blow: number;
  } | null>(null);

  // 初回問題生成
  useEffect(() => {
    setQuestion(createQuestion(SONGS, config, bannedKanji));
  }, [config]);

  // 漢字パネルクリック
  const handlePanelClick = (kanji: string) => {
    if (selected.length < 3 && !selected.includes(kanji)) {
      const newSelected = [...selected, kanji];
      setSelected(newSelected);

      // 3文字選択時に自動判定
      if (newSelected.length === 3) {
        checkAnswer(newSelected);
      }
    }
  };

  // 回答チェック
  const checkAnswer = (answer: string[]) => {
    if (!question) return;

    const { hit, blow } = judgeHitBlow(question.correctKanji, answer);
    const isCorrect = hit === 3;

    setResult({
      visible: true,
      isCorrect,
      hit,
      blow,
    });

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // 次の問題へ
  const handleNext = () => {
    // ハードモードの場合、正解の漢字をBANリストに追加
    let newBannedKanji = bannedKanji;
    if (config.panelMode === "allKanji" && question) {
      newBannedKanji = [...bannedKanji, ...question.correctKanji];
      setBannedKanji(newBannedKanji);
    }

    setQuestion(createQuestion(SONGS, config, newBannedKanji));
    setSelected([]);
    setResult(null);
  };

  // もう一度
  const handleRetry = () => {
    setSelected([]);
    setResult(null);
  };

  // 1文字消す
  const handleRemoveLast = () => {
    setSelected(selected.slice(0, -1));
  };

  // リセット
  const handleReset = () => {
    setSelected([]);
  };

  // トップに戻る
  const handleBackToTop = () => {
    router.push("/");
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
          <button
            onClick={handleBackToTop}
            className="bg-white text-gray-700 px-4 py-3 rounded-lg shadow hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            ← トップへ戻る
          </button>
          <div className="flex gap-2 sm:gap-3">
            {config.panelMode === "allKanji" && (
              <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex-1 sm:flex-none">
                <span className="text-sm sm:text-lg font-bold text-red-600 whitespace-nowrap">
                  BAN: {bannedKanji.length}
                </span>
              </div>
            )}
            <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex-1 sm:flex-none">
              <span className="text-sm sm:text-lg font-bold text-purple-600 whitespace-nowrap">
                スコア: {score}
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
          {/* 読み表示 */}
          <div className="text-center mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">読み</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 break-all">
              {question.reading}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3">漢字3つを順番に選んでね</p>
          </div>

          {/* 選択スロット */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-3 sm:border-4 border-purple-300 rounded-xl flex items-center justify-center bg-purple-50 shadow-inner"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                  {selected[i] || ""}
                </span>
              </div>
            ))}
          </div>

          {/* 操作ボタン */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            <button
              onClick={handleRemoveLast}
              disabled={selected.length === 0}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base active:scale-95"
            >
              1文字消す
            </button>
            <button
              onClick={handleReset}
              disabled={selected.length === 0}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base active:scale-95"
            >
              リセット
            </button>
          </div>

          {/* 漢字パネル */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {question.panels.map((kanji, idx) => {
              const selectedIndex = selected.indexOf(kanji);
              const isSelected = selectedIndex !== -1;
              const numberBadge =
                selectedIndex === 0 ? "①" : selectedIndex === 1 ? "②" : "③";

              return (
                <button
                  key={idx}
                  onClick={() => handlePanelClick(kanji)}
                  disabled={isSelected || selected.length >= 3}
                  className={`aspect-square rounded-lg font-bold text-lg sm:text-xl md:text-2xl transition-all shadow-md relative min-h-[3rem] sm:min-h-0 ${
                    isSelected
                      ? "bg-purple-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-800 hover:bg-purple-100 active:scale-95"
                  } ${
                    selected.length >= 3 && !isSelected
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {kanji}
                  {isSelected && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {numberBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 結果ダイアログ */}
      {result?.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            {result.isCorrect ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-3 sm:mb-4 text-center">
                  正解！
                </h3>
                <p className="text-lg sm:text-xl text-center mb-6">
                  <span className="font-bold text-xl sm:text-2xl">
                    {question.answerSong.title}
                  </span>
                  <br />
                  <span className="text-sm sm:text-base text-gray-600">
                    （{question.answerSong.reading}）
                  </span>
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  次の問題へ
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4 text-center">
                  不正解
                </h3>
                <div className="text-center mb-6">
                  <p className="text-3xl sm:text-5xl font-bold mb-2">
                    <span className="text-red-500">{result.hit}</span> ヒット{" "}
                    <span className="text-yellow-500">{result.blow}</span>{" "}
                    ブロウ
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mt-4">
                    選択: {selected.join(" ")}
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  もう一度
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
