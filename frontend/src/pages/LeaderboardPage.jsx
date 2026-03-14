/**
 * src/pages/LeaderboardPage.jsx
 * Fantasy-styled leaderboard — top wizards by XP
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Flame, BookOpen, Loader, Trophy } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../api/client'

const RANK_MEDALS = ['🥇', '🥈', '🥉']
const RANK_TITLES = [
  { min: 0,    title: 'Novice',        color: 'text-gray-400' },
  { min: 150,  title: 'Apprentice',    color: 'text-green-400' },
  { min: 400,  title: 'Spell Knight',  color: 'text-blue-400' },
  { min: 800,  title: 'Archmage',      color: 'text-violet-400' },
  { min: 1500, title: 'Python Master', color: 'text-yellow-400' },
]

function getTitle(xp) {
  return [...RANK_TITLES].reverse().find(r => xp >= r.min) || RANK_TITLES[0]
}

export default function LeaderboardPage() {
  const { user }          = useAuth()
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient.get('/api/leaderboard')
      .then(res => setBoard(res.data.leaderboard))
      .catch(() => setError('Could not load leaderboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-1">Hall of Champions</h1>
          <p className="text-gray-400 text-sm">Top wizards of Codoria ranked by XP</p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        )}

        {error && (
          <div className="card p-8 text-center text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {board.map((entry, i) => {
              const titleInfo = getTitle(entry.total_xp)
              const isMe      = entry.is_me
              const medal     = RANK_MEDALS[i]

              return (
                <motion.div key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card px-5 py-4 flex items-center gap-4 transition-all
                    ${isMe ? 'ring-2 ring-magic/50 bg-magic/5' : ''}
                    ${i === 0 ? 'border-yellow-500/40 bg-yellow-500/5' : ''}
                    ${i === 1 ? 'border-gray-400/30' : ''}
                    ${i === 2 ? 'border-orange-600/30' : ''}`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {medal
                      ? <span className="text-xl">{medal}</span>
                      : <span className="text-gray-500 font-bold text-sm">#{entry.rank}</span>
                    }
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0
                    ${isMe ? 'bg-magic/30 border-2 border-magic' : 'bg-gray-800'}`}>
                    {entry.username[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold truncate ${isMe ? 'text-magic-light' : 'text-white'}`}>
                        {entry.username}
                        {isMe && <span className="text-xs text-magic-light ml-1">(you)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`text-xs font-medium ${titleInfo.color}`}>
                        {titleInfo.title}
                      </span>
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {entry.chapters_done} chapters
                      </span>
                      {entry.streak > 0 && (
                        <span className="text-orange-400 text-xs flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {entry.streak}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="shrink-0 text-right">
                    <div className="text-yellow-400 font-bold">{entry.total_xp.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">XP</div>
                  </div>
                </motion.div>
              )
            })}

            {board.length === 0 && (
              <div className="card p-12 text-center text-gray-500">
                No adventurers yet — be the first! 🧙
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
