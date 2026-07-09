import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/DoctorSidebar';

const DESIGN_W = 1920;
const DESIGN_H = 3385;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

// 환자별 데이터
const PATIENTS_DB: Record<number, {
  name: string;
  birth_date: string;
  dignosis: string;
  support_level: string;
  recentKMMSE: string;
  kmmseScores: number[];       // 6개월 점수
  monthlyRates: number[][];    // 6개월 문항별 정답률
  latestRates: { label: string; value: number }[];
  dailyScores: Record<number, number>; // 일별 점수 (1~31)
  stats: { label: string; value: string }[];
  memo: string;
}> = {
  1001: {
    name: '홍길동',
    birth_date: '1950-01-01',
    dignosis: '경도인지장애',
    support_level: '보통',
    recentKMMSE: '2026.05.01',
    kmmseScores: [25, 24, 23, 23, 22, 22],
    monthlyRates: [
      [80, 75, 70, 65, 60, 55],
      [70, 68, 65, 62, 60, 58],
      [85, 80, 78, 75, 72, 70],
      [60, 55, 50, 48, 45, 42],
      [40, 38, 35, 30, 28, 25],
    ],
    latestRates: [
      { label: '지남력-시간', value: 80 },
      { label: '지남력-장소', value: 80 },
      { label: '언어 능력', value: 70 },
      { label: '기억 회상', value: 40 },
      { label: '주의·계산', value: 60 },
      { label: '시공간 구성', value: 20 },
    ],
    dailyScores: {
      1: 65, 2: 70, 3: 61, 4: 38, 5: 55,
      8: 75, 9: 70, 10: 62, 11: 58, 12: 35,
      15: 60, 16: 72, 17: 65, 18: 58, 19: 55,
      22: 35, 23: 60, 26: 60,
    },
    stats: [
      { label: '활동 완료 여부', value: '완료 🎉' },
      { label: '진행한 활동', value: '5 / 5' },
      { label: '성공률', value: '60%' },
      { label: '힌트 사용', value: '2회' },
    ],
    memo: '다음 진료 시 수면 패턴 집중 확인 필요. 반복 발화 빈도 모니터링.',
  },
  1002: {
    name: '이순희',
    birth_date: '1955-11-11',
    dignosis: '초기 치매',
    support_level: '높음',
    recentKMMSE: '2026.04.15',
    kmmseScores: [20, 19, 19, 18, 18, 17],
    monthlyRates: [[70, 65, 60, 55, 50, 48], [60, 55, 50, 48, 45, 40], [75, 70, 65, 60, 58, 55], [50, 45, 40, 38, 35, 30], [35, 30, 28, 25, 22, 20]],
    latestRates: [
      { label: '지남력-시간', value: 48 },
      { label: '지남력-장소', value: 40 },
      { label: '언어 능력', value: 55 },
      { label: '기억 회상', value: 30 },
      { label: '주의·계산', value: 35 },
      { label: '시공간 구성', value: 20 },
    ],
    dailyScores: { 1: 78, 5: 72, 10: 68, 15: 75, 20: 70, 25: 78 },
    stats: [
      { label: '활동 완료 여부', value: '완료 🎉' },
      { label: '진행한 활동', value: '4 / 5' },
      { label: '성공률', value: '78%' },
      { label: '힌트 사용', value: '3회' },
    ],
    memo: '전반적 인지 저하 진행 중. 가족 상담 필요.',
  },
  1003: {
    name: '박영수',
    birth_date: '1943-07-01',
    dignosis: '경도인지장애',
    support_level: '낮음',
    recentKMMSE: '2026.03.20',
    kmmseScores: [26, 25, 25, 24, 24, 23],
    monthlyRates: [[85, 80, 78, 75, 72, 70], [75, 72, 70, 68, 65, 62], [80, 78, 75, 72, 70, 68], [55, 52, 50, 48, 45, 42], [45, 42, 40, 38, 35, 32]],
    latestRates: [
      { label: '지남력-시간', value: 70 },
      { label: '지남력-장소', value: 62 },
      { label: '언어 능력', value: 68 },
      { label: '기억 회상', value: 42 },
      { label: '주의·계산', value: 45 },
      { label: '시공간 구성', value: 32 },
    ],
    dailyScores: { 1: 52, 5: 48, 10: 55, 15: 50, 20: 52, 24: 52 },
    stats: [
      { label: '활동 완료 여부', value: '미완료' },
      { label: '진행한 활동', value: '2 / 5' },
      { label: '성공률', value: '52%' },
      { label: '힌트 사용', value: '5회' },
    ],
    memo: '운동 병행 권고. 다음 검사 예정.',
  },
};

const MONTHS = ['12월', '1월', '2월', '3월', '4월', '5월'];
const RATE_COLORS = ['#4188ED', '#797980', '#27AE60', '#F5A623', '#8E8E98'];

function getDayColor(score: number | undefined): string {
  if (!score) return 'transparent';
  if (score > 70) return '#0F66E2';
  if (score > 40) return '#DFDF87';
  return '#E53134';
}

function getDayTextColor(score: number | undefined): string {
  if (!score) return '#0D0D0D';
  if (score > 70) return '#F8F9FA';
  return '#0D0D0D';
}

export default function S24_DoctorDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pCode = Number(searchParams.get('p_code')) || 1001;
  const [scale, setScale] = useState(1);
  const [doctorComment, setDoctorComment] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6개월');
  const [dailyPeriod, setDailyPeriod] = useState('3개월');
  const [selectedDay, setSelectedDay] = useState(26);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const patientData = PATIENTS_DB[pCode] || PATIENTS_DB[1001];

  useEffect(() => {
    setDoctorComment(patientData.memo);
  }, [pCode]);

  const patient = {
    name: patientData.name,
    birth_date: patientData.birth_date,
    dignosis: patientData.dignosis,
    support_level: patientData.support_level,
    recentKMMSE: patientData.recentKMMSE || undefined,
    kmmseScore: '22/30',
    kmmseRange: '경도인지장애 범위',
    stats: {
      activity: `완료 (${patientData.stats.find(s => s.label === '진행한 활동')?.value || '0/0'})`,
      rate: patientData.stats.find(s => s.label === '성공률')?.value || '0%',
      hint: patientData.stats.find(s => s.label === '힌트 사용')?.value || '0회',
    },
    memo: doctorComment,
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  // 달력 데이터
  const daysInMonth = 31;
  const startDayOfWeek = 3; // 2026년 5월 1일 = 금요일 → 0-indexed: 금=5? Let's use 4 (목)

  return (
    <div style={{ position: 'relative', width: '100vw', height: DESIGN_H * scale, overflowX: 'hidden', background: 'var(--color-neutral-100)' }}>
      <div
        style={{
          width: DESIGN_W, height: DESIGN_H,
          position: 'absolute', top: 0, left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          background: 'var(--color-neutral-100)',
        }}
      >
        <Sidebar patient={patient} />

        <div style={{ marginLeft: 348 }}>
          {/* 헤더 */}
          <div style={{ height: 67, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, paddingRight: 348 }}>
            <button onClick={() => navigate('/doctor-home')} style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>홈</button>
            <button onClick={() => navigate('/mypage')} style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>마이페이지</button>
          </div>

          {/* ══ 메인 콘텐츠 ══ */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: 100 }}>

            {/* 타이틀 */}
            <div style={{display:'flex',width: '936px', padding: '12px 22px',justifyContent:'center',alignItems:'center', 
              borderRadius:10, border: '1px solid var(--color-primary)',background:'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05))',boxShadow:' 0 0 4px 0 #DFDF87' }}>
              <p style={{ ...F, fontSize: 16, fontWeight: 400, lineHeight:'160%',color: 'var(--color-neutral-10)', margin: 0 }}>K-MMSE 검사 결과 + 일일 인지 자극 활동 기록 + 보호자 메모를 바탕으로 한 진료 참고용 자료입니다. 의학적 진단을 대체하지 않습니다.</p></div>

            {/* ── 월별 리포트 ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '80px 0 20px' }}>
              <p style={{ ...F, fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>월별 리포트</p>
              <p style={{
                ...F, display: 'inline-flex', height: 42, padding: '10px 20px', justifyContent: 'center', alignItems: 'center',
                borderRadius: 50, border: '1px solid #4188ED',
                background: 'var(--color-primary)',
                fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)', margin: 0,
              }}>K-MMSE 문항별 정답률 월별 추세</p>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {['3개월', '6개월', '1년'].map(period => (
                  <button key={period} onClick={() => setSelectedPeriod(period)} style={{
                    ...F, padding: '6px 19px', borderRadius: 10,
                    border: period === selectedPeriod ? '1px solid #DFDF87' : '1px solid var(--color-neutral-60)',
                    background: period === selectedPeriod ? 'var(--color-primary-dark)' : '#F8F9FA',
                    boxShadow: period === selectedPeriod ? '0 0 4px 0 #4188ED':'0 0 4px 0 #797980',
                    color: period === selectedPeriod ? '#F8F9FA' : '#797980',
                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  }}>{period}</button>
                ))}
              </div>
            </div>

            {/* K-MMSE 총점 월별 추이 */}
            <div style={{ width: 936, height: 330, borderRadius: 10, border: '1px solid #8E8E98', background: 'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05))', boxShadow: '0 0 4px 0 #4188ED', 
              padding: '19px 30px 21px 29px', boxSizing: 'border-box', marginBottom: 20 }}>
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-10)' }}>K-MMSE 총점 월별 추이</p>
              <svg width="878" height="236" style={{ marginTop: 10 }}>
                <line x1="0" y1="65" x2="880" y2="65" stroke="#E0E0E0" strokeDasharray="4 3" />
                <text x="0" y="12" fontSize="16" fill="var(--color-neutral-10)">30점</text>
                <polyline
                  points={patientData.kmmseScores.map((s, i) => `${i * 176},${130 - (s / 30) * 120}`).join(' ')}
                  fill="none" stroke="#4188ED" strokeWidth="2.5" strokeLinejoin="round"
                />
                {patientData.kmmseScores.map((s, i) => (
                  <g key={i}>
                    <circle cx={i * 176} cy={130 - (s / 30) * 120} r="5" fill="#4188ED" />
                    <text x={i * 176 + 8} y={130 - (s / 30) * 120 + 20} textAnchor="start" fontSize="16" fontWeight="400" fill="#4188ED">{s}</text>
                    <text x={i * 176} y={220} textAnchor="middle" fontSize="22" fontWeight="400" fill="var(--color-neutral-10)">{MONTHS[i]}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* 문항별 정답률 월별 추이 */}
            <div style={{ width: 936, height: 371, borderRadius: 10, border: '1px solid #8E8E98', 
              background: 'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05))', 
              boxShadow: '0 0 4px 0 #4188ED', padding: '20px 24px', boxSizing: 'border-box', marginBottom: 40 }}>
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, color: '#0D0D0D' }}>문항별 정답률 월별 추세</p>
              <svg width="880" height="130" style={{ marginTop: 10 }}>
                {patientData.monthlyRates.map((rates, ri) => (
                  <polyline
                    key={ri}
                    points={rates.map((r, i) => `${i * 176},${130 - (r / 100) * 120}`).join(' ')}
                    fill="none" stroke={RATE_COLORS[ri]} strokeWidth="2" strokeLinejoin="round"
                  />
                ))}
                {MONTHS.map((m, i) => (
                  <text key={m} x={i * 176} y={145} textAnchor="middle" fontSize="12" fill="#797980">{m}</text>
                ))}
              </svg>
            </div>

            {/* 5월 문항별 정답률 (최신) */}
            <p style={{ ...F, fontSize: 22, fontWeight: 700, width: '218px', color: '#0D0D0D', margin: '20px 0 24px 0' }}>5월 문항별 정답률 (최신)</p>
            <div style={{ width: 936, marginBottom: 57 }}>
              {patientData.latestRates.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 40}}>
                  <span style={{ ...F, fontSize: 19, fontWeight: 400, color: '#0D0D0D', width: '95px' ,flexShrink: 0 }}>{item.label}</span>
                  <div style={{ flex: 1, height: 20, border: '0.892px solid var(--Neutral-60, #8E8E98)',background: 'var(--color-neutral-100)',boxShadow:'0 0 3.569px 0 #4188ED', borderRadius: '44.608px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.value}%`, height: '100%', background: '#4188ED', borderRadius: 4 }} />
                  </div>
                  <span style={{ ...F, fontSize: 19, fontWeight: 400, color: '#0D0D0D', width: 41, textAlign: 'right' }}>{item.value}%</span>
                </div>
              ))}
            </div>

            {/* AI 코멘트 */}
            <div style={{
              display:'flex', alignItems: 'center', justifyContent: 'center',
              width: 936, padding: '12px 22px', borderRadius: 10,
              border: '1px solid #4188ED', background: 'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05)',
              boxShadow: '0 0 4px 0 #DFDF87'
            }}>
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, color: '#0D0D0D' }}>
                3~6개월 단위 추세로 진행 경향 파악 권장 및 기억 회상 · 시공간 영역 하위 추세 관찰
              </p>
            </div>

            {/* ── 일일 리포트 ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '102px 0 0' }}>
              <p style={{ ...F, display: 'inline-flex', fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>일일 리포트</p>
              <p style={{
                ...F, display: 'inline-flex', height: 42, padding: '10px 20px', justifyContent: 'center', alignItems: 'center',
                borderRadius: 50,
                background: 'var(--color-neutral-gray)',
                fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)', margin: 0,
              }}>점수 + 상태</p>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {['7일', '30일', '3개월', '직접입력'].map(p => (
                  <button key={p} onClick={() => setDailyPeriod(p)} style={{
                    ...F, padding: '6px 19px', borderRadius: 10,
                    border: p === dailyPeriod ? '1px solid #DFDF87' : '1px solid var(--color-neutral-60)',
                    background: p === dailyPeriod ? 'var(--color-primary-dark)' : '#F8F9FA',
                    boxShadow: p === dailyPeriod ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
                    color: p === dailyPeriod ? '#F8F9FA' : '#797980',
                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  }}>{p}</button>
                ))}
              </div>
            </div>

            {/* 시작일 / 종료일 */}
            <div style={{ display: 'flex', gap: 16, margin: '20px 0 20px' }}>
              <div style={{
                flex: 1, padding: '14px 24px', borderRadius: 10,
                border: '1px solid #8E8E98', background: '#F8F9FA',
                boxShadow: '0 0 4px 0 #797980',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ ...F, fontSize: 18, fontWeight: 400, color: '#797980' }}>시작일</span>
                <span style={{ ...F, fontSize: 18, fontWeight: 700, color: '#0D0D0D' }}>2026. 05. 01</span>
              </div>
              <div style={{
                flex: 1, padding: '14px 24px', borderRadius: 10,
                border: '1px solid #8E8E98', background: '#F8F9FA',
                boxShadow: '0 0 4px 0 #797980',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ ...F, fontSize: 18, fontWeight: 400, color: '#797980' }}>종료일</span>
                <span style={{ ...F, fontSize: 18, fontWeight: 700, color: '#0D0D0D' }}>2026. 05. 31</span>
              </div>
            </div>

            {/* 기간 통계 카드 */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
              {[
                { label: '기간 평균 점수', value: '62%', color: '#0D0D0D' },
                { label: '기록 일수', value: '21 / 31일', color: '#0D0D0D' },
                { label: '주의 일수', value: '3일', color: '#E53134' },
              ].map(stat => (
                <div key={stat.label} style={{
                  width: 296, height: 100, borderRadius: 10,
                  border: '1px solid #8E8E98', background: 'rgba(65,136,237,0.05)',
                  boxShadow: '0 0 4px 0 rgba(65,136,237,0.35)',
                  padding: '16px 24px', boxSizing: 'border-box',
                }}>
                  <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 400, color: '#797980' }}>{stat.label}</p>
                  <p style={{ ...F, margin: '6px 0 0', fontSize: 30, fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* 달력 */}
            <p style={{ ...F, fontSize: 18, fontWeight: 700, color: '#0D0D0D', margin: '0 0 12px' }}>◀ 2026년 5월 ▶</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, width: 936, marginBottom: 30 }}>
              {['월', '화', '수', '목', '금', '토', '일'].map(d => (
                <div key={d} style={{ ...F, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#797980', padding: '8px 0' }}>{d}</div>
              ))}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const score = patientData.dailyScores[day];
                const bg = getDayColor(score);
                const textColor = getDayTextColor(score);
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      textAlign: 'center', padding: '12px 0',
                      borderRadius: 6,
                      background: bg,
                      color: textColor,
                      fontSize: 16, fontWeight: selectedDay === day ? 700 : 400,
                      cursor: 'pointer',
                      border: selectedDay === day ? '2px solid #0D0D0D' : '1px solid transparent',
                      boxSizing: 'border-box',
                    }}
                  >
                    {day}
                    {score && <div style={{ fontSize: 12, fontWeight: 700 }}>{score}%</div>}
                  </div>
                );
              })}
            </div>

            {/* 범례 */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
              {[
                { color: '#0F66E2', label: '좋음 (70% 이상)' },
                { color: '#DFDF87', label: '보통 (40~69%)' },
                { color: '#E53134', label: '주의 (40% 미만)' },
                { color: 'transparent', label: '기록 없음' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: item.color, border: '1px solid #8E8E98' }} />
                  <span style={{ ...F, fontSize: 14, color: '#797980' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* 선택 일자 상세 */}
            <p style={{ ...F, fontSize: 22, fontWeight: 700, color: '#0D0D0D', margin: '60px 0 34px' }}>
              선택 일자 : 2026. 05. {selectedDay} {selectedDay === new Date().getDate() ? '(오늘)' : ''}
            </p>
            {patientData.dailyScores[selectedDay] ? (
              <div style={{
                width: 936, height:203,paddingTop: '28px',paddingLeft: 29,borderRadius: 10,
                border: '1px solid var(--Secondary-80, #DFDF87)', background: '#0F66E2',
                boxShadow: '0 0 10px 0 #4188ED', marginBottom: 34,
              }}>
                <p style={{ ...F, margin: 0, fontSize: 30, fontWeight: 700, color: 'var(--color-neutral-100)' }}>
                  인지점수 {patientData.dailyScores[selectedDay]}%
                </p>
                <p style={{ ...F, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)' }}>
                  활동 5/5 수행 · 힌트 2회 사용
                </p>
                <div style={{ display: 'inline-flex', gap: 10, marginTop: 12 }}>
                  {['건강 : 좋음', '수면 : 보통', '기분 : 안정', '반복 발화'].map(tag => (
                    <div key={tag} style={{
                      padding: '6px 19px', borderRadius: 10,
                      background: '#DFDF87', border: '1px solid #0F66E2',
                    }}>
                      <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#0D0D0D' }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                width: 936, padding: '20px 24px', borderRadius: 10,
                border: '1px solid #8E8E98', background: '#F8F9FA', marginBottom: 40,
              }}>
                <p style={{ ...F, margin: 0, fontSize: 18, color: '#797980' }}>해당 날짜에 기록이 없습니다.</p>
              </div>
            )}

            {/* ── 의사 코멘트 ── */}
            <p style={{ ...F, marginTop: '26px', fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: '0 0 16px' }}>의사 코멘트</p>
            <textarea
              value={doctorComment}
              onChange={e => setDoctorComment(e.target.value)}
              style={{
                width: 936, height: 110,
                padding: '23px 29px', boxSizing: 'border-box',
                borderRadius: 10, border: '1px solid #8E8E98',
                background: 'rgba(65,136,237,0.05)',
                boxShadow: '0 0 4px 0 #4188ED',
                ...F, fontSize: 22, fontWeight: 400, color: '#0D0D0D',
                resize: 'none', outline: 'none',
              }}
            />

            {/* 버튼 행 */}
            <div style={{ marginTop: 24, width: 936, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setDoctorComment('')}
                style={{
                  ...F, display: 'inline-flex', padding: '12px 22px',
                  borderRadius: 50, background: '#F8F9FA', border: 'none',
                  boxShadow: '0 0 4px 0 #E53134', cursor: 'pointer',
                  fontSize: 22, fontWeight: 700, color: '#E53134',
                }}
              >삭제</button>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {savedMsg && <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#4188ED' }}>저장되었습니다</span>}
                <button style={{
                  ...F, display: 'inline-flex', padding: '12px 22px',
                  borderRadius: 50, background: '#F8F9FA', border: 'none',
                  boxShadow: '0 0 4px 0 #0D0D0D', cursor: 'pointer',
                  fontSize: 22, fontWeight: 700, color: '#0D0D0D',
                }}>수정</button>
                <button
                  onClick={handleSave}
                  style={{
                    ...F, display: 'inline-flex', padding: '12px 22px',
                    borderRadius: 50, background: '#4188ED', border: 'none',
                    boxShadow: '0 0 4px 0 #4188ED', cursor: 'pointer',
                    fontSize: 22, fontWeight: 700, color: '#F8F9FA',
                  }}
                >저장</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
