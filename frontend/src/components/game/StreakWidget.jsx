/**
 * src/components/game/StreakWidget.jsx
 * Shows daily streak flame counter.
 * Auto-checks in on mount (call /api/streak/checkin).
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import apiClient from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function StreakWidget({ className = '' }) {
  const { user }         = useAuth()
  const [streak, setStreak] = useState(0)
  const [showPop, setShowPop] = useState(false)

  useEffect(() => {
    if (!user) return

    // Check in on mount
    apiClient.post('/api/streak/checkin')
      .then(res => {
        setStreak(res.data.streak)
        if (res.data.message === 'Checked in!') {
          setShowPop(true)
          setTimeout(() => setShowPop(false), 2500)
        }
      })
      .catch(() => {
        // Fallback — just get streak
        apiClient.get('/api/streak/me')
          .then(r => setStreak(r.data.streak))
          .catch(() => {})
      })
  }, [user])

  if (!user || streak === 0) return null

  const flameColor = streak >= 7 ? 'text-red-400' : streak >= 3 ? 'text-orange-400' : 'text-yellow-400'

  return (
    <div className={`relative ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    bg-orange-500/10 border border-orange-500/20`}
      >
        <Flame className={`w-4 h-4 ${flameColor}`} />
        <span className={`font-bold text-sm ${flameColor}`}>{streak}</span>
        <span className="text-gray-400 text-xs">day streak</span>
      </motion.div>

      {/* Popup toast */}
      <AnimatePresence>
        {showPop && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                       bg-gray-900 border border-orange-500/40
                       rounded-lg px-4 py-2 text-sm whitespace-nowrap
                       shadow-xl z-50"
          >
            🔥 {streak} day streak! Keep it up!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
