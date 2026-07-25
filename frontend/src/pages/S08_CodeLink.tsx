import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../utils/role';
import PageLayout from '../components/common/PageLayout';
import imgLinkIcon from '../assets/link.png'; // 연동 아이콘

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

    // 💡 라우터 설정에 맞춰서 경로를 수정해 드렸어요!
    if (role === 'guardian') {
      navigate('/caregiver-home');
    } else if (role === 'doctor') {
      navigate('/doctor-home');
    } else {
      navigate('/patient-home');
    }
  };

  return (
    <PageLayout scrollable>
      <div
        style={{
          ...F,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
          minHeight: 'calc(100vh - 68px)',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단 아이콘 (로그인 화면 텍스트 사이즈에 맞게 살짝 키웠어요) */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            overflow: 'hidden',
            marginBottom: 24,
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

        {/* Title (S02 로그인과 완벽 일치) */}
        <p
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: '1.35',
            color: '#0d0d0d',
            margin: '0 0 16px 0',
          }}
        >
          환자 코드 연동
        </p>

        {/* Subtitle (S02 로그인과 완벽 일치) */}
        <p
          style={{
            fontSize: 22,
            fontWeight: 400,
            lineHeight: '1.55',
            color: '#797980',
            margin: '0 0 50px 0',
          }}
        >
          환자가 발급받은 6자리 코드를 입력해주세요
        </p>

        {/* 중앙 컨텐츠 영역 (S02처럼 648px로 고정) */}
        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // 가운데 정렬 추가
          }}
        >
          {/* 코드 입력 영역 */}
          <div
            onClick={() => inputRef.current?.focus()}
            style={{
              position: 'relative',
              display: 'flex',
              gap: 16, // 박스 사이 간격
              cursor: 'text',
              width: '100%',
              justifyContent: 'space-between', // 648px 안에서 일정하게 띄우기
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
                  width: 90, // 로그인 폼 크기에 맞춰 큼직하게 변경!
                  height: 90,
                  borderRadius: 10,
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
                    fontSize: 36, // 글자 크기도 시원하게!
                    fontWeight: 700,
                    color: '#0d0d0d',
                  }}
                >
                  {code[index] ?? ''}
                </span>
              </div>
            ))}
          </div>

          {/* 환자 정보 미리보기 (넓어진 크기에 맞춰 디자인 조정) */}
          {patient && (
            <div
              style={{
                width: '100%',
                marginTop: 30,
                background: 'rgba(65, 136, 237, 0.05)',
                border: '1px solid #4188ed',
                borderRadius: 10,
                boxShadow: '0 0 4px rgba(65, 136, 237, 0.35)',
                padding: '24px',
                boxSizing: 'border-box',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  ...F,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#0f66e2',
                }}
              >
                환자 정보 확인
              </p>
              <p
                style={{
                  ...F,
                  margin: '12px 0 0',
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#0d0d0d',
                }}
              >
                이름 : <b>{patient.name}</b> &nbsp;|&nbsp; 나이 :{' '}
                <b>{patient.age}세</b> &nbsp;|&nbsp; 지원 수준 :{' '}
                <b>{patient.level}</b>
              </p>
            </div>
          )}

          {/* 연동 확인 버튼 (S02 로그인 버튼과 완벽 일치) */}
          <button
            onClick={handleConfirm}
            disabled={!isComplete}
            style={{
              width: '100%',
              height: 81,
              marginTop: 50, // 위쪽 여백 넉넉히
              marginBottom: 40,
              background: isComplete ? '#0f66e2' : '#dddde6',
              borderRadius: 50,
              border: 'none',
              boxShadow: isComplete ? '0 0 2px #4188ed' : 'none',
              cursor: isComplete ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '1.55',
                color: isComplete ? '#f8f9fa' : '#8e8e98',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}
            >
              연동 확인
            </span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
