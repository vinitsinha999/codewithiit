import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Sword, Zap, Shield, BookOpen, ChevronRight, Star, Trophy, Flame, Crown, Brain, Rocket } from 'lucide-react'
import { CHAPTERS } from '@/data/chapters'

function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [-20, 20, -20], opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Counter({ to, duration = 2 }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let current = 0
    const step = to / (duration * 60)
    const timer = setInterval(() => {
      current += step
      if (current >= to) { setVal(to); clearInterval(timer) }
      else setVal(Math.floor(current))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [started, to, duration])
  return (
    <motion.span onViewportEnter={() => setStarted(true)}>
      {val.toLocaleString()}
    </motion.span>
  )
}

const STATS = [
  { icon: BookOpen, label: 'Chapters',     value: 12,   suffix: '' },
  { icon: Brain,    label: 'AI Questions', value: 180,  suffix: '+' },
  { icon: Trophy,   label: 'Total XP',     value: 1800, suffix: '' },
  { icon: Flame,    label: 'Day Streak',   value: 30,   suffix: ' max' },
]

const FEATURES = [
  {
    icon: Sword,
    title: 'Story-Driven Learning',
    desc: 'Every concept is a quest. Variables, loops, functions — taught through an epic fantasy adventure in Codoria.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(124,58,237,0.3)',
  },
  {
    icon: Brain,
    title: 'Groq AI Quizzes',
    desc: 'Unique AI-generated questions every time. No two quizzes are the same — powered by Llama 3.3 via Groq.',
    gradient: 'from-yellow-500 to-orange-500',
    glow: 'rgba(234,179,8,0.3)',
  },
  {
    icon: Trophy,
    title: 'Leaderboard & Ranks',
    desc: 'Compete with wizards worldwide. Climb from Curious Novice to Python Master and claim your certificate.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    desc: 'Build consistent habits. Login daily to keep your streak alive and maintain your champion status.',
    gradient: 'from-orange-500 to-red-500',
    glow: 'rgba(249,115,22,0.3)',
  },
  {
    icon: Shield,
    title: 'Built by IIT Patna Student',
    desc: 'Designed to the rigorous standards of IIT Patna — structured, comprehensive, and battle-tested curriculum.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    icon: Crown,
    title: 'Completion Certificate',
    desc: 'Finish all 12 chapters and earn a beautiful downloadable certificate with IIT Patna branding.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
  },
]

const RANKS = [
  { emoji: '🌱', label: 'Curious Novice',  xp: '0 XP',    color: '#6b7280' },
  { emoji: '🔮', label: 'Apprentice Mage', xp: '150 XP',  color: '#10b981' },
  { emoji: '⚔️', label: 'Spell Knight',    xp: '400 XP',  color: '#3b82f6' },
  { emoji: '🧙', label: 'Grand Archmage',  xp: '800 XP',  color: '#8b5cf6' },
  { emoji: '🐍', label: 'Python Master',   xp: '1500 XP', color: '#f5c842' },
]

const LEVELS = [
  { label: 'Beginner',     color: '#10b981', border: 'rgba(16,185,129,0.2)',  bg: 'rgba(16,185,129,0.08)',  chapters: CHAPTERS.filter(c => c.level === 'Beginner') },
  { label: 'Intermediate', color: '#3b82f6', border: 'rgba(59,130,246,0.2)',  bg: 'rgba(59,130,246,0.08)',  chapters: CHAPTERS.filter(c => c.level === 'Intermediate') },
  { label: 'Advanced',     color: '#8b5cf6', border: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.08)', chapters: CHAPTERS.filter(c => c.level === 'Advanced') },
]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const particles = Array.from({ length: 25 }, (_, i) => ({
    width:  Math.random() * 3 + 1 + 'px',
    height: Math.random() * 3 + 1 + 'px',
    left:   Math.random() * 100 + '%',
    top:    Math.random() * 100 + '%',
    background: ['#c8922a', '#7c3aed', '#ffffff', '#f5c842'][i % 4],
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#07050f' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(124,58,237,0.18) 0%, rgba(200,146,42,0.07) 50%, transparent 70%)'
          }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(200,146,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,42,0.8) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }} />
          {particles.map((p, i) => <Particle key={i} style={p} />)}
        </div>

        <motion.div
          className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOp }}
        >
          {/* Badge */}
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ background:'rgba(200,146,42,0.1)', border:'1px solid rgba(200,146,42,0.35)', color:'#f5c842' }}>
            <Star className="w-3 h-3 fill-current" /> IIT Patna · Python Learning Platform
          </motion.div>

          {/* Main title */}
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
            className="font-bold leading-none mb-5 px-2"
            style={{
              fontSize: 'clamp(2.8rem, 9vw, 6.5rem)',
              background: 'linear-gradient(135deg, #f5c842 0%, #c8922a 35%, #fff 65%, #c8922a 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: '"Cinzel Decorative", serif',
            }}>
            Code with IIT
          </motion.h1>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="text-xs sm:text-sm tracking-[0.25em] uppercase mb-5 font-bold"
            style={{ color:'#7c3aed' }}>
            ⚔ The Lost Algorithm — A Python Adventure ⚔
          </motion.p>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 px-2"
            style={{ color:'rgba(245,235,210,0.6)', fontFamily:'"Cinzel", serif' }}>
            Learn Python through an epic quest. Every variable is a spell,
            every loop a battle, every function a superpower.
            Complete 12 chapters. Save Codoria.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link to="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background:'linear-gradient(135deg,#c8922a,#f5c842)', color:'#000', boxShadow:'0 0 30px rgba(200,146,42,0.45)' }}>
              <Sword className="w-4 h-4" /> Begin Your Quest — Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/leaderboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.4)', color:'#a78bfa' }}>
              <Trophy className="w-4 h-4" /> View Leaderboard
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ icon:Icon, label, value, suffix }, i) => (
              <motion.div key={label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.85+i*0.1 }}
                className="rounded-xl p-4 text-center"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <Icon className="w-4 h-4 mx-auto mb-2" style={{ color:'#c8922a' }} />
                <div className="text-xl font-bold" style={{ color:'#f5c842' }}>
                  <Counter to={value} />{suffix}
                </div>
                <div className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.35)' }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:2 }}
          style={{ color:'rgba(255,255,255,0.15)' }}>
          <div className="w-5 h-9 rounded-full border-2 border-current flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-current rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── QUEST MAP ────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background:'rgba(0,0,0,0.25)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div className="text-4xl mb-3">🗺️</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color:'#f5c842', fontFamily:'"Cinzel Decorative", serif' }}>Your Quest Map</h2>
            <p className="text-sm" style={{ color:'rgba(255,255,255,0.35)' }}>
              12 chapters · Beginner to Advanced · {CHAPTERS.reduce((s,c)=>s+c.xp,0)} total XP
            </p>
          </motion.div>

          {LEVELS.map(({ label, color, border, bg, chapters }, li) => (
            <div key={label} className="mb-10">
              <motion.div className="flex items-center gap-3 mb-4"
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:li*0.1 }}>
                <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ color, background:bg, border:`1px solid ${border}` }}>{label}</span>
                <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.06)' }} />
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {chapters.map((ch, i) => (
                  <motion.div key={ch.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay:i*0.06 }}>
                    <Link to={`/chapter/${ch.slug}`}
                      className="block rounded-xl p-3 sm:p-4 text-center transition-all duration-200 hover:-translate-y-1"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,146,42,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                      <div className="text-2xl mb-2">{ch.emoji}</div>
                      <div className="text-xs font-bold mb-1 truncate" style={{ color:'#c8922a' }}>{ch.concept}</div>
                      <p className="text-xs leading-tight mb-2 hidden sm:block" style={{ color:'rgba(255,255,255,0.4)' }}>{ch.title}</p>
                      <div className="text-xs font-bold" style={{ color:'#f5c842' }}>✦ {ch.xp} XP</div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color:'#fff', fontFamily:'"Cinzel Decorative", serif' }}>Why Code with IIT?</h2>
            <p className="text-sm" style={{ color:'rgba(255,255,255,0.35)' }}>Everything you need to master Python — gamified</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon:Icon, title, desc, gradient, glow }, i) => (
              <motion.div key={title}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.08 }}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow=`0 20px 40px ${glow}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none' }}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RANKS ────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background:'rgba(0,0,0,0.25)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color:'#fff', fontFamily:'"Cinzel Decorative", serif' }}>Earn Your Rank</h2>
            <p className="text-sm mb-10" style={{ color:'rgba(255,255,255,0.35)' }}>Progress through 5 ranks as you gain XP</p>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {RANKS.map(({ emoji, label, xp, color }, i) => (
              <motion.div key={label}
                initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="rounded-2xl p-4 text-center w-28 sm:w-32"
                style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}25` }}>
                <div className="text-2xl sm:text-3xl mb-2">{emoji}</div>
                <div className="text-xs font-bold mb-1" style={{ color }}>{label}</div>
                <div className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>{xp}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)'
        }} />
        <motion.div className="relative z-10 max-w-2xl mx-auto"
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="text-5xl mb-6">⚔️</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color:'#f5c842', fontFamily:'"Cinzel Decorative", serif' }}>Ready to Begin?</h2>
          <p className="text-base mb-8" style={{ color:'rgba(255,255,255,0.45)', fontFamily:'"Cinzel", serif' }}>
            Join wizards learning Python the epic way. Free forever. No credit card. Just code.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-200 hover:scale-105"
              style={{ background:'linear-gradient(135deg,#c8922a,#f5c842)', color:'#000', boxShadow:'0 0 40px rgba(200,146,42,0.4)' }}>
              <Rocket className="w-5 h-5" /> Start Free — Begin Quest
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)' }}>
              Already a Wizard? Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-8 px-4 text-center" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs tracking-widest" style={{ color:'rgba(255,255,255,0.18)' }}>
          ⚔ Built with passion at IIT Patna · Code with IIT · Python Learning Platform
        </p>
      </footer>

    </div>
  )
}
