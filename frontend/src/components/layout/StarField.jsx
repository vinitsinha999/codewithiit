import { useMemo } from 'react'

export default function StarField({ count = 90 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: (Math.random() * 3 + 2).toFixed(1),
      delay: -(Math.random() * 4).toFixed(1),
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            top: `${s.top}%`,
            left: `${s.left}%`,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
