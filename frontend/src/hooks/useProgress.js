/**
 * src/hooks/useProgress.js
 * Tracks completed chapters and scores.
 * Syncs with backend on load, also caches in localStorage for instant UI.
 */

import { useState, useEffect } from 'react'
import { progressAPI } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function useProgress() {
  const { user } = useAuth()

  const storageKey = user ? `progress_${user.username}` : 'progress_guest'

  const load = () => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : { completedChapters: [], scores: {} }
    } catch {
      return { completedChapters: [], scores: {} }
    }
  }

  const [completedChapters, setCompleted] = useState(() => load().completedChapters)
  const [scores, setScores]               = useState(() => load().scores)

  // Sync from backend when user logs in
  useEffect(() => {
    if (!user) return
    progressAPI.getMine()
      .then(res => {
        const data = res.data  // array of { chapter_slug, score, completed }
        if (!Array.isArray(data)) return

        const newCompleted = data
          .filter(p => p.completed)
          .map(p => p.chapter_slug)

        const newScores = {}
        data.forEach(p => { newScores[p.chapter_slug] = p.score })

        setCompleted(newCompleted)
        setScores(newScores)

        // Cache locally
        localStorage.setItem(storageKey, JSON.stringify({
          completedChapters: newCompleted,
          scores: newScores,
        }))
      })
      .catch(() => {
        // Backend unavailable — use local cache
        const cached = load()
        setCompleted(cached.completedChapters)
        setScores(cached.scores)
      })
  }, [user])

  // Call this after finishing a chapter
  const markComplete = (slug, xp) => {
    setCompleted(prev => {
      if (prev.includes(slug)) return prev
      const updated = [...prev, slug]
      const updatedScores = { ...scores, [slug]: xp }
      localStorage.setItem(storageKey, JSON.stringify({
        completedChapters: updated,
        scores: updatedScores,
      }))
      return updated
    })
    setScores(prev => {
      const updated = { ...prev, [slug]: xp }
      return updated
    })
  }

  return {
    completedChapters,
    scores,
    markComplete,
  }
}
