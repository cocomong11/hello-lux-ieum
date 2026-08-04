import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { checkUserId } from '../api/auth';
import { ApiError } from '../api/client';
import { savePendingSignup } from '../utils/pendingSignup';

const isValidBirth = (raw: string) => {
  if (!/^\d{8}$/.test(raw)) return false;
  const y = Number(raw.slice(0, 4));
  const m = Number(raw.slice(4, 6));
  const d = Number(raw.slice(6, 8));
  const now = new Date().getFullYear();
  if (y < 1900 || y > now) return false;
  if (m < 1 || m > 12) return false;
  const last = new Date(y, m, 0).getDate();
  return d >= 1 && d <= last;
};

export default function S03_Register() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [idChecked, setIdChecked] = useState(false);
  const [idChecking, setIdChecking] = useState(false);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckId = async () => {
    if (!userId) {
      setErrorMessage('* 아이디를 입력해 주세요.');
      return;
    }
    if (!/^[A-Za-z0-9]{4,20}$/.test(userId)) {
      setErrorMessage('* 아이디는 영문·숫자 4~20자로 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setIdChecking(true);

    try {
      const res = await checkUserId(userId);
      if (res.available) {
        setIdChecked(true);
        setErrorMessage('');
      } else {
        setIdChecked(false);
        setErrorMessage('* 이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      setIdChecked(false);
      setErrorMessage(
        err instanceof ApiError
          ? `* ${err.message}`
          : '* 아이디 확인에 실패했습니다.',
      );
    } finally {
      setIdChecking(false);
    }
  };

  const handleRegister = () => {
    if (!userId || !name || !birth || !password || !passwordConfirm) {
      setErrorMessage('* 모든 정보를 입력해 주세요.');
      return;
    }
    if (!idChecked) {
      setErrorMessage('* 아이디 중복 확인을 해주세요.');
      return;
    }
    if (!isValidBirth(birth)) {
      setErrorMessage(
        '* 생년월일을 8자리로 정확히 입력해 주세요. (예: 19900101)',
      );
      return;
    }
    if (password.length < 8) {
      setErrorMessage('* 비밀번호는 8자 이상으로 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage('* 비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMessage('');

    savePendingSignup({
      user_id: userId,
      user_pw: password,
      name,
      birth_date: `${birth.slice(0, 4)}-${birth.slice(4, 6)}-${birth.slice(6, 8)}`,
      // TODO: 화면에 전화번호 입력란이 없어 임시 더미 값을 사용합니다.
      // 백엔드 RegisterRequest.phone은 필수(숫자만 10~11자리)입니다.
      phone: '01000000000',
    });

    navigate('/role-select');
  };

  type InputBoxProps = {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    type?: 'text' | 'password' | 'tel';
    inputMode?: 'text' | 'numeric' | 'tel';
    maxLength?: number;
    showToggle?: boolean;
    show?: boolean;
    onToggle?: () => void;
  };

  const inputBox = ({
    placeholder,
    value,
    onChange,
    type = 'text',
    inputMode,
    maxLength,
    showToggle = false,
    show = false,
    onToggle,
  }: InputBoxProps) => (
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
        inputMode={inputMode}
        maxLength={maxLength}
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
                type='text'
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setIdChecked(false);
                }}
                placeholder='아이디를 입력하세요 (영문·숫자 4자 이상)'
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
              onClick={handleCheckId}
              disabled={idChecking}
              style={{
                width: 172,
                height: 81,
                background: idChecked ? '#8e8e98' : '#0f66e2',
                borderRadius: 50,
                border: 'none',
                boxShadow: '0 0 2px #4188ed',
                cursor: idChecking ? 'not-allowed' : 'pointer',
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
                {idChecking
                  ? '확인 중...'
                  : idChecked
                    ? '확인 완료'
                    : '중복 확인'}
              </span>
            </button>
          </div>

          {inputBox({
            placeholder: '이름을 입력하세요',
            value: name,
            onChange: setName,
          })}
          {inputBox({
            placeholder: '생년월일 8자리를 입력하세요 (예: 19900101)',
            value: birth,
            onChange: (v) => setBirth(v.replace(/\D/g, '').slice(0, 8)),
            inputMode: 'numeric',
            maxLength: 8,
          })}
          {inputBox({
            placeholder: '비밀번호를 입력하세요 (8자 이상)',
            value: password,
            onChange: setPassword,
            type: 'password',
            showToggle: true,
            show: showPw,
            onToggle: () => setShowPw((v) => !v),
          })}
          {inputBox({
            placeholder: '비밀번호를 다시 입력하세요',
            value: passwordConfirm,
            onChange: setPasswordConfirm,
            type: 'password',
            showToggle: true,
            show: showPwConfirm,
            onToggle: () => setShowPwConfirm((v) => !v),
          })}

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
              다음
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
