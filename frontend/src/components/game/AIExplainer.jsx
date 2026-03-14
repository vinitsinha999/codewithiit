/**
 * src/components/game/AIExplainer.jsx
 * "Explain this code" button — Gemini explains what the code does line by line.
 * Designed for beginners who want deeper understanding.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, X, Loader, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../api/client'

export default function AIExplainer({ code, concept }) {
  const { user }              = useAuth()
  const [explanation, setExp] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)

  const fetchExplanation = async () => {
    if (open && explanation) { setOpen(false); return }

    setLoading(true)
    setOpen(true)
    setExp('')

    try {
      // Call Gemini directly via our backend proxy endpoint
      const res = await apiClient.post('/api/ai/explain', {
        code,
        concept,
      })
      setExp(res.data.explanation)
    } catch {
      setExp('Could not fetch explanation. Make sure you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={fetchExplanation}
        className="flex items-center gap-2 text-xs text-blue-400/70
                   hover:text-blue-300 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" />
        {open ? 'Hide explanation' : '✦ Explain this code (AI)'}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-blue-950/30 border border-blue-500/20 rounded-lg">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-300 text-sm">
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini is reading the scroll...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {explanation}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
