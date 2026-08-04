import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole, roleHome } from '../utils/role';
import { linkGuardian, linkDoctor } from '../api/link';
import { ApiError } from '../api/client';
import PageLayout from '../components/common/PageLayout';
import imgLinkIcon from '../assets/link.png';

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

export default function S08_CodeLink() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState('');
  const [patientName, setPatientName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isComplete = code.length === 6;

  const handleChange = (raw: string) => {
    const next = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);

    setCode(next);
    // 코드를 다시 고치면 이전 연동 결과 표시를 지웁니다
    setPatientName(null);
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    if (!isComplete || loading) return;

    const role = getRole();
    setErrorMessage('');
    setLoading(true);

    try {
      const res =
        role === 'doctor' ? await linkDoctor(code) : await linkGuardian(code);

      setPatientName(res.patient_name ?? null);

      // 연동 성공 즉시 다음 화면으로 넘어갑니다.
      // 환자 이름을 잠깐 보여주고 싶으면 아래 navigate를 지연시키거나
      // 버튼을 한 번 더 눌러 이동하도록 바꿀 수 있습니다.
      navigate(role ? roleHome[role] : '/role-select');
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setErrorMessage('* 존재하지 않는 코드입니다. 다시 확인해 주세요.');
      } else if (err instanceof ApiError) {
        setErrorMessage(`* ${err.message}`);
      } else {
        setErrorMessage('* 연동에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
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

        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            onClick={() => inputRef.current?.focus()}
            style={{
              position: 'relative',
              display: 'flex',
              gap: 16,
              cursor: 'text',
              width: '100%',
              justifyContent: 'space-between',
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
                  width: 90,
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
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#0d0d0d',
                  }}
                >
                  {code[index] ?? ''}
                </span>
              </div>
            ))}
          </div>

          {errorMessage && (
            <p
              style={{
                ...F,
                color: '#ff4d4f',
                fontSize: 20,
                fontWeight: 500,
                margin: '20px 0 0',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </p>
          )}

          {patientName && (
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
                연동 완료
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
                환자 : <b>{patientName}</b>
              </p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!isComplete || loading}
            style={{
              width: '100%',
              height: 81,
              marginTop: 50,
              marginBottom: 40,
              background: isComplete && !loading ? '#0f66e2' : '#dddde6',
              borderRadius: 50,
              border: 'none',
              boxShadow: isComplete && !loading ? '0 0 2px #4188ed' : 'none',
              cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
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
                color: isComplete && !loading ? '#f8f9fa' : '#8e8e98',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}
            >
              {loading ? '연동 중...' : '연동 확인'}
            </span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
