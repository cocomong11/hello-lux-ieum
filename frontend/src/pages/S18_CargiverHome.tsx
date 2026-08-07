import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';
import redEmark from '../assets/redEmark.svg';
import { getGuardianDashboard, getGuardianTrend } from '../api/guardian';
import { getQuizResults, getPatient, getDailyStatus } from '../api/patient';
import { getPCode } from '../utils/pcode';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 1246;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
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
  name: '-',
  birth_date: '',
  dignosis: '-',
};

const TODAY_STATS = [
  { label: '활동 완료 여부', value: '-' },
  { label: '진행한 활동',   value: '-'  },
  { label: '성공률',        value: '-'  },
  { label: '힌트 사용',     value: '-'  },
];

const BAR_DATA: { date: string; percent: number }[] = [];

const MEMORY_TAGS: string[]  = [];
const EMOTION_TAGS_DEFAULT: string[] = [];

export default function S18_CargiverHome() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [patient, setPatient] = useState(DUMMY_PATIENT);
  const [todayStats, setTodayStats] = useState(TODAY_STATS);
  const [barData, setBarData] = useState(BAR_DATA);
  const [emotionTags, setEmotionTags] = useState(EMOTION_TAGS_DEFAULT);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // API 연결: 대시보드 + 변화 추이
  useEffect(() => {
    const pCode = getPCode();
    if (!pCode) return;

    // 환자 정보
    getPatient(pCode)
      .then(data => {
        setPatient({
          name: data.name,
          birth_date: data.birth_date || '',
          dignosis: data.diagnosis,
        });
      })
      .catch(err => console.log('환자 정보 API 미연결:', err instanceof ApiError ? err.message : err));

    // 대시보드 데이터 + 오늘 퀴즈 결과
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 오늘 일일 상태 → 감정·행동 특이 기록
    getDailyStatus(pCode, todayStr)
      .then(data => {
        if (data.cognitive_changes && data.cognitive_changes.length > 0) {
          setEmotionTags(data.cognitive_changes);
        }
      })
      .catch(err => console.log('일일상태 API 미연결:', err instanceof ApiError ? err.message : err));

    Promise.all([
      getGuardianDashboard(pCode),
      getQuizResults(pCode, todayStr, todayStr),
    ])
      .then(([dashboard, quizResults]) => {
        const todayResult = quizResults?.[0];
        setTodayStats([
          { label: '활동 완료 여부', value: todayResult ? '완료 🎉' : '미완료' },
          { label: '진행한 활동', value: todayResult ? `${todayResult.correct_count} / ${todayResult.total_count}` : '0 / 0' },
          { label: '성공률', value: `${dashboard.avg_score}%` },
          { label: '힌트 사용', value: todayResult ? `${todayResult.hint}회` : '0회' },
        ]);
      })
      .catch(err => console.log('대시보드 API 미연결:', err instanceof ApiError ? err.message : err));

    // 변화 추이 (7일)
    getGuardianTrend(pCode, 'week')
      .then(data => {
        if (data.labels.length > 0) {
          setBarData(data.labels.map((label, i) => ({
            date: label,
            percent: data.scores[i] || 0,
          })));
        }
      })
      .catch(err => console.log('추이 API 미연결:', err instanceof ApiError ? err.message : err));
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
              paddingRight: 348,
            }}
          >
            <button
              onClick={() => navigate('/caregiver-home')}
              style={{ ...F, color: 'var(--color-primary-dark)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
            >
              홈
            </button>
            <button
              onClick={() => navigate('/mypage')}
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
                width: 62,
                height: 62,
                borderRadius: 60,
                border: '2px solid #E53134',
                background: 'var(--Neutral-100, #F8F9FA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
               <img src={redEmark} alt="경고" style={{ width: 44, height: 44, flexShrink: 0, aspectRatio: 1/1 }} />
            </div>

            {/* 텍스트 */}
            <div style={{ flex: 1 }}>
              <p style={{ ...F, margin: 0, fontSize: 30, fontWeight: 700, lineHeight: '140%', color: '#E53134' }}>
                확인 필요 알림
              </p>
              <p style={{ ...F, margin: '6px 0 0', fontSize: 22, fontWeight: 400, lineHeight: '155%',color: 'var(--color-neutral-10)' }}>
                반복 발화와 불안 반응이 기록되었습니다. 보호자 확인이 필요합니다.
              </p>
            </div>

            {/* 확인하러 가기 버튼 */}
            <button
              onClick={() => navigate('/caregiver-alerm')}
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
          {todayStats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                position: 'absolute',
                left: CONTENT_LEFT + i * (224 + 16),
                top: 419,
                width: 224,
                height: 124,
                borderRadius: 10,
                border: '1px solid var(--color-neutral-60)',
                background: 'rgba(65,136,237,0.05)',
                boxShadow: '0 0 4px 0 #4188ED',
                boxSizing: 'border-box',
                padding: '19px 29px',
              }}
            >
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 400, lineHeight:'155%', color: 'var(--color-neutral-10)' }}>
                {stat.label}
              </p>
              <p style={{ ...F, margin: 0, fontSize: 36, fontWeight: 700, color: '#0D0D0D' }}>
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
              border: '1px solid var(--color--neutral-60)',
              background: 'rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #4188ED',
              boxSizing: 'border-box',
              paddingLeft: 30,
              paddingBottom: 21,
              paddingRight: 30,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: barData.length > 0 ? 'space-around' : 'center',
            }}
          >
            {barData.length > 0 ? barData.map((bar) => {
              const isToday = bar.date === '오늘';
              const chartH = 252 - 42 - 68; // 142px = 100%
              const barH = (bar.percent / 100) * chartH;
              return (
                <div
                  key={bar.date}
                  style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' ,gap: 8 }}
                >
                  <div
                    style={{
                      width: 115,
                      height: barH,
                      borderRadius: '10px 10px 0 0',
                      background: isToday ? 'var(--color-primary-dark)' : 'var(--color-neutral-80)',
                    }}
                  />
                  <span style={{ ...F, fontSize: 22, fontWeight: 400, color: isToday ? 'var(--color-neutral-10)' : 'var(--color-neutral-60)' }}>
                    {bar.date}
                  </span>
                </div>
              );
            }) : (
              <span style={{ ...F, fontSize: 20, color: '#797980', paddingBottom: 80 }}>아직 데이터가 없습니다</span>
            )}
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
            {MEMORY_TAGS.length > 0 ? MEMORY_TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'inline-flex',
                  padding: '6px 19px',
                  alignItems: 'center',
                  borderRadius: 10,
                  border: '1px solid var(--color-primary-dark)',
                  background: 'var(--color-primary)',
                  boxShadow: '0 0 4px 0 #4188ED',
                }}
              >
                <span style={{ ...F, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)' }}>{tag}</span>
              </div>
            )) : (
              <span style={{ ...F, fontSize: 20, color: '#797980' }}>데이터 없음</span>
            )}
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
            {emotionTags.length > 0 ? emotionTags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'inline-flex',
                  padding: '6px 19px',
                  alignItems: 'center',
                  borderRadius: 10,
                  border: '1px solid var(--color-primary-dark)',
                  background: '#DFDF87',
                  boxShadow: '0 0 4px 0 #4188ED'
                }}
              >
                <span style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight:'155%', color: '#0D0D0D' }}>{tag}</span>
              </div>
            )) : (
              <span style={{ ...F, fontSize: 20, color: '#797980' }}>데이터 없음</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
