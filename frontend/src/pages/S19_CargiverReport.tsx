import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';
import checkboxB from '../assets/checkboxB.svg';
import checkboxG from '../assets/checkboxG.svg';
import checkboxY from '../assets/checkboxY.svg';
import checkemty from '../assets/checkemty.svg';
import polygon from '../assets/Polygon 2.svg';

const DESIGN_W = 1920;
const DESIGN_H = 1419;
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

const INDICATORS = [
  { key: '답변 성공률', checkImg: checkboxB, color: '#4188ED' },
  { key: '회상 성공률', checkImg: checkboxY, color: '#DFDF87' },
  { key: '힌트 사용량', checkImg: checkboxG, color: '#27AE60' },
  { key: '다시 말하기', checkImg: checkboxB, color: '#4188ED' },
  { key: '응답 시간',   checkImg: checkboxY, color: '#DFDF87' },
  { key: '건강 상태',   checkImg: checkboxG, color: '#27AE60' },
  { key: '수면 상태',   checkImg: checkboxB, color: '#4188ED' },
  { key: '감정 상태',   checkImg: checkboxY, color: '#DFDF87' },
];

const DATES = ['5/20', '5/21', '5/22', '5/23', '5/24', '5/25', '오늘'];

const LINE_DATA: Record<string, number[]> = {
  '답변 성공률': [40, 55, 48, 62, 70, 65, 72],
  '회상 성공률': [50, 45, 60, 55, 68, 75, 80],
  '힌트 사용량': [20, 30, 25, 35, 28, 32, 20],
  '다시 말하기': [15, 20, 18, 25, 22, 18, 15],
  '응답 시간':   [60, 55, 58, 50, 52, 48, 45],
  '건강 상태':   [60, 58, 55, 65, 62, 68, 64],
  '수면 상태':   [70, 65, 72, 68, 75, 70, 72],
  '감정 상태':   [55, 60, 58, 62, 65, 68, 70],
};

const PERIOD_OPTIONS = ['최근 7일', '최근 30일', '직접 선택'];

const STATS = [
  { label: '7일 평균 성공률', value: '62%'  },
  { label: '평균 응답 시간',  value: '3.2초' },
  { label: '일평균 힌트 사용', value: '2.4회' },
];

// 날짜 포맷 헬퍼
function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const suffix = daysAgo === 0 ? ' (오늘)' : ` (${weekdays[d.getDay()]})`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일${suffix}`;
}

const DAILY_SUMMARY = [
  {
    date: formatDate(0),
    desc: '수면 보통 · 답변 성공률 60%',
    isToday: true,
    tags: [] as string[],
  },
  {
    date: formatDate(1),
    desc: '수면 부족 · 답변 성공률 45%',
    isToday: false,
    tags: ['수면 부족', '반복 발화'],
  },
];

// SVG 차트 상수
// rect(그래프 영역) 612x360, 그 바깥에 Y라벨/X날짜
const RECT_W = 612;
const RECT_H = 360;
const Y_LABEL_SPACE = 44; // Y축 라벨 공간 (rect 왼쪽)
const X_LABEL_SPACE = 30; // X축 날짜 공간 (rect 아래)
const SVG_W = RECT_W + Y_LABEL_SPACE;      // 656
const SVG_H = RECT_H + X_LABEL_SPACE;      // 390

// 라인이 그려지는 영역 (rect 내부에 약간 패딩)
const PAD = 12;
const PLOT_X = Y_LABEL_SPACE;              // rect 시작 x
const PLOT_Y = PAD;                        // rect 내 top 패딩
const PLOT_W = RECT_W - PAD * 2;           // 라인 가로 범위
const PLOT_H = RECT_H - PAD * 2;           // 라인 세로 범위

function makeLine(values: number[]): string {
  return values
    .map((v, i) => {
      const x = PLOT_X + PAD + (i / (values.length - 1)) * PLOT_W;
      const y = PLOT_Y + PLOT_H * (1 - v / 100);
      return `${x},${y}`;
    })
    .join(' ');
}

export default function S19_CargiverReport() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const patient = DUMMY_PATIENT;
  const [period, setPeriod] = useState('최근 7일');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [activeLines, setActiveLines] = useState<Set<string>>(
    new Set(['답변 성공률', '회상 성공률', '건강 상태'])
  );

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const toggleLine = (key: string) => {
    setActiveLines(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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
        <CaregiverSidebar patient={patient} />

        <div style={{ marginLeft: 348 }}>

          {/* 헤더 */}
          <div
            style={{
              fontSize: 16, fontWeight: 700, height: 67,
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
              gap: 24, paddingRight: 348,
            }}
          >
            <button onClick={() => navigate('/cargiver-home')}
              style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
              홈
            </button>
            <button onClick={() => navigate('/mypage')}
              style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>
              마이페이지
            </button>
          </div>

          {/* ── 섹션 1: 환자의 변화 추이 ── */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT, top: 144 }}>
            {patient.name}님의 변화 추이
          </p>

          {/* 그래프 박스: 936 × 551 */}
          <div
            style={{
              position: 'absolute',
              left: CONTENT_LEFT,
              top: 206,
              width: 936,
              height: 551,
              borderRadius: 10,
              border: '1px solid var(--color-neutral-gray)',
              background:
                'linear-gradient(180deg, rgba(223,223,135,0.20) 0%, rgba(248,249,250,0.20) 100%), rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #4188ED',
              boxSizing: 'border-box',
              display: 'flex',
            }}
          >
            {/* ── 왼쪽 패널: 기간 선택 + 지표 ── */}
            <div
              style={{
                width: 180,
                padding: '24px 20px',
                borderRight: '1px solid rgba(142,142,152,0.3)',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p style={{ ...F, margin: '0 0 9px', fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-10)' }}>기간 선택</p>
              <div style={{ position: 'relative', marginBottom: 26 }}>
                <button
                  onClick={() => setShowPeriodMenu(v => !v)}
                  style={{
                    ...F, width: '100%', padding: '6px 19px', borderRadius: 10,
                    border: '1px solid #8E8E98', background: '#F8F9FA', fontSize: 14,
                    cursor: 'pointer', textAlign: 'left', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  {period}
                  <img src={polygon} alt="▼" style={{ width: 10, height: 10 }} />
                </button>
                {showPeriodMenu && (
                  <div style={{
                    position: 'absolute', top: '110%', left: 0, width: '100%',
                    background: '#fff', border: '1px solid #8E8E98', borderRadius: 6,
                    zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}>
                    {PERIOD_OPTIONS.filter(opt => opt !== period).map(opt => (
                      <div key={opt}
                        onClick={() => { setPeriod(opt); setShowPeriodMenu(false); }}
                        style={{
                          ...F, padding: '8px 12px', fontSize: 14, cursor: 'pointer',
                          background: 'transparent',
                          color: '#0D0D0D',
                        }}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>

              <p style={{ ...F, margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0D0D0D' }}>지표</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {INDICATORS.map(({ key, checkImg }) => {
                  const isChecked = activeLines.has(key);
                  return (
                    <div key={key} onClick={() => toggleLine(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <img src={isChecked ? checkImg : checkemty} alt=""
                        style={{ width: 20, height: 20, flexShrink: 0 }} />
                      <span style={{ ...F, fontSize: 15, fontWeight: 400, color: '#0D0D0D' }}>{key}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 오른쪽: 범례 + SVG 차트 ── */}
            <div style={{ flex: 1, padding: '24px 20px 16px', display: 'flex', flexDirection: 'column' }}>

              {/* 범례 */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
                {INDICATORS.filter(ind => activeLines.has(ind.key)).map(({ key, color }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 3, background: color, strokeWidth: 5,borderRadius: 2 }} />
                    <span style={{ ...F, fontSize: 13, color: '#0D0D0D' }}>{key}</span>
                  </div>
                ))}
              </div>

              {/* SVG 차트 - 그래프 박스 기준 top:102, left:210 */}
              <svg
                width={SVG_W}
                height={SVG_H}
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                style={{ position: 'absolute', top: 102, left: 210, display: 'block', overflow: 'visible' }}
              >
                {/* 플롯 영역 배경 (rect 612x360) */}
                <rect
                  x={Y_LABEL_SPACE}
                  y={0}
                  width={RECT_W}
                  height={RECT_H}
                  fill="var(--color-neutral-100, #F8F9FA)"
                />

                {/* Y축 라벨 + 가로 그리드 점선 */}
                {[0, 25, 50, 75, 100].map(v => {
                  const y = PAD + PLOT_H * (1 - v / 100);
                  return (
                    <g key={v}>
                      <line
                        x1={Y_LABEL_SPACE} y1={y} x2={Y_LABEL_SPACE + RECT_W} y2={y}
                        stroke="#4188ED" strokeWidth="1"
                        strokeDasharray="4 3"
                        opacity="0.4"
                      />
                      <text
                        x={Y_LABEL_SPACE - 8} y={y + 5}
                        textAnchor="end" fontSize="14" fill="#797980"
                      >{v}%</text>
                    </g>
                  );
                })}

                {/* Y축 선 */}
                <line
                  x1={Y_LABEL_SPACE} y1={0}
                  x2={Y_LABEL_SPACE} y2={RECT_H}
                  stroke="#4188ED" strokeWidth="1.5"
                />

                {/* X축 선 */}
                <line
                  x1={Y_LABEL_SPACE} y1={RECT_H}
                  x2={Y_LABEL_SPACE + RECT_W} y2={RECT_H}
                  stroke="#4188ED" strokeWidth="1.5"
                />

                {/* 데이터 라인들 */}
                {INDICATORS.filter(ind => activeLines.has(ind.key)).map(({ key, color }) => (
                  <polyline
                    key={key}
                    points={makeLine(LINE_DATA[key])}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}

                {/* X축 날짜 (rect 아래) */}
                {DATES.map((d, i) => {
                  const x = Y_LABEL_SPACE + PAD + (i / (DATES.length - 1)) * PLOT_W;
                  return (
                    <text key={d} x={x} y={RECT_H + 22}
                      textAnchor="middle" fontSize="14" fill="#797980">{d}</text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ── 통계 카드 3개 ── */}
          {STATS.map((stat, i) => (
            <div key={stat.label}
              style={{
                position: 'absolute',
                left: CONTENT_LEFT + i * (308 + 6),
                top: 783,
                width: 308, height: 100,
                borderRadius: 10,
                border: '1px solid #8E8E98',
                background: 'rgba(65,136,237,0.05)',
                boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
                boxSizing: 'border-box',
                padding: '16px 24px',
              }}
            >
              <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 400, color: '#797980' }}>{stat.label}</p>
              <p style={{ ...F, margin: '6px 0 0', fontSize: 30, fontWeight: 700, color: '#0D0D0D' }}>{stat.value}</p>
            </div>
          ))}

          {/* ── 섹션 2: 날짜별 상세 요약 ── */}
          <p style={{ ...SECTION_TITLE, position: 'absolute', left: CONTENT_LEFT, top: 963 }}>
            날짜별 상세 요약
          </p>

          {DAILY_SUMMARY.map((day, i) => (
            <div key={day.date}
              style={{
                position: 'absolute',
                left: CONTENT_LEFT,
                top: 1025 + i * (90 + 16),
                width: 936, height: 90,
                borderRadius: 10,
                border: day.isToday ? '1px solid #4188ED' : '1px solid #8E8E98',
                background: day.isToday ? '#4188ED' : 'rgba(65,136,237,0.05)',
                boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
                boxSizing: 'border-box',
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ ...F, margin: 0, fontSize: 18, fontWeight: 700, color: day.isToday ? '#F8F9FA' : '#0D0D0D' }}>
                  {day.date}
                </p>
                <p style={{ ...F, margin: '4px 0 0', fontSize: 14, fontWeight: 400, color: day.isToday ? 'rgba(248,249,250,0.8)' : '#797980' }}>
                  {day.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {day.isToday ? (
                  <div style={{ padding: '6px 20px', borderRadius: 6, background: '#F8F9FA', border: '1px solid #4188ED' }}>
                    <span style={{ ...F, fontSize: 14, fontWeight: 700, color: '#4188ED' }}>오늘</span>
                  </div>
                ) : (
                  day.tags.map(tag => (
                    <div key={tag}
                      style={{
                        padding: '6px 16px', borderRadius: 10,
                        border: '1px solid #0F66E2', background: '#DFDF87',
                        boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
                      }}
                    >
                      <span style={{ ...F, fontSize: 14, fontWeight: 600, color: '#0D0D0D' }}>{tag}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
