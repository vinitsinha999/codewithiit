import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, BookOpen, RotateCcw, Star, Award, Crown, Lock } from 'lucide-react'
import { CHAPTERS } from '@/data/chapters'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/context/AuthContext'
import StreakWidget from '@/components/game/StreakWidget'
import Certificate from '@/components/game/Certificate'

const TOTAL_XP = CHAPTERS.reduce((sum, ch) => sum + ch.xp, 0)

const RANKS = [
  { label: 'Curious Novice',  emoji: '🌱', minXp: 0    },
  { label: 'Apprentice Mage', emoji: '🔮', minXp: 150  },
  { label: 'Spell Knight',    emoji: '⚔️', minXp: 400  },
  { label: 'Grand Archmage',  emoji: '🧙', minXp: 800  },
  { label: 'Python Master',   emoji: '🐍', minXp: 1500 },
]

function getRank(xp) {
  return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0]
}

// ── Dummy Certificate Preview Card ─────────────────────────────────
function CertificateTeaser({ completedCount, totalCount, onUnlock }) {
  const allDone = completedCount === totalCount
  const pct     = Math.round((completedCount / totalCount) * 100)

  return (
    <motion.div
      className="mt-8 rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ border: '1px solid rgba(124,58,237,0.4)' }}
    >
      {/* Dummy certificate visual */}
      <div
        className="relative p-8 text-center"
        style={{
          background: 'linear-gradient(145deg, #1a0a2e 0%, #0d0620 50%, #1a0a2e 100%)',
        }}
      >
        {/* Stars background */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '2px', height: '2px',
            background: 'rgba(167,139,250,0.5)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }} />
        ))}

        {/* Lock overlay if not done */}
        {!allDone && (
          <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.55)' }}>
            <Lock className="w-10 h-10 text-purple-400 mb-3" />
            <p className="text-white font-bold text-lg mb-1">Certificate Locked</p>
            <p className="text-purple-300 text-sm mb-4">
              Complete all {totalCount} chapters to unlock
            </p>
            <div className="w-48 bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                }}
              />
            </div>
            <p className="text-purple-400 text-xs">{completedCount}/{totalCount} chapters done</p>
          </div>
        )}

        {/* Certificate preview content */}
        <div style={{ filter: allDone ? 'none' : 'blur(1px)' }}>
          {/* Border lines */}
          <div className="absolute inset-3 rounded-xl pointer-events-none"
            style={{ border: '1px solid rgba(124,58,237,0.5)' }} />

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">⚔️</span>
            <span style={{ fontFamily: 'serif', fontSize: '13px', color: '#c4a0ff', letterSpacing: '3px' }}>
              CODE WITH IIT
            </span>
            <span className="text-lg">🐍</span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
            <div className="w-2 h-2 rotate-45" style={{ background: '#a78bfa' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
          </div>

          <p style={{ color: '#9b72d0', fontSize: '10px', letterSpacing: '4px', marginBottom: '4px' }}>
            PROUDLY PRESENTS
          </p>
          <p style={{ color: '#e9d5ff', fontSize: '24px', fontFamily: 'serif', fontWeight: 700, letterSpacing: '2px' }}>
            Certificate
          </p>
          <p style={{ color: '#7c3aed', fontSize: '10px', letterSpacing: '4px', marginBottom: '12px' }}>
            OF ACHIEVEMENT
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
            <div className="w-2 h-2 rotate-45" style={{ background: '#a78bfa' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />
          </div>

          <p style={{ color: '#9b72d0', fontSize: '12px', fontStyle: 'italic', marginBottom: '6px' }}>
            This certificate is proudly awarded to
          </p>

          {/* Name placeholder */}
          <p style={{ color: '#ffd700', fontSize: '28px', fontFamily: 'serif', fontWeight: 700 }}>
            Your Name Here
          </p>

          <p style={{ color: '#c4b5d4', fontSize: '12px', marginTop: '8px', marginBottom: '12px' }}>
            For completing the Python Mastery Quest — all 12 chapters
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {['Python Basics', 'OOP', 'Data Structures', 'Advanced Python'].map(s => (
              <span key={s} style={{
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '10px',
                color: '#c4a0ff',
              }}>{s}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 pt-3"
            style={{ borderTop: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="text-center">
              <p style={{ color: '#e9d5ff', fontSize: '10px', fontWeight: 600 }}>Code with IIT</p>
              <div className="h-px my-1" style={{ background: 'rgba(124,58,237,0.4)' }} />
              <p style={{ color: '#9b72d0', fontSize: '9px', fontStyle: 'italic' }}>Platform Director</p>
            </div>
            <div className="text-center">
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '2px solid #7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', margin: '0 auto',
                background: 'rgba(124,58,237,0.15)',
              }}>
                <span style={{ fontSize: '20px' }}>🏆</span>
              </div>
            </div>
            <div className="text-center">
              <p style={{ color: '#e9d5ff', fontSize: '10px', fontWeight: 600 }}>Date of Completion</p>
              <div className="h-px my-1" style={{ background: 'rgba(124,58,237,0.4)' }} />
              <p style={{ color: '#9b72d0', fontSize: '9px', fontStyle: 'italic' }}>Completion Date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      {allDone ? (
        <div className="p-4 text-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
          <p className="text-yellow-400 font-bold mb-3">🎉 You've unlocked your certificate!</p>
          <button
            onClick={onUnlock}
            className="px-8 py-2.5 rounded-lg text-white font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}
          >
            Download My Certificate
          </button>
        </div>
      ) : (
        <div className="p-4 flex items-center justify-between"
          style={{ background: 'rgba(124,58,237,0.08)' }}>
          <p className="text-purple-300 text-sm">
            Complete <span className="text-white font-bold">{totalCount - completedCount} more chapters</span> to earn this!
          </p>
          <Link to="/learn"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
            Continue →
          </Link>
        </div>
      )}
    </motion.div>
  )
}

// ── Main Dashboard ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }                           = useAuth()
  const { completedChapters, scores = {} } = useProgress()
  const [showCert, setShowCert]            = useState(false)

  const totalXP     = Object.values(scores).reduce((a, b) => a + b, 0)
  const rank        = getRank(totalXP)
  const progressPct = Math.min(Math.round((totalXP / TOTAL_XP) * 100), 100)
  const allDone     = completedChapters.length === CHAPTERS.length

  const isCompleted = (slug) => completedChapters.includes(slug)
  const getScore    = (slug) => scores[slug] || 0

  const resetProgress = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="relative min-h-screen">

      {/* Certificate modal */}
      <AnimatePresence>
        {showCert && <Certificate onClose={() => setShowCert(false)} />}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">

        {/* Rank header */}
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-2">{rank.emoji}</div>
          <h1 className="text-3xl font-bold text-white mb-1">{rank.label}</h1>
          <p className="text-gray-400 text-sm mb-4">Your Adventurer Dashboard</p>
          <div className="flex justify-center"><StreakWidget /></div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {[
            { icon: Zap,      label: 'Total XP',     value: totalXP,                                          color: 'text-yellow-400'  },
            { icon: BookOpen, label: 'Chapters Done', value: `${completedChapters.length}/${CHAPTERS.length}`, color: 'text-magic-light' },
            { icon: Star,     label: 'Max XP',        value: TOTAL_XP,                                         color: 'text-green-400'   },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-gray-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Progress bar */}
        <div className="card p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Quest Progress</span>
            <span className="text-magic-light font-semibold">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-magic to-yellow-400"
              initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0 XP</span><span>{TOTAL_XP} XP</span>
          </div>
        </div>

        {/* Chapter list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Chapter Scores</h2>
          <div className="space-y-3">
            {CHAPTERS.map((ch, i) => {
              const done  = isCompleted(ch.slug)
              const score = getScore(ch.slug)
              const pct   = ch.xp > 0 ? Math.min((score / ch.xp) * 100, 100) : 0
              return (
                <motion.div key={ch.slug}
                  className={`card flex items-center gap-4 px-5 py-4 ${done ? 'border-green-500/20' : ''}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}>
                  <span className="text-xl w-8 text-center">{ch.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-500 text-xs shrink-0">Ch{ch.id}</span>
                        <span className="text-sm text-gray-200 truncate">{ch.title}</span>
                      </div>
                      <span className={`text-xs ml-2 shrink-0 font-medium ${done ? 'text-green-400' : 'text-gray-600'}`}>
                        {done ? `${score} XP ✓` : 'Locked'}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-magic to-yellow-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {!done && (
                    <Link to={`/chapter/${ch.slug}`}
                      className="text-xs text-yellow-500/50 hover:text-yellow-400 shrink-0 transition-colors">
                      Start →
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Certificate teaser — hamesha dikhega */}
        <CertificateTeaser
          completedCount={completedChapters.length}
          totalCount={CHAPTERS.length}
          onUnlock={() => setShowCert(true)}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link to="/learn"
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold">
            <BookOpen className="w-4 h-4" /> Continue Quest
          </Link>
          <Link to="/leaderboard"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm">
            <Crown className="w-4 h-4" /> Leaderboard
          </Link>
          <button onClick={resetProgress}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
