// Usage:
// <Button>시작하기</Button>
// <Button variant="outline" size="sm">취소</Button>
// <Button variant="danger" fullWidth onClick={handleDelete}>삭제</Button>

import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'outline' | 'danger'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-blue-50 active:bg-blue-100',
  danger: 'bg-tertiary text-white hover:opacity-90 active:opacity-80',
}

const sizeStyles: Record<Size, string> = {
  md: 'h-[81px] px-6 text-[28px] rounded-2xl font-bold',
  sm: 'h-[46px] px-5 text-[22px] rounded-xl font-semibold',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center transition-colors cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
