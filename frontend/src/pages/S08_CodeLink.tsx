import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole, roleHome } from '../utils/role';
import PageLayout from '../components/common/PageLayout';

export default function S02_Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  const inputBase: React.CSSProperties = {
    width: '100%',
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
    marginBottom: 24,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 22,
    fontWeight: 400,
    lineHeight: '1.55',
    color: '#0d0d0d',
    fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
  };

  return (
    <PageLayout scrollable>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
          minHeight: 'calc(100vh - 68px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        <p
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: '1.35',
            color: '#0d0d0d',
            margin: '0 0 16px 0',
          }}
        >
          로그인
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            fontWeight: 400,
            lineHeight: '1.55',
            color: '#797980',
            margin: '0 0 50px 0',
          }}
        >
          이음 서비스를 더 편리하게 이용해보세요
        </p>

        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Email input */}
          <div style={inputBase}>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='이메일을 입력하세요'
              style={inputStyle}
            />
          </div>

          {/* Password input */}
          <div style={inputBase}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='비밀번호를 입력하세요'
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type='button'
              onClick={() => setShowPw((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#8e8e98',
                flexShrink: 0,
              }}
            >
              {showPw ? (
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94' />
                  <path d='M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19' />
                  <line x1='1' y1='1' x2='23' y2='23' />
                </svg>
              ) : (
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                  <circle cx='12' cy='12' r='3' />
                </svg>
              )}
            </button>
          </div>

          {/* Auto login checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 40,
              cursor: 'pointer',
            }}
            onClick={() => setAutoLogin((v) => !v)}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: autoLogin ? '1px solid #4188ed' : '1px solid #8e8e98',
                background: autoLogin ? '#4188ed' : '#f8f9fa',
                boxShadow: '0 0 4px #797980',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {autoLogin && (
                <svg width='14' height='10' viewBox='0 0 14 10' fill='none'>
                  <path
                    d='M1 5L5 9L13 1'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </div>
            <p
              style={{
                fontSize: 22,
                fontWeight: 400,
                lineHeight: '1.55',
                color: '#0d0d0d',
                margin: 0,
              }}
            >
              자동 로그인
            </p>
          </div>

          {/* Login button */}
          <button
            onClick={() => {
              const role = getRole();
              navigate(role ? roleHome[role] : '/role-select');
            }}
            style={{
              width: '100%',
              height: 81,
              background: '#0f66e2',
              borderRadius: 50,
              border: 'none',
              boxShadow: '0 0 2px #4188ed',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '1.55',
                color: '#f8f9fa',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}
            >
              로그인
            </span>
          </button>

          {/* 아이디 찾기 | 비밀번호 찾기 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              marginBottom: 60,
            }}
          >
            <button
              type='button'
              onClick={() => navigate('/find-id')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                margin: 0,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#0d0d0d',
                cursor: 'pointer',
              }}
            >
              아이디 찾기
            </button>
            <span
              style={{
                display: 'inline-block',
                width: 1,
                height: 20,
                background: '#8e8e98',
                flexShrink: 0,
              }}
            />
            <button
              type='button'
              onClick={() => navigate('/find-password')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                margin: 0,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#0d0d0d',
                cursor: 'pointer',
              }}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* 회원가입 하기 */}
          <p
            style={{
              fontSize: 22,
              fontWeight: 400,
              lineHeight: '1.55',
              color: '#8e8e98',
              margin: 0,
              textAlign: 'center',
            }}
          >
            아직 이음 회원이 아니신가요?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ fontWeight: 600, color: '#0f66e2', cursor: 'pointer' }}
            >
              회원가입 하기
            </span>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
