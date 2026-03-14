/**
 * src/components/game/AIHint.jsx
 * Gemini-powered hint button for chapters.
 * Shows a glowing "Ask Sage" button → calls backend → displays hint.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Loader } from 'lucide-react'
import { aiAPI } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function AIHint({ chapterSlug, question, userAnswer = '' }) {
  const { user } = useAuth()
  const [hint, setHint]       = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)
  const [error, setError]     = useState('')

  const fetchHint = async () => {
    if (!user) {
      setError('Login karo hint pane ke liye!')
      setOpen(true)
      return
    }

    setLoading(true)
    setOpen(true)
    setHint('')
    setError('')

    try {
      const res = await aiAPI.getHint({
        chapter_slug: chapterSlug,
        question:     question,
        user_answer:  userAnswer,
      })
      setHint(res.data.hint)
    } catch (err) {
      setError('AI is thinking... try again... try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <motion.button
        onClick={fetchHint}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                   bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30
                   border border-violet-500/40 text-violet-300
                   hover:border-violet-400/60 hover:text-violet-200
                   transition-all duration-200"
      >
        <Sparkles className="w-4 h-4" />
        Ask CodeWithIIT AI
      </motion.button>

      {/* Hint panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 left-0 right-0 z-50
                       min-w-[320px] max-w-[420px]
                       bg-gray-900 border border-violet-500/40
                       rounded-xl shadow-2xl shadow-violet-900/30 p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-violet-300 font-semibold text-sm">CodeWithIIT AI says...</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                <Loader className="w-4 h-4 animate-spin text-violet-400" />
                <span>Consulting the ancient scrolls...</span>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {hint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-200 text-sm leading-relaxed
                           border-l-2 border-violet-500 pl-3"
              >
                {hint}
              </motion.p>
            )}

            {/* Powered by */}
            <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span className="text-gray-600 text-xs">Powered by CodeWithIIT AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
