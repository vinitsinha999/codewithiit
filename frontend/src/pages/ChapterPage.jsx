/**
 * src/pages/ChapterPage.jsx
 * Flow: Story → Concepts (teach) → Lesson (code) → Quiz → Results
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ChevronRight, Trophy, Home,
  RotateCcw, Loader, Sparkles, CheckCircle, XCircle,
  BookOpen, Lightbulb, Code2
} from 'lucide-react'

import { useAuth }                from '../context/AuthContext'
import { progressAPI }            from '../api/client'
import apiClient                  from '../api/client'
import CodeBlock                  from '../components/game/CodeBlock'
import AIHint                     from '../components/game/AIHint'
import AIExplainer                from '../components/game/AIExplainer'
import { CHAPTERS }               from '../data/chapters'
import { getQuestions }           from '../data/questions'
import { useProgress }            from '../hooks/useProgress'
import { useSound }               from '../hooks/useSound'

export default function ChapterPage() {
  const { slug }         = useParams()
  const navigate         = useNavigate()
  const { user }         = useAuth()
  const { markComplete } = useProgress()

  // 🎮 8-bit sounds
  const { playCorrect, playWrong, playVictory, playFail, playClick, playNext } = useSound()

  // 📝 Seen questions tracking
  // sessionStorage = current browser session (resets on tab close)
  // localStorage   = permanent cross-session memory
  const lsKey      = `cwi_seen_${slug}`
  const ssKey      = `cwi_session_${slug}`

  const getSeenQuestions = () => {
    try {
      const ls = JSON.parse(localStorage.getItem(lsKey)   || '[]')
      const ss = JSON.parse(sessionStorage.getItem(ssKey) || '[]')
      // Combine both — unique only
      return [...new Set([...ls, ...ss])]
    } catch { return [] }
  }

  const addSeenQuestions = (newQTexts) => {
    try {
      // Add to session storage (current session)
      const ss = JSON.parse(sessionStorage.getItem(ssKey) || '[]')
      const newSs = [...new Set([...ss, ...newQTexts])]
      sessionStorage.setItem(ssKey, JSON.stringify(newSs))

      // Add to localStorage (permanent)
      const ls = JSON.parse(localStorage.getItem(lsKey) || '[]')
      const newLs = [...new Set([...ls, ...newQTexts])]
      // Keep max 300 seen per chapter
      localStorage.setItem(lsKey, JSON.stringify(newLs.slice(-300)))
    } catch { }
  }

  const chapter = CHAPTERS.find(c => c.slug === slug)

  const [stage, setStage]           = useState('story')
  const [storyIdx, setStoryIdx]     = useState(0)
  const [conceptIdx, setConceptIdx] = useState(0)
  const [questions, setQuestions]       = useState([])
  const [qLoading, setQLoading]         = useState(false)
  const [qError, setQError]             = useState('')
  const [currentQ, setCurrentQ]         = useState(0)
  const [selected, setSelected]         = useState(null)
  const [answered, setAnswered]         = useState(false)
  const [feedback, setFeedback]         = useState('')
  const [isCorrect, setIsCorrect]       = useState(false)
  const [score, setScore]               = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers]           = useState([])

  useEffect(() => {
    if (!chapter) { toast.error('Chapter not found'); navigate('/learn') }
  }, [chapter])

  if (!chapter) return null

  const loadQuestions = () => {
    setQLoading(true)
    setQError('')
    setQuestions([])
    setCurrentQ(0)
    setScore(0)
    setCorrectCount(0)
    setAnswers([])
    setSelected(null)
    setAnswered(false)

    try {
      const seen = getSeenQuestions()
      const loaded = getQuestions(slug, 20, seen)

      if (!loaded || loaded.length === 0) {
        setQError('No questions found for this chapter')
        setQLoading(false)
        return
      }

      setQuestions(loaded)
      // Mark these as seen for next attempt
      addSeenQuestions(loaded.map(q => q.question))
    } catch (err) {
      setQError('Failed to load questions')
      toast.error('Could not load questions')
    } finally {
      setQLoading(false)
    }
  }

  const handleStartQuiz = () => {
    playClick()
    setStage('quiz')
    loadQuestions()
  }

  const handleAnswer = (choiceId) => {
    if (answered) return
    setSelected(choiceId)
    const q = questions[currentQ]

    const correct = choiceId === q.correct_id
    const xp_earned = correct ? 10 : 3

    setIsCorrect(correct)
    setFeedback(q.explanation)
    setAnswered(true)

    if (correct) {
      playCorrect()
      setCorrectCount(c => c + 1)
      setScore(s => s + xp_earned)
      toast.success(`+${xp_earned} XP ✦`, { duration: 1200 })
    } else {
      playWrong()
    }

    setAnswers(prev => [...prev, {
      question: q.question, selected: choiceId, correct: q.correct_id,
      isCorrect: correct, difficulty: q.difficulty,
    }])
  }

  const handleNext = () => {
    playNext()
    if (currentQ + 1 >= questions.length) finishQuiz()
    else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setAnswered(false)
      setFeedback('')
      setIsCorrect(false)
    }
  }

  const finishQuiz = async () => {
    const passed = correctCount >= Math.ceil(questions.length * 0.6)

    // 🏆 Victory or 📚 Fail sound
    if (passed) playVictory()
    else        playFail()

    if (user) {
      try {
        await progressAPI.save({ chapter_slug: slug, score, completed: passed, attempts: 1 })
        if (passed) await markComplete(slug, score)
      } catch { }
    }
    setStage('results')
  }

  const q = questions[currentQ]
  const progress = questions.length > 0 ? ((currentQ + (answered ? 1 : 0)) / questions.length) * 100 : 0
  const passed = correctCount >= Math.ceil(questions.length * 0.6)
  const concepts = chapter.concepts || []
  const currentConcept = concepts[conceptIdx]
  const sf = { fontFamily: "'Segoe UI', system-ui, sans-serif", textTransform: 'none', fontVariant: 'normal' }
  const levelColor = chapter.level === 'Beginner' ? 'bg-green-500/20 border-green-500/40 text-green-300'
    : chapter.level === 'Intermediate' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
    : 'bg-purple-500/20 border-purple-500/40 text-purple-300'

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-magic/20 border border-magic/40 text-magic-light text-xs font-semibold uppercase tracking-wider">
            Chapter {chapter.id}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            {chapter.concept}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${levelColor}`}>
            {chapter.level}
          </span>
          <div className="ml-auto flex gap-1">
            {['story','concepts','lesson','quiz'].map((s, i) => (
              <div key={s} className={`w-6 h-1.5 rounded-full transition-colors ${
                stage === s ? 'bg-magic-light' :
                ['story','concepts','lesson','quiz','results'].indexOf(stage) > i ? 'bg-magic/40' : 'bg-gray-700'
              }`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* STORY */}
          {stage === 'story' && (
            <motion.div key="story" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="card p-8">
                <div className="text-5xl mb-4 text-center">{chapter.emoji}</div>
                <h1 className="text-2xl font-bold text-white text-center mb-6" style={sf}>{chapter.title}</h1>
                <motion.p key={storyIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-gray-300 text-lg leading-relaxed text-center mb-8" style={sf}
                  dangerouslySetInnerHTML={{ __html: chapter.story[storyIdx] }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {chapter.story.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === storyIdx ? 'bg-magic-light' : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      playClick()
                      if (storyIdx < chapter.story.length - 1) setStoryIdx(s => s + 1)
                      else { setConceptIdx(0); setStage('concepts') }
                    }}
                    className="btn-primary px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2"
                  >
                    {storyIdx < chapter.story.length - 1 ? 'Continue' : '📚 Learn Concepts'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONCEPTS */}
          {stage === 'concepts' && currentConcept && (
            <motion.div key={`concept-${conceptIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="card p-8">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-magic-light" />
                  <span className="text-magic-light text-sm font-semibold">
                    Concept {conceptIdx + 1} of {concepts.length}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1 mb-6">
                  <div className="bg-magic-light h-1 rounded-full transition-all duration-500"
                    style={{ width: `${((conceptIdx + 1) / concepts.length) * 100}%` }} />
                </div>

                <h2 className="text-xl font-bold text-white mb-4" style={sf}>{currentConcept.title}</h2>
                <p className="text-gray-300 text-base leading-relaxed mb-5" style={sf}
                  dangerouslySetInnerHTML={{ __html: currentConcept.body }} />

                {currentConcept.example && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-semibold">Code Example</span>
                    </div>
                    <CodeBlock code={currentConcept.example} language="python" />
                  </div>
                )}

                {currentConcept.tip && (
                  <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-200 text-sm leading-relaxed" style={sf}>{currentConcept.tip}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {conceptIdx > 0 && (
                    <button onClick={() => { playClick(); setConceptIdx(i => i - 1) }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm">
                      ← Previous
                    </button>
                  )}
                  <button
                    onClick={() => {
                      playClick()
                      if (conceptIdx < concepts.length - 1) setConceptIdx(i => i + 1)
                      else setStage('lesson')
                    }}
                    className="flex-1 btn-primary py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {conceptIdx < concepts.length - 1 ? 'Next Concept' : '💻 See Code Lesson'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* LESSON */}
          {stage === 'lesson' && (
            <motion.div key="lesson" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="card p-8">
                <h2 className="text-xl font-bold text-white mb-1">📜 Full Code Example — {chapter.concept}</h2>
                <p className="text-gray-400 text-sm mb-4">Study this before the quiz!</p>
                <CodeBlock code={chapter.lesson_code} language="python" />
                <AIExplainer code={chapter.lesson_code} concept={chapter.concept} />
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-200 text-sm" style={sf}>{chapter.tip}</p>
                </div>
                <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-violet-200 text-sm font-semibold">AI-Powered Quiz</p>
                    <p className="text-gray-400 text-xs mt-1">20 unique questions generated fresh every attempt!</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { playClick(); setConceptIdx(0); setStage('concepts') }}
                    className="px-4 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Review Concepts
                  </button>
                  <button onClick={handleStartQuiz}
                    className="flex-1 btn-primary py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Start AI Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {qLoading && (
                <div className="card p-12 text-center">
                  <Loader className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-4" />
                  <p className="text-gray-300 font-semibold" style={sf}>AI crafting your questions...</p>
                  <p className="text-gray-500 text-sm mt-2" style={sf}>Generating 20 unique questions on {chapter.concept}</p>
                </div>
              )}

              {qError && !qLoading && (
                <div className="card p-8 text-center">
                  <p className="text-red-400 mb-4">{qError}</p>
                  <button onClick={() => { playClick(); loadQuestions() }} className="btn-primary px-6 py-2 rounded-lg text-white">Try Again</button>
                </div>
              )}

              {!qLoading && !qError && q && (
                <div className="card p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Question {currentQ + 1} of {questions.length}</span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          q.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                          q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                        }`}>{q.difficulty}</span>
                        <span className="text-yellow-400">⚡ {score} XP</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-magic-light h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <p className="text-white text-base leading-relaxed mb-6" style={sf}>{q.question}</p>

                  <div className="space-y-3 mb-6">
                    {q.choices.map((choice) => {
                      let btnStyle = 'border-gray-700 bg-gray-800/50 hover:border-magic/60 hover:bg-magic/10 cursor-pointer'
                      if (answered) {
                        if (choice.id === q.correct_id)  btnStyle = 'border-green-500 bg-green-500/20 cursor-default'
                        else if (choice.id === selected)  btnStyle = 'border-red-500 bg-red-500/20 cursor-default'
                        else                              btnStyle = 'border-gray-700 bg-gray-800/20 opacity-40 cursor-default'
                      } else if (choice.id === selected) {
                        btnStyle = 'border-magic bg-magic/20'
                      }
                      return (
                        <button key={choice.id} onClick={() => handleAnswer(choice.id)} disabled={answered}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${btnStyle}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-gray-500 text-sm mt-0.5 w-5 shrink-0 font-medium">{choice.id})</span>
                            <span className="text-sm text-gray-200 flex-1" style={{ ...sf, whiteSpace: 'pre-wrap' }}>
                              {choice.text}
                            </span>
                            {answered && choice.id === q.correct_id && <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />}
                            {answered && choice.id === selected && choice.id !== q.correct_id && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-4 text-sm leading-relaxed ${
                        isCorrect ? 'bg-green-500/15 border border-green-500/30 text-green-200'
                                  : 'bg-orange-500/15 border border-orange-500/30 text-orange-200'
                      }`} style={sf}>
                      {feedback}
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between">
                    <AIHint chapterSlug={slug} question={q.question}
                      userAnswer={selected ? q.choices.find(c => c.id === selected)?.text : ''} />
                    {answered && (
                      <button onClick={handleNext}
                        className="btn-primary px-6 py-2 rounded-lg text-white text-sm font-semibold flex items-center gap-2">
                        {currentQ + 1 >= questions.length ? '📊 See Results' : 'Next →'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* RESULTS */}
          {stage === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="card p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-3">{passed ? '🏆' : '📚'}</div>
                  <h2 className="text-2xl font-bold text-white mb-1" style={sf}>
                    {passed ? 'Quest Complete!' : 'Keep Practicing!'}
                  </h2>
                  <p className="text-gray-400" style={sf}>
                    {passed ? `You mastered ${chapter.concept}!` : 'Score 60% or more to unlock next chapter'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{score}</div>
                    <div className="text-gray-400 text-xs mt-1">Total XP</div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{correctCount}/{questions.length}</div>
                    <div className="text-gray-400 text-xs mt-1">Correct</div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-magic-light">
                      {Math.round((correctCount / questions.length) * 100)}%
                    </div>
                    <div className="text-gray-400 text-xs mt-1">Accuracy</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8 max-h-64 overflow-y-auto pr-1">
                  {answers.map((a, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${a.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {a.isCorrect ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                      <span className="text-gray-300 line-clamp-1 flex-1" style={sf}>{a.question}</span>
                      <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                        a.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                        a.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                      }`}>{a.difficulty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => { playClick(); setStage('quiz'); loadQuestions() }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors text-sm">
                    <RotateCcw className="w-4 h-4" /> New Questions
                  </button>
                  <button onClick={() => { playClick(); setConceptIdx(0); setStage('concepts') }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors text-sm">
                    <BookOpen className="w-4 h-4" /> Review
                  </button>
                  <button onClick={() => { playClick(); navigate('/learn') }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors text-sm">
                    <Home className="w-4 h-4" /> Map
                  </button>
                  {passed && (
                    <button onClick={() => { playClick(); navigate('/dashboard') }}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white text-sm font-semibold">
                      <Trophy className="w-4 h-4" /> Dashboard
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
