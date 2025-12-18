"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelMode } from "@/lib/types";
import { SONGS } from "@/data/songs";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<PanelMode>("fixedFake9");
  const [questionCount, setQuestionCount] = useState<string>("10");

  const handleStart = () => {
    const params = new URLSearchParams({
      mode,
      count: questionCount,
    });
    router.push(`/game?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          MyGO!!!!!
        </h1>
        <p className="text-xl text-center text-gray-700 mb-8">
          漢字タイトル当てクイズ
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            モード選択
          </h2>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-purple-50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
              <input
                type="radio"
                name="mode"
                value="fixedFake9"
                checked={mode === "fixedFake9"}
                onChange={(e) => setMode(e.target.value as PanelMode)}
                className="w-4 h-4 text-purple-600 mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  デフォルトモード
                </div>
                <div className="text-sm text-gray-600">
                  正解3文字 + フェイク9文字 = 計12文字
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-red-50 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
              <input
                type="radio"
                name="mode"
                value="allKanji"
                checked={mode === "allKanji"}
                onChange={(e) => setMode(e.target.value as PanelMode)}
                className="w-4 h-4 text-red-600 mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  ハードモード
                </div>
                <div className="text-sm text-gray-600">
                  全漢字パネル（69文字程度）
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">問題数</h2>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="5">5問</option>
            <option value="10">10問</option>
            <option value="20">20問</option>
            <option value="all">全部（全{SONGS.length}問）</option>
          </select>
          <p className="text-sm text-gray-600 mt-2">
            「全部」は曲が重複しないように全曲出題します
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          ゲーム開始
        </button>
      </div>
    </div>
  );
}
