import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/DoctorSidebar';
import polygon from '../assets/Polygon 2.svg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDoctorReport, updateDoctorReport } from '../api/doctor';
import { getQuizResults, getPatient, getDailyStatus } from '../api/patient';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 3385;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

// 환자별 데이터 (API에서 가져옴)

const EMPTY_PATIENT = {
  name: '-',
  birth_date: '',
  dignosis: '-',
  support_level: '-',
  recentKMMSE: '',
  kmmseScores: [] as number[],
  monthlyRates: [] as number[][],
  latestRates: [] as { label: string; value: number }[],
  dailyScores: {} as Record<number, number>,
  stats: [
    { label: '활동 완료 여부', value: '-' },
    { label: '진행한 활동', value: '-' },
    { label: '성공률', value: '-' },
    { label: '힌트 사용', value: '-' },
  ],
  memo: '',
};

export default function S24_DoctorDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pCode = Number(searchParams.get('p_code')) || 1001;
  const [scale, setScale] = useState(1);
  const [comments, setComments] = useState<Record<number, string>>({});
  const [savedMsg, setSavedMsg] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [dailyScores, setDailyScores] = useState<Record<number, number>>({});
  const [selectedPeriod, setSelectedPeriod] = useState('6개월');
  const [dailyPeriod, setDailyPeriod] = useState('3개월');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [patientInfo, setPatientInfo] = useState(EMPTY_PATIENT);
  const [dayStatus, setDayStatus] = useState<{ health: string; sleep: string; mood: string; cognitive: string[] } | null>(null);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const patientData = patientInfo;

  // API: 환자 정보 로드
  useEffect(() => {
    getPatient(pCode)
      .then(data => {
        setPatientInfo(prev => ({
          ...prev,
          name: data.name,
          birth_date: data.birth_date || '',
          dignosis: data.diagnosis,
        }));
      })
      .catch(err => console.log('환자 정보 API 미연결:', err instanceof ApiError ? err.message : err));
  }, [pCode]);

  // API: 선택 날짜의 일일 상태 로드
  useEffect(() => {
    const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    getDailyStatus(pCode, dateStr)
      .then(data => {
        setDayStatus({
          health: data.health_condition || '-',
          sleep: data.sleep_status || '-',
          mood: data.mood_status || '-',
          cognitive: data.cognitive_changes || [],
        });
      })
      .catch(() => setDayStatus(null));
  }, [pCode, calYear, calMonth, selectedDay]);

  // 초기 dailyScores 설정 (더미)
  useEffect(() => {
    setDailyScores(patientData.dailyScores || {});
  }, [pCode]);

  useEffect(() => {
    // 오늘 날짜에 기존 memo 넣기
    const today = new Date();
    setComments({ [today.getDate()]: patientData.memo });
  }, [pCode]);

  // API: 리포트 로드
  useEffect(() => {
    getDoctorReport(pCode)
      .then(data => {
        console.log('리포트 로드:', data);
        // TODO: 월별 차트에 avg_score, trend 반영 가능
      })
      .catch(err => console.log('리포트 API 미연결:', err instanceof ApiError ? err.message : err));

    getQuizResults(pCode)
      .then(results => {
        if (results.length > 0) {
          // 퀴즈 결과 → 달력 dailyScores에 반영
          const scores: Record<number, number> = {};
          results.forEach(r => {
            const day = parseInt(r.date.split('-')[2]);
            scores[day] = Math.round((r.correct_count / r.total_count) * 100);
          });
          setDailyScores(scores);
        }
      })
      .catch(err => console.log('퀴즈 결과 API 미연결:', err instanceof ApiError ? err.message : err));
  }, [pCode]);

  const patient = {
    name: patientData.name,
    birth_date: patientData.birth_date,
    dignosis: patientData.dignosis,
    support_level: patientData.support_level,
    recentKMMSE: patientData.recentKMMSE || undefined,
    kmmseScore: '-',
    kmmseRange: patientData.dignosis || '-',
    stats: {
      activity: `완료 (${patientData.stats.find(s => s.label === '진행한 활동')?.value || '0/0'})`,
      rate: patientData.stats.find(s => s.label === '성공률')?.value || '0%',
      hint: patientData.stats.find(s => s.label === '힌트 사용')?.value || '0회',
    },
    memo: comments[selectedDay] || '',
  };

  const handleSave = async () => {
    // API: 의사 코멘트 서버 저장
    try {
      await updateDoctorReport(pCode, comments[selectedDay] || '');
    } catch (err) {
      console.log('리포트 저장 실패:', err instanceof ApiError ? err.message : err);
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  // 달력 데이터 (동적)
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const startDayOfWeek = (new Date(calYear, calMonth - 1, 1).getDay() + 6) % 7; // 월=0

  // 월별 리포트 MONTHS 동적 생성
  const periodCount = selectedPeriod === '3개월' ? 3 : selectedPeriod === '1년' ? 12 : 6;
  const MONTHS = Array.from({ length: periodCount }, (_, i) => {
    const m = ((calMonth - periodCount + i) % 12 + 12) % 12 + 1;
    return `${m}월`;
  });

  // recharts 데이터 변환
  const kmmseChartData = MONTHS.map((month, i) => ({
    month,
    score: patientData.kmmseScores[i] ?? null,
  }));

  const typeChartData = MONTHS.map((month, i) => ({
    month,
    '유형1': patientData.monthlyRates[0]?.[i] ?? null,
    '유형2': patientData.monthlyRates[1]?.[i] ?? null,
    '유형3': patientData.monthlyRates[2]?.[i] ?? null,
  }));

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
              }}>K-MMSE 유형별 정답률 월별 추세</p>
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

            {/* K-MMSE기반 총점 월별 정답률 */}
            <div style={{ width: 936, borderRadius: 10, border: '1px solid #8E8E98', background: 'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05))', boxShadow: '0 0 4px 0 #4188ED', 
              boxSizing: 'border-box', marginBottom: 20, paddingBottom:21 }}>
              <p style={{ ...F, margin: '19px 0 10px 29px', fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-10)' }}>K-MMSE기반 질문 월별 정답률</p>
              <ResponsiveContainer width="100%" height={236}>
                <LineChart data={kmmseChartData} margin={{ top: 5, right: 30, left: 0, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="4 3" strokeWidth="0.5" vertical={false} fill="#F8F9FA" stroke="#4188ED" />
                  <XAxis dataKey="month" width="51" axisLine={false} tickLine={false} tick={{ fontSize: 22, fill: 'var(--color-neutural-10)' }} tickMargin={18} />
                  <YAxis domain={[0,'dataMax']} axisLine={false} tickLine={false} tick={{ fontSize: 16, fill: 'var(--color-neutural-10)' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4188ED" strokeWidth={2.5} dot={{ r: 5, fill: '#4188ED' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 유형별 정답률 월별 추이 */}
            <div style={{ width: 936,borderRadius: 10, border: '1px solid #8E8E98', 
              background: 'var(--Primary-g2, linear-gradient(180deg, rgba(223, 223, 135, 0.20) 0%, rgba(248, 249, 250, 0.20) 100%), rgba(65, 136, 237, 0.05))', 
              boxShadow: '0 0 4px 0 #4188ED',  boxSizing: 'border-box', marginBottom: 40, paddingBottom:26}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ ...F, marginLeft:29, marginTop:19,fontSize: 22, fontWeight: 700, lineHeight: "155%", color: '#0D0D0D' }}>유형별 정답률 월별 추세</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: '유형1', color: '#4188ED' },
                    { label: '유형2', color: '#27AE60' },
                    { label: '유형3', color: '#F5A623' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 4,marginTop:19, background: item.color, borderRadius: 2 }} />
                      <span style={{ ...F, fontSize: 22, fontWeight:400, marginTop:19, marginRight:30, color: '#0D0D0D' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={294}>
                <LineChart data={typeChartData} margin={{ top: 10, right: 30, left: 18, bottom:12 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeWidth="0.5" vertical={false} fill="#F8F9FA" stroke="#4188ED" />
                  <XAxis dataKey="month" width="51" axisLine={false} tickLine={false} interval="preserveEnd" tick={{ fontSize: 22, fill: '#0D0D0D', fontWeight: 400}} tickMargin={18}/>
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 16, fill: '#0D0D0D' }} ticks={[0,25,50,75,100]} tickFormatter={(v)=>{ if(v===50||v===100){ return `${v}%`} return "";}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="유형1" stroke="#4188ED" strokeWidth={2.5} dot={true} />
                  <Line type="monotone" dataKey="유형2" stroke="#27AE60" strokeWidth={2.5} dot={true} />
                  <Line type="monotone" dataKey="유형3" stroke="#F5A623" strokeWidth={2.5} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* n월 유형별 정답률 */}
            <p style={{ ...F, fontSize: 22, fontWeight: 700, width: '218px', color: '#0D0D0D', margin: '20px 0 24px 0' }}>{calMonth}월 유형별 정답률</p>
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
              <p style={{ ...F, display: 'inline-flex', fontSize: 30, fontWeight: 700, color: 'var(--color-neutral-10)', lineHeight: '140%' }}>일일 리포트</p>
              <p style={{
                ...F, display: 'inline-flex', height: 42, padding: '10px 20px', justifyContent: 'center', alignItems: 'center',
                borderRadius: 50,background: 'var(--color-neutral-gray)',
                fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)', margin: 0,
              }}>점수 + 상태</p>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                {['7일', '30일', '3개월', '직접입력'].map(p => (
                  <button key={p} onClick={() => setDailyPeriod(p)} style={{
                    fontFamily: "Pretendard Variable", padding: '6px 19px', borderRadius: 10,
                    border: p === dailyPeriod ? '1px solid #DFDF87' : '1px solid var(--color-neutral-60)',
                    background: p === dailyPeriod ? 'var(--color-primary-dark)' : '#F8F9FA',
                    boxShadow: p === dailyPeriod ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
                    color: p === dailyPeriod ? '#F8F9FA' : '#797980',
                    fontSize: 22, fontWeight: 400, cursor: 'pointer',
                  }}>{p}</button>
                ))}
              </div>
            </div>

            {/* 시작일 / 종료일 (동적) */}
            {(() => {
              const end = new Date();
              const start = new Date();
              if (dailyPeriod === '7일') start.setDate(end.getDate() - 7);
              else if (dailyPeriod === '30일') start.setDate(end.getDate() - 30);
              else if (dailyPeriod === '3개월') start.setMonth(end.getMonth() - 3);
              else if (dailyPeriod === '직접입력' && customStart && customEnd) {
                // 직접입력: customStart/customEnd 사용
              } else {
                start.setMonth(end.getMonth() - 1);
              }
              const fmt = (d: Date) => `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;
              const startDisplay = dailyPeriod === '직접입력' && customStart ? customStart.replace(/-/g, '. ') : fmt(start);
              const endDisplay = dailyPeriod === '직접입력' && customEnd ? customEnd.replace(/-/g, '. ') : fmt(end);
              return (
            <div style={{ display: 'flex', gap: 50, margin: '28px 0 20px' }}>
              <div style={{
                flex: 1, padding: '19px 24px', borderRadius: 10,
                border: '1px solid var(--color-neutral-60)', background: 'var(--color-neutral-100)',
                boxShadow: '0 0 4px 0 #797980',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                <span style={{ ...F, margin: '0 10px 0 0', fontSize: 22, fontWeight: 400, color: 'var(--color-neutral-gray)' }}>시작일</span>
                {dailyPeriod === '직접입력' ? (
                  <input type="date" value={customStart} onChange={e => {
                    setCustomStart(e.target.value);
                    if (e.target.value) {
                      const d = new Date(e.target.value);
                      setCalYear(d.getFullYear());
                      setCalMonth(d.getMonth() + 1);
                      setSelectedDay(d.getDate());
                    }
                  }} style={{ ...F, fontSize: 18, border: 'none', outline: 'none', fontWeight: 700, color: 'var(--color-neutral-gray)' }} />
                ) : (
                  <span style={{ ...F, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-gray)' }}>{startDisplay}</span>
                )}
              </div>
              <div style={{
                flex: 1, padding: '19px 24px', borderRadius: 10,
                border: '1px solid var(--color-neutral-60)', background: 'var(--color-neutral-100)',
                boxShadow: '0 0 4px 0 #797980',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                <span style={{ ...F, fontSize: 22, margin: '0 10px 0 0', fontWeight: 400, color: 'var(--color-neutral-gray)' }}>종료일</span>
                {dailyPeriod === '직접입력' ? (
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} style={{ ...F, fontSize: 18, border: 'none', outline: 'none', fontWeight: 700, color: 'var(--color-neutral-gray)' }} />
                ) : (
                  <span style={{ ...F, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-gray)' }}>{endDisplay}</span>
                )}
              </div>
            </div>
              );
            })()}

            {/* 기간 통계 카드 */}
            {(() => {
              const end = new Date();
              const start = new Date();
              if (dailyPeriod === '7일') start.setDate(end.getDate() - 7);
              else if (dailyPeriod === '30일') start.setDate(end.getDate() - 30);
              else if (dailyPeriod === '3개월') start.setMonth(end.getMonth() - 3);
              else start.setMonth(end.getMonth() - 1);

              const endDay = end.getDate();
              const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

              // 선택된 기간 내 점수만 필터 (같은 월 기준 간단 필터)
              const scores = Object.entries(dailyScores)
                .filter(([d]) => {
                  const day = Number(d);
                  if (dailyPeriod === '7일') return day > endDay - 7 && day <= endDay;
                  if (dailyPeriod === '30일') return day > endDay - 30 && day <= endDay;
                  return true; // 3개월, 직접입력은 전체
                })
                .map(([, v]) => v as number);
              const recordDays = scores.length;
              const cautionDays = scores.filter(s => s <= 40).length;
              const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

              return (
            <div style={{ display: 'flex', gap: 24, marginBottom: 60 }}>
              {[
                { label: '기간 평균 점수', value: `${avgScore}%`, color: 'var(--color-neutral-10)' },
                { label: '기록 일수', value: `${recordDays} / ${totalDays}일`, color: 'var(--color-neutral-10)' },
                { label: '주의 일수', value: `${cautionDays}일`, color: '#E53134' },
              ].map(stat => (
                <div key={stat.label} style={{
                  width: 296, height: 124, borderRadius: 10,
                  border: '1px solid var(--color-neutral-60)', background: 'rgba(65,136,237,0.05)',
                  boxShadow: '0 0 4px 0 #4188ED',
                  padding: '19px 0 20px 29px ', justifyContent:'center',alignItems:'flex-start',flexDirection:'column'
                }}>
                  <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 400, color: 'var(--color-neutral-10)' }}>{stat.label}</p>
                  <p style={{ ...F, margin: 0, fontSize: 36, fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
              );
            })()}

            {/* 달력 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 16px 20px 16px' }}>
              {/* ◀ 이전 */}
              <div
                onClick={() => {
                  if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
                  else { setCalMonth(m => m - 1); }
                  setSelectedDay(1);
                }}
                style={{
                  display: 'inline-flex', padding: '6px 19px', alignItems: 'center',
                  borderRadius: 10, border: '1px solid #0D0D0D', background: 'var(--color-neutral-100)', cursor: 'pointer',
                }}
              >
                <img src={polygon} alt="◀" style={{ width: 15, height: 15, transform: 'rotate(90deg)', aspectRatio: 1/1 }} />
              </div>

              {/* 년월 텍스트 */}
              <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#0D0D0D' }}>{calYear}년 {calMonth}월</span>

              {/* ▶ 다음 */}
              <div
                onClick={() => {
                  if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
                  else { setCalMonth(m => m + 1); }
                  setSelectedDay(1);
                }}
                style={{
                  display: 'inline-flex', padding: '6px 19px', alignItems: 'center',
                  borderRadius: 10, border: '1px solid #0D0D0D', background: 'var(--color-neutral-100)', cursor: 'pointer',
                }}
              >
                <img src={polygon} alt="▶" style={{ width: 15, height: 15, transform: 'rotate(-90deg)',aspectRatio: 1/1 }} />
              </div>
              {/*날짜 클릭 시 일별 상세 보기*/}
              <div style={{color:'var(--color-neutral-gray)', textAlign: 'right', fontSize: 22, fontWeight: 400, lineHeight: '155%'}}>날짜 클릭 시 일별 상세 보기</div>
            </div>
            {/*달력 */}
            <div style={{
              width: 936,
              borderRadius: 10,
              border: '1px solid #8E8E98',
              background: 'linear-gradient(180deg, rgba(223,223,135,0.20) 0%, rgba(248,249,250,0.20) 100%), rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #4188ED',
              padding: '20px 24px',
              boxSizing: 'border-box',
              marginBottom: 30,
            }}>
              {/* 요일 헤더 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 112px)', columnGap: 17, justifyContent: 'center', marginBottom: 20 }}>
                {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => (
                  <div key={d} style={{
                    ...F, textAlign: 'center', fontSize: 22, fontWeight: 700, lineHeight: '155%',
                    color: i === 5 ? '#0F66E2' : i === 6 ? '#E53134' : '#0D0D0D',
                    letterSpacing: 5,
                  }}>{d}</div>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 112px)', rowGap: 20, columnGap: 17, justifyContent: 'center' }}>
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ width: 112, height: 98 }} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  // 마지막 기록일 이후는 날짜만 표시 (박스 없음)
                  const maxRecordDay = Math.max(...Object.keys(dailyScores).map(Number), 0);
                  const today = new Date();
                  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth() + 1;
                  const lastDay = isCurrentMonth ? today.getDate() : maxRecordDay;
                  const isFuture = day > lastDay && lastDay > 0;

                  if (isFuture) {
                    return (
                      <div key={day} style={{
                        width: 112, height: 98, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
                        paddingTop: 8, paddingLeft: 10,
                      }}>
                        <span style={{ fontFamily: '"Pretendard Variable"', fontSize: 16, fontWeight: 700, lineHeight: '165%', color: '#797980' }}>{day}</span>
                      </div>
                    );
                  }

                  const score = dailyScores[day];
                  // 스타일 분기
                  let bg: string, border: string, boxShadow: string, percentColor: string, dateColor: string;
                  if (!score) {
                    // 기록 없음
                    bg = 'rgba(217,217,217,0.80)';
                    border = '1px solid #8E8E98';
                    boxShadow = 'none';
                    percentColor = '#797980';
                    dateColor = '#797980';
                  } else if (score > 70) {
                    // 높음
                    bg = '#0F66E2';
                    border = '1px solid #DFDF87';
                    boxShadow = '0 0 4px 0 #4188ED';
                    percentColor = '#F8F9FA';
                    dateColor = '#F8F9FA';
                  } else if (score > 40) {
                    // 중간
                    bg = '#DFDF87';
                    border = '1px solid #0F66E2';
                    boxShadow = '0 0 4px 0 #4188ED';
                    percentColor = '#0D0D0D';
                    dateColor = '#0D0D0D';
                  } else {
                    // 주의
                    bg = 'rgba(229,49,52,0.05)';
                    border = '1px solid #E53134';
                    boxShadow = '0 0 4px 0 #4188ED';
                    percentColor = '#E53134';
                    dateColor = '#E53134';
                  }

                  return (
                    <div
                      key={day}
                      onClick={() => { setSelectedDay(day); setIsEditingComment(false); }}
                      style={{
                        width: 112, height: 98,
                        borderRadius: 10,
                        background: bg,
                        border: selectedDay === day ? '3px solid #0D0D0D' : border,
                        boxShadow,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'flex-start', justifyContent: 'flex-start',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        padding: '6px 0 0 8px',
                        position: 'relative',
                      }}
                    >
                      <span style={{ fontFamily: '"Pretendard Variable"', fontSize: 16, fontWeight: 700, lineHeight: '165%', color: dateColor }}>{day}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700, lineHeight: '140%', color: percentColor, textAlign: 'center', width: '100%', position: 'absolute', top: '50%', left: 0, transform: 'translateY(-30%)' }}>
                        {score ? `${score}%` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 범례 */}
              <div style={{ display: 'flex', gap: 12, marginTop: 26, marginBottom: 19 }}>
                {[
                  { bg: '#0F66E2', border: '1px solid #DFDF87', boxShadow: '0 0 4px 0 #4188ED', label: '높음 (70% 이상)' },
                  { bg: '#DFDF87', border: '1px solid #0F66E2', boxShadow: '0 0 4px 0 #4188ED', label: '중간 (40~69%)' },
                  { bg: 'rgba(229,49,52,0.05)', border: '1px solid #E53134', boxShadow: '0 0 4px 0 #4188ED', label: '주의 (40% 미만)' },
                  { bg: 'rgba(217,217,217,0.80)', border: '1px solid #8E8E98', boxShadow: 'none', label: '기록 없음' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 25, height: 25, borderRadius: 5, background: item.bg, border: item.border, boxShadow: item.boxShadow }} />
                    <span style={{ ...F, fontSize: 16, fontWeight: 700, lineHeight: '165%', color: 'var(--color-neutral-gray)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '60px 0 34px' }}>
              <p style={{ ...F, fontSize: 22, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>선택 일자</p>
              <div style={{
                display: 'inline-flex', height: 42, padding: '10px 20px',
                justifyContent: 'center', alignItems: 'center', gap: 10,
                borderRadius: 50, border: '1px solid #0D0D0D', background: '#F8F9FA',
              }}>
                <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#0D0D0D' }}>
                  {calYear}. {String(calMonth).padStart(2, '0')}. {String(selectedDay).padStart(2, '0')} {selectedDay === new Date().getDate() && calMonth === new Date().getMonth() + 1 && calYear === new Date().getFullYear() ? '(오늘)' : ''}
                </span>
              </div>
            </div>

            {/*선택일자 */}
            {(dailyScores[selectedDay] || dayStatus) ? (
              <div style={{
                width: 936, minHeight: 203, paddingTop: '28px', paddingLeft: 29, paddingBottom: 20, borderRadius: 10,
                border: '1px solid var(--Secondary-80, #DFDF87)', background: '#0F66E2',
                boxShadow: '0 0 10px 0 #4188ED', marginBottom: 34,
              }}>
                {dailyScores[selectedDay] && (
                <p style={{ ...F, margin: 0, fontSize: 30, fontWeight: 700, color: 'var(--color-neutral-100)' }}>
                  인지점수 {dailyScores[selectedDay]}%
                </p>
                )}
                <p style={{ ...F, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)' }}>
                  {dayStatus ? `건강: ${dayStatus.health} · 수면: ${dayStatus.sleep} · 기분: ${dayStatus.mood}` : dailyScores[selectedDay] ? '' : '상세 정보 없음'}
                </p>
                <div style={{ display: 'inline-flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {(dayStatus ? [`건강 : ${dayStatus.health}`, `수면 : ${dayStatus.sleep}`, `기분 : ${dayStatus.mood}`, ...dayStatus.cognitive] : []).map(tag => {
                    const isGood = tag.includes('좋음') || tag.includes('안정') || tag.includes('잘');
                    return (
                    <div key={tag} style={{
                      padding: '6px 19px', borderRadius: 10,
                      border: isGood ? '1px solid #DFDF87' : '1px solid #0F66E2',
                      background: isGood ? '#F8F9FA' : '#DFDF87',
                      boxShadow: '0 0 4px 0 #4188ED',
                    }}>
                      <span style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: isGood ? '#0F66E2' : '#0D0D0D', textAlign: 'center' }}>{tag}</span>
                    </div>
                    );
                  })}
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
            {(() => {
              const today = new Date();
              const isToday = selectedDay === today.getDate() && calMonth === today.getMonth() + 1 && calYear === today.getFullYear();
              const canEdit = isToday || isEditingComment;
              return (
                <>
                  <textarea
                    value={comments[selectedDay] || ''}
                    onChange={e => setComments(prev => ({ ...prev, [selectedDay]: e.target.value }))}
                    disabled={!canEdit}
                    style={{
                      width: 936, height: 110,
                      padding: '23px 29px', boxSizing: 'border-box',
                      borderRadius: 10, border: '1px solid #8E8E98',
                      background: canEdit ? 'rgba(65,136,237,0.05)' : '#F8F9FA',
                      boxShadow: '0 0 4px 0 #4188ED',
                      ...F, fontSize: 22, fontWeight: 400, color: '#0D0D0D',
                      resize: 'none', outline: 'none',
                      opacity: canEdit ? 1 : 0.8,
                    }}
                  />

                  {/* 버튼 행 */}
                  <div style={{ marginTop: 24, width: 936, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => { setComments(prev => ({ ...prev, [selectedDay]: '' })); setIsEditingComment(false); }}
                          style={{
                            ...F, display: 'inline-flex', padding: '12px 22px',
                            borderRadius: 50, background: '#F8F9FA', border: 'none',
                            boxShadow: '0 0 4px 0 #E53134', cursor: 'pointer',
                            fontSize: 22, fontWeight: 700, color: '#E53134',
                          }}
                        >삭제</button>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          {savedMsg && <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#4188ED' }}>저장되었습니다</span>}
                          <button
                            onClick={() => { handleSave(); setIsEditingComment(false); }}
                            style={{
                              ...F, display: 'inline-flex', padding: '12px 22px',
                              borderRadius: 50, background: '#4188ED', border: 'none',
                              boxShadow: '0 0 4px 0 #4188ED', cursor: 'pointer',
                              fontSize: 22, fontWeight: 700, color: '#F8F9FA',
                            }}
                          >저장</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div />
                        <button
                          onClick={() => setIsEditingComment(true)}
                          style={{
                            ...F, display: 'inline-flex', padding: '12px 22px',
                            borderRadius: 50, background: '#F8F9FA', border: 'none',
                            boxShadow: '0 0 4px 0 #0D0D0D', cursor: 'pointer',
                            fontSize: 22, fontWeight: 700, color: '#0D0D0D',
                          }}
                        >수정</button>
                      </>
                    )}
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      </div>
    </div>
  );
}