import clsx from 'clsx'

export default function ProgressBar({ percent = 0, label = '', score = 0, className = '' }) {
  return (
    <div className={clsx(
      'flex items-center gap-3 bg-white/4 border border-white/8 rounded-full px-4 py-2',
      className
    )}>
      {label && (
        <span className="text-xs font-cinzel tracking-widest uppercase text-gold whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-magic to-gold rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(200,146,42,0.5)]"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      {score !== undefined && (
        <span className="text-xs font-cinzel text-gold-light whitespace-nowrap">
          ✦ {score} xp
        </span>
      )}
    </div>
  )
}
