import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveRole, roleHome } from '../utils/role';
import { setToken } from '../utils/auth';
import { login } from '../api/auth';
import { ApiError } from '../api/client';
import PageLayout from '../components/common/PageLayout';

export default function S02_Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) {
      setErrorMessage('* 아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ user_id: userId, user_pw: password });
      setToken(res.token, autoLogin);
      saveRole(res.role);
      navigate(roleHome[res.role]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setErrorMessage('* 아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (err instanceof ApiError) {
        setErrorMessage(`* ${err.message}`);
      } else {
        setErrorMessage('* 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        }}
      >
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
          <div style={inputBase}>
            <input
              type='text'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder='아이디를 입력하세요'
              autoComplete='username'
              style={inputStyle}
            />
          </div>

          <div style={inputBase}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder='비밀번호를 입력하세요'
              autoComplete='current-password'
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

          {errorMessage && (
            <p
              style={{
                color: '#ff4d4f',
                fontSize: 20,
                fontWeight: 500,
                margin: '0 0 16px 8px',
                textAlign: 'left',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}
            >
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              height: 81,
              background: loading ? '#8e8e98' : '#0f66e2',
              borderRadius: 50,
              border: 'none',
              boxShadow: '0 0 2px #4188ed',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 60,
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
              {loading ? '로그인 중...' : '로그인'}
            </span>
          </button>

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
