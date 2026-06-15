import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../utils/role';

const imgLinkIcon =
  'https://www.figma.com/api/mcp/asset/aa1b8209-b761-4d7b-9b15-e3b34cdf625e';

// 더미 환자 정보
const DUMMY_PATIENT = {
  name: '홍길동',
  age: 80,
  level: '보통',
};

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

export default function S08_CodeLink() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState('');
  const [patient, setPatient] = useState<typeof DUMMY_PATIENT | null>(null);

  const isComplete = code.length === 6;

  const handleChange = (raw: string) => {
    const next = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);

    setCode(next);

    if (next.length === 6) {
      setPatient(DUMMY_PATIENT);
    } else {
      setPatient(null);
    }
  };

  const handleConfirm = () => {
    if (!isComplete) return;

    const role = getRole();

    if (role === 'guardian') {
      navigate('/guardian-home');
    } else if (role === 'doctor') {
      navigate('/doctor-home');
    } else {
      navigate('/patient-home');
    }
  };

  return (
    <div
      style={{
        ...F,
        width: '100vw',
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowX: 'hidden',
      }}
    >
      {/* 실제 화면 영역 */}
      <main
        style={{
          width: 393,
          minHeight: 852,
          background: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 52,
          boxSizing: 'border-box',
        }}
      >
        {/* 아이콘 */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <img
            src={imgLinkIcon}
            alt='연동 아이콘'
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* 제목 */}
        <h1
          style={{
            ...F,
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#0d0d0d',
            textAlign: 'center',
          }}
        >
          환자 코드 연동
        </h1>

        {/* 설명 */}
        <p
          style={{
            ...F,
            margin: '4px 0 0',
            fontSize: 7,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            textAlign: 'center',
          }}
        >
          환자가 발급받은 6자리 코드를 입력해주세요
        </p>

        {/* 코드 입력 영역 */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            position: 'relative',
            display: 'flex',
            gap: 7,
            marginTop: 21,
            cursor: 'text',
          }}
        >
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={6}
            inputMode='text'
            autoComplete='off'
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              border: 'none',
              outline: 'none',
              pointerEvents: 'none',
            }}
          />

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: 'rgba(65, 136, 237, 0.05)',
                border: '1px solid #4188ed',
                boxShadow: '0 0 4px rgba(65, 136, 237, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  ...F,
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: '#0d0d0d',
                }}
              >
                {code[index] ?? ''}
              </span>
            </div>
          ))}
        </div>

        {/* 환자 정보 미리보기 */}
        {patient && (
          <div
            style={{
              width: 184,
              minHeight: 34,
              marginTop: 14,
              background: 'rgba(65, 136, 237, 0.05)',
              border: '1px solid #4188ed',
              borderRadius: 4,
              boxShadow: '0 0 4px rgba(65, 136, 237, 0.35)',
              padding: '7px 9px',
              boxSizing: 'border-box',
            }}
          >
            <p
              style={{
                ...F,
                margin: 0,
                fontSize: 8,
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#0d0d0d',
              }}
            >
              환자 정보 미리보기
            </p>

            <p
              style={{
                ...F,
                margin: '4px 0 0',
                fontSize: 6,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
              }}
            >
              이름 : {patient.name} / 나이 : {patient.age}세 / 지원 수준 :{' '}
              {patient.level}
            </p>
          </div>
        )}

        {/* 연동 확인 버튼 */}
        <button
          onClick={handleConfirm}
          disabled={!isComplete}
          style={{
            ...F,
            width: 184,
            height: 25,
            marginTop: 12,
            border: 'none',
            borderRadius: 50,
            background: isComplete ? '#0f66e2' : '#dddde6',
            color: isComplete ? '#f8f9fa' : '#8e8e98',
            fontSize: 7,
            fontWeight: 700,
            lineHeight: 1.55,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            boxShadow: isComplete ? '0 0 4px rgba(65, 136, 237, 0.45)' : 'none',
          }}
        >
          연동 확인
        </button>
      </main>
    </div>
  );
}
