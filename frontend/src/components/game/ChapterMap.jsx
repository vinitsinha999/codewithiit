import clsx from 'clsx'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CHAPTERS } from '@/data/chapters'

export default function ChapterMap({ currentChapterId, completedIds = [] }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center gap-0 flex-wrap row-gap-2">
      {CHAPTERS.map((ch, idx) => {
        const done    = completedIds.includes(ch.id)
        const current = ch.id === currentChapterId
        const locked  = !done && !current && ch.id > currentChapterId

        return (
          <div key={ch.id} className="flex items-center">
            {/* Node */}
            <button
              onClick={() => !locked && navigate(`/learn/${ch.slug}`)}
              title={`Ch.${ch.id}: ${ch.concept}`}
              disabled={locked}
              className={clsx(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center text-base',
                'transition-all duration-300 relative group',
                done    && 'bg-magic border-magic-light shadow-[0_0_12px_rgba(123,79,207,0.5)] cursor-pointer hover:scale-110',
                current && 'bg-gold border-gold-light shadow-[0_0_16px_rgba(200,146,42,0.6)] cursor-pointer hover:scale-110 font-bold text-ink',
                locked  && 'bg-transparent border-white/15 text-white/30 cursor-not-allowed',
              )}
            >
              {done ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={clsx('text-sm', current ? 'text-ink' : 'text-white/40')}>
                  {ch.emoji}
                </span>
              )}

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-panel border border-white/10
                              text-parchment/80 text-xs font-cinzel px-2 py-1 rounded whitespace-nowrap
                              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {ch.concept}
              </div>
            </button>

            {/* Connector */}
            {idx < CHAPTERS.length - 1 && (
              <div className={clsx(
                'w-6 h-0.5 transition-colors duration-500',
                completedIds.includes(ch.id) ? 'bg-magic' : 'bg-white/10',
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
