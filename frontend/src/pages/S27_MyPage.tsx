import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';

// 토글 스위치 컴포넌트
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
        width: 44,
        height: 24,
        borderRadius: 9999,
        border: 'none',
        cursor: 'pointer',
        background: checked ? '#4188ED' : '#DDDDE6',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        }}
      />
    </button>
  );
}

export default function S27_MyPage() {
  const navigate = useNavigate();
  const [ttsOn, setTtsOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const userCode = 'AB37X2';

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout noCanvas>
      {/* ── 본문 ── */}
      <main
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* 프로필 카드 */}
        <section
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* 아바타 */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C9FD4, #4188ED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>
              홍
            </span>
          </div>

          {/* 이름 + 역할 배지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D' }}>
              홍길동
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0D0D0D',
                background: '#DFDF87',
                padding: '2px 10px',
                borderRadius: 9999,
              }}
            >
              환자
            </span>
          </div>

          {/* 이메일 */}
          <p style={{ fontSize: 13, color: '#797980' }}>
            [ honggildong@email.com ]
          </p>
        </section>

        {/* 내 코드 */}
        <section
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ fontSize: 13, color: '#797980', marginBottom: 10 }}>
            내 코드 (보호자·의사 연동용)
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1.5px solid #DDDDE6',
              borderRadius: 10,
              padding: '12px 16px',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 6,
                color: '#0D0D0D',
              }}
            >
              {userCode}
            </span>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: '1.5px solid #DDDDE6',
                background: 'white',
                fontSize: 13,
                fontWeight: 600,
                color: copied ? '#4188ED' : '#0D0D0D',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </section>

        {/* 권한 상태 */}
        <section
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ fontSize: 13, color: '#797980', marginBottom: 14 }}>
            권한 상태
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ToggleSwitch checked={ttsOn} onChange={() => setTtsOn(!ttsOn)} />
              <span style={{ fontSize: 14, color: '#0D0D0D' }}>
                TTS 음성 재생
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ToggleSwitch checked={micOn} onChange={() => setMicOn(!micOn)} />
              <span style={{ fontSize: 14, color: '#0D0D0D' }}>
                마이크 / 자동 음성 인식
              </span>
            </div>
          </div>
        </section>

        {/* 메뉴 버튼들 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              label: '음성 안내 설정 ⚙️',
              color: '#0D0D0D',
              path: '/voice-setting',
            },
            { label: '비밀번호 변경', color: '#0D0D0D', path: null },
            { label: '로그아웃', color: '#0D0D0D', path: '/' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: '1.5px solid #DDDDE6',
                background: 'white',
                fontSize: 15,
                fontWeight: 500,
                color: item.color,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {item.label}
            </button>
          ))}

          {/* 회원 탈퇴 - 빨간색 */}
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 10,
              border: '1.5px solid #DDDDE6',
              background: 'white',
              fontSize: 15,
              fontWeight: 500,
              color: '#F5383B',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            회원 탈퇴
          </button>
        </section>
      </main>
    </PageLayout>
  );
}
