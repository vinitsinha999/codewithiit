/**
 * CodeBlock.jsx
 * Uses react-syntax-highlighter for reliable, clean Python highlighting.
 * No more manual regex — library handles all edge cases.
 */

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'python', title = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          {title && (
            <span className="ml-2 text-xs text-white/40 font-mono">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-widest font-mono">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="text-white/40 hover:text-white/80 transition-colors p-1 rounded"
            title="Copy code"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-green-400" />
              : <Copy className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>

      {/* Code — rendered by react-syntax-highlighter */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.6',
        }}
        codeTagProps={{
          style: { fontFamily: 'ui-monospace, monospace' }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}