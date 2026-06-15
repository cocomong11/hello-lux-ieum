import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function S03_Register() {
  const navigate = useNavigate()
  const [scale, setScale] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)

  useEffect(() => {
    const update = () => setScale(window.innerWidth / 1920)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const inputBox = (
    top: number,
    width: number,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    type: 'text' | 'password' = 'text',
    showToggle = false,
    show = false,
    onToggle?: () => void
  ) => (
    <div
      style={{
        position: 'absolute',
        left: 636,
        top,
        width,
        height: 81,
        border: '1px solid #8e8e98',
        borderRadius: 10,
        boxShadow: '0 0 4px #4188ed',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 29,
        paddingRight: showToggle ? 16 : 29,
        boxSizing: 'border-box',
      }}
    >
      <input
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: '1.55',
          color: '#0d0d0d',
          fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
        }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#8e8e98', flexShrink: 0 }}
        >
          {show ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#f8f9fa' }}>
      <div
        style={{
          width: 1920,
          height: 1080,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          background: '#f8f9fa',
          fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
        }}
      >
        {/* Title */}
        <p style={{
          position: 'absolute',
          left: 636,
          top: 160,
          fontSize: 36,
          fontWeight: 700,
          lineHeight: '1.35',
          color: '#0d0d0d',
          whiteSpace: 'nowrap',
          margin: 0,
        }}>회원가입</p>

        {/* Subtitle */}
        <p style={{
          position: 'absolute',
          left: 636,
          top: 218,
          fontSize: 22,
          fontWeight: 400,
          lineHeight: '1.55',
          color: '#797980',
          whiteSpace: 'nowrap',
          margin: 0,
        }}>이음 회원이 되어 다양한 서비스를 만나보세요</p>

        {/* Email input (shorter, 454px) */}
        <div
          style={{
            position: 'absolute',
            left: 636,
            top: 318,
            width: 454,
            height: 81,
            border: '1px solid #8e8e98',
            borderRadius: 10,
            boxShadow: '0 0 4px #4188ed',
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 29,
            paddingRight: 29,
            boxSizing: 'border-box',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 22,
              fontWeight: 400,
              lineHeight: '1.55',
              color: '#0d0d0d',
              fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
            }}
          />
        </div>

        {/* 인증 요청 button */}
        <button
          onClick={() => alert('인증 코드가 발송되었습니다.')}
          style={{
            position: 'absolute',
            left: 1112,
            top: 318,
            width: 172,
            height: 81,
            background: '#0f66e2',
            borderRadius: 50,
            border: 'none',
            boxShadow: '0 0 2px #4188ed',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: '1.55',
            color: '#f8f9fa',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
            whiteSpace: 'nowrap',
          }}>인증 요청</span>
        </button>

        {/* 인증 코드 input */}
        {inputBox(423, 648, '인증 코드를 입력하세요 (6자리)', code, setCode)}

        {/* Password input */}
        {inputBox(528, 648, '비밀번호를 입력하세요 (8자 이상)', password, setPassword, 'password', true, showPw, () => setShowPw(v => !v))}

        {/* Password confirm input */}
        {inputBox(633, 648, '비밀번호를 다시 입력하세요', passwordConfirm, setPasswordConfirm, 'password', true, showPwConfirm, () => setShowPwConfirm(v => !v))}

        {/* 회원가입 완료 button */}
        <button
          onClick={() => navigate('/role-select')}
          style={{
            position: 'absolute',
            left: 636,
            top: 738,
            width: 648,
            height: 81,
            background: '#0f66e2',
            borderRadius: 50,
            border: 'none',
            boxShadow: '0 0 2px #4188ed',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: '1.55',
            color: '#f8f9fa',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          }}>회원가입 완료</span>
        </button>

        {/* 로그인 하기 */}
        <p style={{
          position: 'absolute',
          left: '50%',
          top: 885,
          transform: 'translateX(-50%)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: '1.55',
          color: '#8e8e98',
          whiteSpace: 'nowrap',
          margin: 0,
          textAlign: 'center',
        }}>
          이미 계정이 있으신가요?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              fontWeight: 600,
              color: '#0f66e2',
              cursor: 'pointer',
            }}
          >로그인 하기</span>
        </p>
      </div>
    </div>
  )
}
