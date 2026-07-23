import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import imgProfile from '../assets/pprofile.png'; // 배경용 그라데이션 원 이미지

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

// Voice Setting과 동일한 토글 컴포넌트
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 78,
        height: 41,
        borderRadius: 100,
        border: checked ? 'none' : '1px solid #8e8e98',
        cursor: 'pointer',
        background: checked
          ? 'linear-gradient(180deg, rgba(32,115,232,0.8) 0%, rgba(65,136,237,0.8) 100%)'
          : '#f8f9fa',
        position: 'relative',
        transition: 'background 0.2s',
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: '#DFDF87',
          top: '50%',
          transform: 'translateY(-50%)',
          left: checked ? 40 : 4,
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );
}

export default function S27_MyPage() {
  const navigate = useNavigate();
  const [ttsOn, setTtsOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const userName = '홍길동';

  // Voice Setting의 버튼 스타일과 완벽 통일
  const pillBtnStyle: React.CSSProperties = {
    ...F,
    width: '100%',
    height: 65,
    borderRadius: 50,
    border: '1px solid #8e8e98',
    background: 'transparent',
    fontSize: 22,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  };

  return (
    <PageLayout scrollable>
      <main
        style={{
          ...F,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
        }}
      >
        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
            gap: 50,
          }}
        >
          {/* 1. 프로필 섹션 */}
          <section
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              borderBottom: '1px solid #e5e5eb',
              paddingBottom: 40,
            }}
          >
            {/* 아바타: 배경 이미지 위에 이니셜 텍스트를 겹쳐서 표시 */}
            <div
              style={{
                position: 'relative',
                width: 90,
                height: 90,
                flexShrink: 0,
              }}
            >
              <img
                src={imgProfile}
                alt='프로필'
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid #4188ED',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  ...F,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#2073E8',
                }}
              >
                {userName[0]}
              </span>
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 30, fontWeight: 700 }}>
                  {userName}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                    background: '#4188ED',
                    padding: '4px 14px',
                    borderRadius: 20,
                  }}
                >
                  환자
                </span>
              </div>
              <p style={{ fontSize: 20, color: '#797980', margin: 0 }}>
                [ honggildong@email.com ]
              </p>
            </div>
          </section>

          {/* 2. 내 코드 섹션 */}
          <section
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              내 코드 (보호자 · 의사 연동용)
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #4188ed',
                borderRadius: 10,
                background: 'rgba(65,136,237,0.05)',
                padding: '0 29px',
                height: 81,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 6 }}>
                AB37X2
              </span>
              <button
                style={{
                  ...F,
                  padding: '8px 22px',
                  borderRadius: 8,
                  border: '1px solid #8e8e98',
                  background: 'white',
                  fontSize: 20,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                복사
              </button>
            </div>
          </section>

          {/* 3. 권한 상태 섹션 */}
          <section
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              권한 상태
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <ToggleSwitch checked={ttsOn} onChange={() => setTtsOn(!ttsOn)} />
              <span style={{ fontSize: 22 }}>TTS 음성 재생</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <ToggleSwitch checked={micOn} onChange={() => setMicOn(!micOn)} />
              <span style={{ fontSize: 22 }}>마이크 / 자동 음성 인식</span>
            </div>
          </section>

          {/* 4. 메뉴 버튼들 */}
          <section
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <button
              onClick={() => navigate('/voice-setting')}
              style={{ ...pillBtnStyle }}
            >
              음성 안내 설정 ⚙️
            </button>
            <button style={{ ...pillBtnStyle }}>비밀번호 변경</button>
            <button
              onClick={() => navigate('/')}
              style={{ ...pillBtnStyle, color: '#797980' }}
            >
              로그아웃
            </button>
            <button style={{ ...pillBtnStyle, color: '#F5383B' }}>
              회원 탈퇴
            </button>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
