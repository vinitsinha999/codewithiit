/**
 * src/components/game/Certificate.jsx
 * Beautiful downloadable certificate for chapter/course completion.
 * Uses HTML Canvas to generate a PNG download.
 * - Certificate ID is unique per user (hash based) — same every time
 * - Saves to DB when user downloads (for admin tracking)
 */

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CHAPTERS } from '../../data/chapters'
import apiClient from '../../api/client'

// ── Consistent unique ID — same for same username, always ──────────
function generateCertId(username = 'user') {
  let hash = 0
  const str = username.toLowerCase().trim()
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const code = Math.abs(hash).toString(36).substr(0, 6).toUpperCase().padEnd(6, '0')
  return `CWI-${code}-${new Date().getFullYear()}`
}

export default function Certificate({ onClose }) {
  const { user }          = useAuth()
  const canvasRef         = useRef(null)
  const [ready, setReady] = useState(false)

  const totalChapters = CHAPTERS.length
  const today         = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  // Consistent ID — same every time for same user
  const certId = generateCertId(user?.username)

  useEffect(() => {
    const canvas  = canvasRef.current
    if (!canvas) return
    const ctx     = canvas.getContext('2d')
    const W = 900, H = 640
    canvas.width  = W
    canvas.height = H

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0,   '#0d0a1e')
    bg.addColorStop(0.5, '#130d2e')
    bg.addColorStop(1,   '#0a1628')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // ── Purple glow in center ──
    const glow = ctx.createRadialGradient(W/2, 200, 0, W/2, 200, 380)
    glow.addColorStop(0,   'rgba(124,58,237,0.12)')
    glow.addColorStop(1,   'rgba(124,58,237,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)

    // ── Decorative border ──
    const drawBorder = (offset, color, lineWidth) => {
      ctx.strokeStyle = color
      ctx.lineWidth   = lineWidth
      ctx.strokeRect(offset, offset, W - offset * 2, H - offset * 2)
    }
    drawBorder(12, '#7c3aed', 2)
    drawBorder(18, 'rgba(124,58,237,0.4)', 1)
    drawBorder(24, 'rgba(124,58,237,0.15)', 1)

    // ── Corner ornaments ──
    const drawCorner = (cx, cy, fx, fy) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(fx, fy)
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth   = 1.5
      ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, 0); ctx.lineTo(40, 0); ctx.stroke()
      ctx.strokeStyle = 'rgba(167,139,250,0.5)'
      ctx.lineWidth   = 1
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, 14); ctx.stroke()
      ctx.fillStyle   = '#7c3aed'
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle   = 'rgba(167,139,250,0.6)'
      ctx.beginPath(); ctx.arc(40, 0, 2, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(0, 40, 2, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
    drawCorner(14,     14,      1,  1)
    drawCorner(W - 14, 14,     -1,  1)
    drawCorner(14,     H - 14,  1, -1)
    drawCorner(W - 14, H - 14, -1, -1)

    // ── Stars background ──
    for (let i = 0; i < 70; i++) {
      const sx = Math.random() * W
      const sy = Math.random() * H
      const sr = Math.random() * 1.5
      ctx.fillStyle = `rgba(167,139,250,${(Math.random() * 0.5 + 0.15).toFixed(2)})`
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── Divider helper ──
    const drawDivider = (y) => {
      ctx.strokeStyle = 'rgba(124,58,237,0.6)'
      ctx.lineWidth   = 1
      ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(W/2 - 14, y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(W/2 + 14, y); ctx.lineTo(W - 80, y); ctx.stroke()
      ctx.fillStyle = '#a78bfa'
      ctx.save(); ctx.translate(W/2, y); ctx.rotate(Math.PI / 4)
      ctx.fillRect(-5, -5, 10, 10); ctx.restore()
    }

    ctx.textAlign = 'center'

    // ── Logo / Brand top ──
    ctx.fillStyle     = '#c4a0ff'
    ctx.font          = 'bold 14px Georgia, serif'
    ctx.letterSpacing = '4px'
    ctx.fillText('⚔  CODE WITH IIT  🐍', W / 2, 70)
    drawDivider(84)

    // ── "Proudly Presents" ──
    ctx.fillStyle     = 'rgba(155,114,208,0.9)'
    ctx.font          = 'italic 13px Georgia, serif'
    ctx.letterSpacing = '3px'
    ctx.fillText('PROUDLY PRESENTS', W / 2, 114)

    // ── "Certificate" ──
    ctx.fillStyle   = '#e9d5ff'
    ctx.font        = 'bold 50px Georgia, serif'
    ctx.letterSpacing = '3px'
    ctx.shadowColor = 'rgba(167,139,250,0.4)'
    ctx.shadowBlur  = 20
    ctx.fillText('Certificate', W / 2, 175)
    ctx.shadowBlur  = 0

    // ── "of Achievement" ──
    ctx.fillStyle     = '#7c3aed'
    ctx.font          = '13px Georgia, serif'
    ctx.letterSpacing = '5px'
    ctx.fillText('OF ACHIEVEMENT', W / 2, 202)
    drawDivider(218)

    // ── "This certifies that" ──
    ctx.fillStyle     = 'rgba(155,114,208,0.9)'
    ctx.font          = 'italic 15px Georgia, serif'
    ctx.letterSpacing = '1px'
    ctx.fillText('This certificate is proudly awarded to', W / 2, 255)

    // ── Username ──
    const gradient = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0)
    gradient.addColorStop(0,   '#c8922a')
    gradient.addColorStop(0.5, '#ffd700')
    gradient.addColorStop(1,   '#c8922a')
    ctx.fillStyle     = gradient
    ctx.font          = 'bold 44px Georgia, serif'
    ctx.letterSpacing = '2px'
    ctx.shadowColor   = 'rgba(255,215,0,0.3)'
    ctx.shadowBlur    = 15
    ctx.fillText(user?.username || 'Adventurer', W / 2, 312)
    ctx.shadowBlur    = 0

    // ── Underline under name ──
    const nameWidth = ctx.measureText(user?.username || 'Adventurer').width
    ctx.strokeStyle = 'rgba(255,215,0,0.4)'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(W/2 - nameWidth/2, 322)
    ctx.lineTo(W/2 + nameWidth/2, 322)
    ctx.stroke()

    // ── "has successfully completed" ──
    ctx.fillStyle     = 'rgba(196,181,212,0.9)'
    ctx.font          = '14px Georgia, serif'
    ctx.letterSpacing = '0.5px'
    ctx.fillText('For successfully completing the Python Mastery Quest', W / 2, 355)
    ctx.fillText(`— all ${totalChapters} chapters — from Python basics to advanced wizardry.`, W / 2, 376)

    // ── Skill pills ──
    const skills  = ['Python Basics', 'Data Structures', 'OOP', 'File I/O', 'Advanced Python', 'Problem Solving']
    const pillW   = 124, pillH = 20, gap = 8
    const totalPW = skills.length * pillW + (skills.length - 1) * gap
    let px        = W / 2 - totalPW / 2

    skills.forEach(skill => {
      ctx.fillStyle   = 'rgba(124,58,237,0.25)'
      ctx.strokeStyle = 'rgba(124,58,237,0.5)'
      ctx.lineWidth   = 1
      const r = 10
      ctx.beginPath()
      ctx.moveTo(px + r, 396); ctx.lineTo(px + pillW - r, 396)
      ctx.quadraticCurveTo(px + pillW, 396, px + pillW, 396 + r)
      ctx.lineTo(px + pillW, 396 + pillH - r)
      ctx.quadraticCurveTo(px + pillW, 396 + pillH, px + pillW - r, 396 + pillH)
      ctx.lineTo(px + r, 396 + pillH)
      ctx.quadraticCurveTo(px, 396 + pillH, px, 396 + pillH - r)
      ctx.lineTo(px, 396 + r)
      ctx.quadraticCurveTo(px, 396, px + r, 396)
      ctx.closePath()
      ctx.fill(); ctx.stroke()
      ctx.fillStyle     = '#c4a0ff'
      ctx.font          = '10px Georgia, serif'
      ctx.letterSpacing = '0.3px'
      ctx.fillText(skill, px + pillW / 2, 410)
      px += pillW + gap
    })

    // ── Footer divider ──
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(80, 436); ctx.lineTo(W - 80, 436); ctx.stroke()

    // ── Footer 3 columns ──
    ;[
      { label: 'Platform Director',  value: 'Code with IIT', x: 150    },
      { label: 'Date of Completion', value: today,           x: W / 2  },
      { label: 'Certificate ID',     value: certId,          x: W - 150},
    ].forEach(({ label, value, x }) => {
      ctx.fillStyle     = '#e9d5ff'
      ctx.font          = 'bold 13px Georgia, serif'
      ctx.letterSpacing = '0.5px'
      ctx.fillText(value, x, 476)
      ctx.strokeStyle = 'rgba(124,58,237,0.4)'
      ctx.lineWidth   = 1
      ctx.beginPath(); ctx.moveTo(x - 65, 484); ctx.lineTo(x + 65, 484); ctx.stroke()
      ctx.fillStyle     = 'rgba(155,114,208,0.8)'
      ctx.font          = 'italic 11px Georgia, serif'
      ctx.letterSpacing = '0.5px'
      ctx.fillText(label, x, 498)
    })

    // ── Center seal ──
    const sx = W / 2, sy = 469
    const sealBg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 36)
    sealBg.addColorStop(0, 'rgba(124,58,237,0.2)')
    sealBg.addColorStop(1, 'rgba(124,58,237,0.05)')
    ctx.fillStyle = sealBg
    ctx.beginPath(); ctx.arc(sx, sy, 36, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(sx, sy, 36, 0, Math.PI * 2); ctx.stroke()
    ctx.strokeStyle = 'rgba(124,58,237,0.3)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(sx, sy, 42, 0, Math.PI * 2); ctx.stroke()
    ctx.font = '26px serif'
    ctx.fillText('🏆', sx, sy + 9)
    ctx.fillStyle     = '#a78bfa'
    ctx.font          = 'bold 6px Georgia, serif'
    ctx.letterSpacing = '1.5px'
    ctx.fillText('CERTIFIED', sx, sy + 24)

    // ── IIT Patna tagline ──
    ctx.fillStyle     = 'rgba(155,114,208,0.5)'
    ctx.font          = '11px Georgia, serif'
    ctx.letterSpacing = '2px'
    ctx.fillText('Code with IIT  ·  Python Learning Platform', W / 2, 556)

    // ── Bottom URL ──
    ctx.fillStyle     = 'rgba(107,77,154,0.6)'
    ctx.font          = '10px Georgia, serif'
    ctx.letterSpacing = '2px'
    ctx.fillText('codewithiit.vercel.app', W / 2, 576)
    drawDivider(590)

    setReady(true)
  }, [user])

  // ── Download + save to DB ───────────────────────────────────────
  const download = async () => {
    // Save to DB silently (don't block download if API fails)
    try {
      await apiClient.post('/api/certificates/issue', { cert_id: certId })
    } catch { }

    // Download PNG
    const canvas = canvasRef.current
    const link   = document.createElement('a')
    link.download = `CodeWithIIT_Certificate_${user?.username || 'user'}.png`
    link.href     = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(124,58,237,0.4)' }}
        />

        {/* Controls */}
        {ready && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={download}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)'
              }}
            >
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm transition-colors"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
