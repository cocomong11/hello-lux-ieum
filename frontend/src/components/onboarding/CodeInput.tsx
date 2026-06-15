// Usage:
// <CodeInput length={6} value={code} onChange={setCode} />

import { useRef } from 'react'

interface CodeInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
}

export default function CodeInput({ length = 6, value, onChange }: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const chars = value.padEnd(length, '').slice(0, length).split('')

  const handleChange = (index: number, char: string) => {
    const sanitized = char.replace(/\s/g, '').toUpperCase().slice(-1)
    const next = [...chars]
    next[index] = sanitized
    const newVal = next.join('').trimEnd()
    onChange(newVal.slice(0, length))
    if (sanitized && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (chars[index]) {
        const next = [...chars]
        next[index] = ''
        onChange(next.join('').trimEnd())
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\s/g, '').toUpperCase().slice(0, length)
    onChange(pasted)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={chars[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={[
            'w-[84px] h-[105px] rounded-[10px] border text-center text-[36px] font-bold text-neutral-10',
            'bg-[rgba(65,136,237,0.05)] outline-none transition-colors',
            'focus:border-primary focus:shadow-[0_0_4px_#4188ed]',
            chars[i] ? 'border-primary shadow-[0_0_4px_#4188ed]' : 'border-neutral-80 shadow-[0_0_4px_#4188ed]',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
