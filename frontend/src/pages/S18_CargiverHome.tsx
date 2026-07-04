import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';

const DESIGN_W = 1920;
const DESIGN_H = 1246;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

const SECTION_TITLE: React.CSSProperties = {
  ...F,
  fontSize: 30,
  fontWeight: 700,
  lineHeight: '140%',
  color: '#0D0D0D',
  margin: 0,
};

const DUMMY_PATIENT = {
  name: '홍길동',
  birth_date: '1950-01-01',
  level: '경도인지장애',
};

const TODAY_STATS = [
  { label: '활동 완료 여부', value: '완료 🎉' },
  { label: '진행한 활동',   value: '5 / 5'  },
  { label: '성공률',        value: '60%'    },
  { label: '힌트 사용',     value: '2회'    },
];

const BAR_DATA = [
  { date: '5/20', height: 120 },
  { date: '5/21', height: 90  },
  { date: '5/22', height: 140 },
  { date: '5/23', height: 60  },
  { date: '5/24', height: 80  },
  { date: '5/25', height: 100 },
  { date: '오늘', height: 180 },
];

const MEMORY_TAGS  = ['장소 기억', '날짜/시간'];
const EMOTION_TAGS = ['반복 발화 (5/25)', '불안 반응 (5/25)'];

export default function S18_CargiverHome() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [patient] = useState(DUMMY_PATIENT);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: DESIGN_H * scale,
        overflowX: 'hidden',
        background: 'var(--color-neutral-100)',
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          background: 'var(--color-neutral-100)',
        }}
      >
        {/* 사이드 바 */}
        <CaregiverSidebar patient={patient} />

        {/* 오른쪽 전체 */}
        <div style={{ marginLeft: 348 }}>

          {/* 헤더 */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              height: 67,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 24,
              paddingRight: 40,
            }}
          >
            <button
              onClick={() => navigate('/cargiver-home')}
              style={{ ...F, color: 'var(--color-primary-dark)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
            >
              홈
            </button>
            <button
              onClick={() => navigate('/cargiver-mypage')}
              style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
            >
              마이페이지
            </button>
          </div>

          {/* ── 섹션 1: 확인 필요 알림 ── top: 127 */}
          <div
            style={{
              position: 'absolute',
              left: CONTENT_LEFT,
              top: 127,
              width: 936,
              height: 170,
              borderRadius: 10,
              border: '1px solid #E53134',
              background:
                'linear-gradient(180deg, rgba(223,223,135,0.20) 0%, rgba(248,249,250,0.20) 100%), rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #E53134',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 32,
              paddingRight: 32,
              gap: 20,
              boxSizing: 'border-box',
            }}
          >
            {/* 경고 아이콘 */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 60,
                border: '2px solid #E53134',
                background: 'var(--Neutral-100, #F8F9FA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#E53134' }}>!</span>
            </div>

            {/* 텍스트 */}
            <div style={{ flex: 1 }}>
              <p style={{ ...F, margin: 0, fontSize: 30, fontWeight: 700, color: 'var(--Tertiary-80, #E53134)', lineHeight: '140%' }}>
                확인 필요 알림
              </p>
              <p style={{ ...F, margin: '6px 0 0', fontSize: 18, fontWeight: 400, color: '#797980' }}>
                반복 발화와 불안 반응이 기록되었습니다. 보호자 확인이 필요합니다.
              </p>
            </div>

            {/* 확인하러 가기 버튼 */}
            <button
              onClick={() => navigate('/cargiver-alerm')}
              style={{
                ...F,
                flexShrink: 0,
                padding: '10px 24px',
                borderRadius: 50,
                border: '1px solid #E53134',
                background: 'var(--color-neutral-100)',
                color: '#E53134',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              확인하러 가기
            </button>
          </div>

          {/* ── 섹션 2: 오늘 현황 ── */}
          {/* 레이블 top: 357 */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT, top: 357 }}>
            오늘 현황
          </p>

          {/* 카드 4개 top: 419 */}
          {TODAY_STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                position: 'absolute',
                left: CONTENT_LEFT + i * (224 + 16),
                top: 419,
                width: 224,
                height: 124,
                borderRadius: 10,
                border: '1px solid #8E8E98',
                background: 'rgba(65,136,237,0.05)',
                boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
                boxSizing: 'border-box',
                padding: '20px 22px',
              }}
            >
              <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 400, color: '#797980' }}>
                {stat.label}
              </p>
              <p style={{ ...F, margin: '8px 0 0', fontSize: 28, fontWeight: 700, color: '#0D0D0D' }}>
                {stat.value}
              </p>
            </div>
          ))}

          {/* ── 섹션 3: 최근 7일 추이 ── */}
          {/* 레이블 top: 603 */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT, top: 603 }}>
            최근 7일 추이
          </p>

          {/* 그래프 박스 top: 665 */}
          <div
            style={{
              position: 'absolute',
              left: CONTENT_LEFT,
              top: 665,
              width: 936,
              height: 252,
              borderRadius: 10,
              border: '1px solid #8E8E98',
              background: 'rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              padding: '20px 32px 36px',
              boxSizing: 'border-box',
            }}
          >
            {BAR_DATA.map((bar) => {
              const isToday = bar.date === '오늘';
              const barH = (bar.height / 180) * (252 - 56);
              return (
                <div
                  key={bar.date}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                >
                  <div
                    style={{
                      width: 72,
                      height: barH,
                      borderRadius: '4px 4px 0 0',
                      background: isToday ? '#4188ED' : '#C4C4C4',
                    }}
                  />
                  <span style={{ ...F, fontSize: 16, fontWeight: isToday ? 700 : 400, color: isToday ? '#4188ED' : '#797980' }}>
                    {bar.date}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── 섹션 4: 어려워한 기억 유형 + 감정·행동 특이 기록 ── */}
          {/* top: 977 */}

          {/* 어려워한 기억 유형 */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT, top: 977 }}>
            어려워한 기억 유형
          </p>
          <div
            style={{
              position: 'absolute',
              left: CONTENT_LEFT,
              top: 977 + 42 + 20,
              display: 'flex',
              gap: 10,
            }}
          >
            {MEMORY_TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'inline-flex',
                  padding: '6px 19px',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 10,
                  border: '1px solid #0F66E2',
                  background: '#4188ED',
                  boxShadow: '0 0 4px 0 rgba(65,136,237,0.45)',
                }}
              >
                <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#F8F9FA' }}>{tag}</span>
              </div>
            ))}
          </div>

          {/* 감정·행동 특이 기록 */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT + 480, top: 977 }}>
            감정 · 행동 특이 기록
          </p>
          <div
            style={{
              position: 'absolute',
              left: CONTENT_LEFT + 480,
              top: 977 + 42 + 20,
              display: 'flex',
              gap: 10,
            }}
          >
            {EMOTION_TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'inline-flex',
                  padding: '6px 19px',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 10,
                  border: '1px solid #0F66E2',
                  background: '#DFDF87',
                  boxShadow: '0 0 4px 0 rgba(65,136,237,0.45)',
                }}
              >
                <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#0D0D0D' }}>{tag}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
