/**
 * src/pages/LearnPage.jsx
 * Shows all 12 Python chapters grouped by level.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle, Star, Sparkles } from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { CHAPTERS } from "../data/chapters";

const LEVEL_COLORS = {
  Beginner: {
    bg: "from-green-900/40",
    border: "border-green-700/40",
    badge: "bg-green-500/20 text-green-300 border-green-500/40",
  },
  Intermediate: {
    bg: "from-blue-900/40",
    border: "border-blue-700/40",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  Advanced: {
    bg: "from-purple-900/40",
    border: "border-purple-700/40",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function LearnPage() {
  const navigate = useNavigate();

  // Safe progress loading
  const progress = useProgress() || {};
  const completedChapters = progress.completedChapters || [];
  const scores = progress.scores || {};

  const isUnlocked = (chapter) => {
    if (chapter.id === 1) return true;

    const prev = CHAPTERS.find((c) => c.id === chapter.id - 1);
    return prev ? completedChapters.includes(prev.slug) : false;
  };

  const totalXP = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Python Quest Map
          </h1>

          <p className="text-gray-400">
            12 chapters — Absolute Beginner to Advanced
          </p>

          <div className="flex items-center justify-center gap-6 mt-4">

            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="font-bold">{totalXP} XP</span>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>
                {completedChapters.length}/{CHAPTERS?.length || 0} completed
              </span>
            </div>

            <div className="flex items-center gap-1 text-violet-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-powered quizzes</span>
            </div>

          </div>
        </motion.div>

        {/* Chapters grouped by level */}
        {LEVELS.map((level) => {
          const levelChapters = CHAPTERS.filter((c) => c.level === level);
          const colors = LEVEL_COLORS[level];

          return (
            <div key={level} className="mb-10">

              <div className="flex items-center gap-3 mb-4">

                <span
                  className={`px-3 py-1 rounded-full border text-sm font-semibold ${colors.badge}`}
                >
                  {level}
                </span>

                <div className="flex-1 h-px bg-gray-800" />

                <span className="text-gray-500 text-sm">
                  {
                    levelChapters.filter((c) =>
                      completedChapters.includes(c.slug)
                    ).length
                  }
                  /{levelChapters.length} done
                </span>

              </div>

              <div className="grid gap-3">

                {levelChapters.map((chapter, idx) => {
                  const unlocked = isUnlocked(chapter);
                  const completed = completedChapters.includes(chapter.slug);
                  const chScore = scores?.[chapter.slug] || 0;

                  return (
                    <motion.div
                      key={chapter.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() =>
                          unlocked && navigate(`/chapter/${chapter.slug}`)
                        }
                        disabled={!unlocked}
                        className={`w-full text-left p-5 rounded-xl border transition-all duration-200
                        bg-gradient-to-r ${colors.bg} to-transparent
                        ${colors.border}
                        ${
                          unlocked
                            ? "hover:scale-[1.01] hover:shadow-lg cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }
                        ${completed ? "ring-1 ring-green-500/30" : ""}`}
                      >
                        <div className="flex items-center gap-4">

                          {/* Emoji */}
                          <div className="relative shrink-0">
                            <span className="text-3xl">{chapter.emoji}</span>

                            {completed && (
                              <CheckCircle className="w-4 h-4 text-green-400 fill-green-400 absolute -bottom-1 -right-1" />
                            )}

                            {!unlocked && (
                              <Lock className="w-4 h-4 text-gray-500 absolute -bottom-1 -right-1" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs">
                                Ch {chapter.id}
                              </span>

                              <span className="text-white font-semibold truncate">
                                {chapter.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-400 text-sm">
                                {chapter.concept}
                              </span>
                            </div>

                          </div>

                          {/* Right Side */}
                          <div className="shrink-0 text-right">

                            {completed ? (
                              <div>
                                <div className="text-yellow-400 font-bold text-sm">
                                  {chScore} XP
                                </div>
                                <div className="text-green-400 text-xs">
                                  ✦ Completed
                                </div>
                              </div>
                            ) : unlocked ? (
                              <div>
                                <div className="text-gray-400 text-sm">
                                  {chapter.xp} XP
                                </div>

                                <div className="text-violet-400 text-xs flex items-center gap-1 justify-end">
                                  <Sparkles className="w-3 h-3" /> AI Quiz
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-600 text-sm">
                                Locked
                              </div>
                            )}

                          </div>

                        </div>
                      </button>
                    </motion.div>
                  );
                })}

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}