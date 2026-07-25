import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';

export default function S03_Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  // 📍 1. 에러 메시지를 관리할 상태 추가!
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    // 📍 2. alert 대신 setErrorMessage를 사용하도록 수정!
    // 확실한 검증을 위해 passwordConfirm(비밀번호 확인) 칸이 비어있는지도 추가로 체크했어요.
    if (!email || !code || !password || !passwordConfirm) {
      setErrorMessage('* 모든 정보를 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage('* 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 이상 없으면 에러 메시지 초기화 후 다음 단계 이동
    setErrorMessage('');
    navigate('/role-select');
  };

  const inputBox = (
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    type: 'text' | 'password' = 'text',
    showToggle = false,
    show = false,
    onToggle?: () => void,
  ) => (
    <div
      style={{
        width: '100%',
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
        marginBottom: 24,
      }}
    >
      <input
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          type='button'
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: '#8e8e98',
            flexShrink: 0,
          }}
        >
          {show ? (
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
      )}
    </div>
  );

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
          회원가입
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
          이음 회원이 되어 다양한 서비스를 만나보세요
        </p>

        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', gap: 22, marginBottom: 24 }}>
            <div
              style={{
                flex: 1,
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
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='이메일을 입력하세요'
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
            <button
              onClick={() => alert('인증 코드가 발송되었습니다.')}
              style={{
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
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: '1.55',
                  color: '#f8f9fa',
                  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                인증 요청
              </span>
            </button>
          </div>

          {inputBox('인증 코드를 입력하세요 (6자리)', code, setCode)}
          {inputBox(
            '비밀번호를 입력하세요 (8자 이상)',
            password,
            setPassword,
            'password',
            true,
            showPw,
            () => setShowPw((v) => !v),
          )}
          {inputBox(
            '비밀번호를 다시 입력하세요',
            passwordConfirm,
            setPasswordConfirm,
            'password',
            true,
            showPwConfirm,
            () => setShowPwConfirm((v) => !v),
          )}

          {}
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
            onClick={handleRegister}
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
              marginTop: 16,
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
              회원가입 완료
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
            이미 계정이 있으신가요?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ fontWeight: 600, color: '#0f66e2', cursor: 'pointer' }}
            >
              로그인 하기
            </span>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
