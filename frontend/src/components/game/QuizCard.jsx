import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { CheckCircle2, XCircle, ChevronRight, Sparkles } from 'lucide-react'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuizCard({ chapter, onComplete }) {
  const [selected, setSelected]   = useState(null)   // choice id
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (choice) => {
    if (submitted) return
    setSelected(choice.id)
  }

  const handleSubmit = () => {
    if (!selected || submitted) return
    setSubmitted(true)

    const choice = chapter.choices.find((c) => c.id === selected)
    const xp = choice.correct ? chapter.xp : Math.round(chapter.xp * 0.3)
    // Delay so user can read feedback, then notify parent
    setTimeout(() => onComplete(choice.correct, xp), 2400)
  }

  const selectedChoice = chapter.choices.find((c) => c.id === selected)
  const isCorrect = submitted && selectedChoice?.correct

  return (
    <div className="space-y-4">
      {/* Question */}
      <p className="text-parchment/90 font-cinzel text-sm leading-relaxed">
        {chapter.question.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>

      {/* Choices */}
      <div className="space-y-2.5">
        {chapter.choices.map((choice, idx) => {
          const isSelected = selected === choice.id
          const showCorrect = submitted && choice.correct
          const showWrong   = submitted && isSelected && !choice.correct

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={submitted}
              className={clsx(
                'choice-btn w-full',
                isSelected && !submitted && 'border-gold/60 bg-gold/10',
                showCorrect && 'correct',
                showWrong   && 'wrong',
              )}
            >
              <span className={clsx(
                'w-6 h-6 min-w-[24px] rounded flex items-center justify-center text-xs font-cinzel',
                'bg-white/6',
                isSelected && !submitted && 'bg-gold/20 text-gold',
                showCorrect && 'bg-sage/30 text-green-300',
                showWrong   && 'bg-red-900/30 text-red-400',
              )}>
                {LETTERS[idx]}
              </span>
              <span className="whitespace-pre-line text-left leading-snug">
                {choice.text}
              </span>
              {showCorrect && <CheckCircle2 className="w-4 h-4 text-sage-light ml-auto shrink-0" />}
              {showWrong   && <XCircle     className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Submit button (before answering) */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Cast Your Answer
        </button>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={isCorrect ? 'feedback-success' : 'feedback-fail'}
          >
            <p className="text-sm font-cinzel leading-relaxed">
              {isCorrect
                ? chapter.feedback.success
                : chapter.feedback.fail}
            </p>
            <p className="text-xs mt-2 opacity-60">
              {isCorrect ? `+${chapter.xp} XP earned!` : `+${Math.round(chapter.xp * 0.3)} XP — keep practising!`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
