// Usage:
// <Input label="이메일" placeholder="이메일을 입력하세요" />
// <Input type="password" label="비밀번호" placeholder="비밀번호를 입력하세요 (8자 이상)" errorMessage="비밀번호가 일치하지 않습니다" />
// <Input type="date" label="생년월일" placeholder="생년월일 (8자리)" />

import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'

type InputType = 'text' | 'password' | 'date'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType
  label?: string
  errorMessage?: string
}

export default function Input({
  type = 'text',
  label,
  errorMessage,
  id,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase()
  const resolvedType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[22px] font-semibold text-neutral-10">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          className={[
            'w-full h-[81px] px-[29px] rounded-xl border text-[28px] text-neutral-10 bg-white',
            'placeholder:text-neutral-60 outline-none transition-colors',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            type === 'date' ? 'cursor-pointer' : '',
            type === 'password' ? 'pr-14' : '',
            errorMessage
              ? 'border-tertiary focus:border-tertiary focus:ring-tertiary/20'
              : 'border-neutral-80',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-60 hover:text-neutral-10 transition-colors p-1"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="text-[18px] text-tertiary" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
