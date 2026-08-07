import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';
import polygon from '../assets/Polygon 2.svg';
import checkboxB from '../assets/checkboxB.svg';
import checkemty from '../assets/checkemty.svg';
import {
  getGuardianMemos,
  createGuardianMemo,
  updateGuardianMemo,
  deleteGuardianMemo,
  type MemoItem,
} from '../api/guardian';
import { getPatient } from '../api/patient';
import { getPCode } from '../utils/pcode';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 1972;
const CONTENT_LEFT = 636; // 348(sidebar) + 288

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

const LABEL_STYLE: React.CSSProperties = {
  ...F,
  fontSize: 22,
  fontWeight: 700,
  lineHeight: '155%',
  color: '#0D0D0D',
  margin: 0,
};

const DUMMY_PATIENT = {
  name: '-',
  birth_date: '',
  dignosis: '-',
};

// 날짜 포맷 헬퍼
const PREV_MEMOS_DEFAULT: { memoId: number; date: string; desc: string; data: { year: number; month: number; day: number; health: string; sleep: string; meal: string; pain: string; mood: string; behaviors: Set<string>; needReferral: boolean; memo: string } }[] = [];

// 토글 버튼 공통 스타일
function tagStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    padding: '6px 19px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    border: selected ? '1px solid #DFDF87' : '1px solid #8E8E98',
    background: selected ? '#0F66E2' : '#F8F9FA',
    boxShadow: selected ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
    cursor: 'pointer',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    fontSize: 22,
    fontWeight: selected ? 700 : 400,
    color: selected ? '#F8F9FA' : '#0D0D0D',
    whiteSpace: 'nowrap' as const,
  };
}

export default function S20_CargiverMemo() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [patient, setPatient] = useState(DUMMY_PATIENT);

  // 날짜 상태
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day,   setDay]   = useState(today.getDate());
  const [showYearMenu,  setShowYearMenu]  = useState(false);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [showDayMenu,   setShowDayMenu]   = useState(false);

  // 단일 선택 상태
  const [health,  setHealth]  = useState('좋음');
  const [sleep,   setSleep]   = useState('잘잠');
  const [meal,    setMeal]    = useState('식사함');
  const [pain,    setPain]    = useState('없음');
  const [mood,    setMood]    = useState('안정');

  // 중복 선택
  const [behaviors, setBehaviors] = useState<Set<string>>(new Set(['반복 발화']));

  // 체크박스
  const [needReferral, setNeedReferral] = useState(true);

  // 메모
  const [memo, setMemo] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);
  const [selectedMemoIdx, setSelectedMemoIdx] = useState<number | null>(null);
  const [prevMemos, setPrevMemos] = useState(PREV_MEMOS_DEFAULT);

  // 이전 메모 불러오기
  const loadMemo = (data: typeof PREV_MEMOS_DEFAULT[0]['data'], idx: number) => {
    setSelectedMemoIdx(idx);
    setYear(data.year);
    setMonth(data.month);
    setDay(data.day);
    setHealth(data.health);
    setSleep(data.sleep);
    setMeal(data.meal);
    setPain(data.pain);
    setMood(data.mood);
    setBehaviors(new Set(data.behaviors));
    setNeedReferral(data.needReferral);
    setMemo(data.memo);
    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // API: 이전 메모 목록 로드
  useEffect(() => {
    const pCode = getPCode();
    if (!pCode) return;

    // 환자 정보
    getPatient(pCode)
      .then(data => setPatient({ name: data.name, birth_date: '', dignosis: data.diagnosis }))
      .catch(() => {});

    getGuardianMemos(pCode)
      .then(memos => {
        if (memos.length > 0) {
          // API 응답 → 이전 메모 UI에 반영 (최신 2개)
          const mapped = memos.slice(0, 2).map((m: MemoItem) => ({
            memoId: m.memo_id,
            date: m.record_date,
            desc: `${m.health_status} · ${m.sleep_status} · ${m.mood_status}`,
            data: {
              year: parseInt(m.record_date.split('-')[0]),
              month: parseInt(m.record_date.split('-')[1]),
              day: parseInt(m.record_date.split('-')[2]),
              health: m.health_status,
              sleep: m.sleep_status,
              meal: m.meal_status,
              pain: m.pain_status,
              mood: m.mood_status,
              behaviors: new Set(m.behaviors),
              needReferral: m.need_referral,
              memo: m.content,
            },
          }));
          setPrevMemos(mapped);
        }
      })
      .catch(err => console.log('메모 API 미연결:', err instanceof ApiError ? err.message : ''));
  }, []);

  const toggleBehavior = (key: string) => {
    setBehaviors(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const years  = Array.from({ length: 10 }, (_, i) => today.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days   = Array.from({ length: 31 }, (_, i) => i + 1);

  const dropBtn: React.CSSProperties = {
    ...F,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    padding: '6px 19px',
    borderRadius: 10,
    border: '1px solid #0D0D0D',
    background: '#F8F9FA',
    fontSize: 22,
    fontWeight: 400,
    color: '#0D0D0D',
    cursor: 'pointer',
    position: 'relative' as const,
  };

  // top 기준점들
  const TITLE_TOP   = 144;  // 67(header) + 77
  const DATE_LBL    = TITLE_TOP + 34 + 20;   // 198
  const DATE_BOX    = DATE_LBL + 34 + 20;    // 252 (approx: 레이블 높이 34 + gap 20 -> 날짜박스 실질적으로는 레이블 바로 아래)
  const HEALTH_LBL  = DATE_BOX + 35 + 66;    // 353
  const HEALTH_BTN  = HEALTH_LBL + 34 + 20;  // 407
  const MEAL_LBL    = HEALTH_BTN + 35 + 60;  // 502
  const MEAL_BTN    = MEAL_LBL + 34 + 20;    // 556
  const MOOD_LBL    = MEAL_BTN + 35 + 60;    // 651
  const MOOD_BTN    = MOOD_LBL + 34 + 20;    // 705
  const BEHAV_LBL   = MOOD_BTN + 35 + 60;    // 800
  const BEHAV_BTN   = BEHAV_LBL + 34 + 20;   // 854
  const REFERRAL_LBL = BEHAV_BTN + 35 + 60;  // 949
  const REFERRAL_CB  = REFERRAL_LBL + 34 + 20; // 1003
  const MEMO_LBL    = REFERRAL_CB + 35 + 60;  // 1098
  const MEMO_BOX    = MEMO_LBL + 34 + 20;    // 1152
  const BTN_ROW     = MEMO_BOX + 110 + 40;   // 1302
  const PREV_LBL    = BTN_ROW + 46 + 80;     // 1428
  const PREV_CARD1  = PREV_LBL + 42 + 20;    // 이전메모 타이틀 + 간격
  const PREV_CARD2  = PREV_CARD1 + 90 + 20;  // 카드높이 90 + 간격 20

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
        <CaregiverSidebar patient={patient} />

        <div style={{ marginLeft: 348 }}>
          {/* 헤더 */}
          <div style={{ height: 67, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, paddingRight: 348 }}>
            <button onClick={() => navigate('/caregiver-home')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>홈</button>
            <button onClick={() => navigate('/mypage')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>마이페이지</button>
          </div>

          {/* ── 타이틀 ── */}
          <p style={{ ...LABEL_STYLE, fontSize: 30, fontWeight: 700, lineHeight: '140%', position: 'absolute', left: CONTENT_LEFT, top: TITLE_TOP }}>
            {patient.name}님의 건강 · 감정 · 행동 메모
          </p>

          {/* ── 날짜 선택 레이블 ── */}
          <p style={{ ...LABEL_STYLE, position: 'absolute', left: CONTENT_LEFT, top: DATE_LBL }}>날짜 선택</p>

          {/* ── 날짜 드롭다운들 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: DATE_BOX, display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* 년도 */}
            <div style={{ position: 'relative' }}>
              <button style={{ ...dropBtn, width: 'auto', minWidth: 80 }} onClick={() => { setShowYearMenu(v => !v); setShowMonthMenu(false); setShowDayMenu(false); }}>
                {year}
                <img src={polygon} alt="▼" style={{ width: 10, height: 9 }} />
              </button>
              {showYearMenu && (
                <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #0D0D0D', borderRadius: 10, zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto' }}>
                  {years.filter(y => y !== year).map(y => (
                    <div key={y} onClick={() => { setYear(y); setShowYearMenu(false); }}
                      style={{ ...F, padding: '8px 20px', fontSize: 18, cursor: 'pointer', whiteSpace: 'nowrap' }}>{y}</div>
                  ))}
                </div>
              )}
            </div>
            <span style={{ ...F, fontSize: 22, color: '#0D0D0D' }}>년</span>

            {/* 월 */}
            <div style={{ position: 'relative' }}>
              <button style={{ ...dropBtn }} onClick={() => { setShowMonthMenu(v => !v); setShowYearMenu(false); setShowDayMenu(false); }}>
                {month}
                <img src={polygon} alt="▼" style={{ width: 10, height: 9 }} />
              </button>
              {showMonthMenu && (
                <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #0D0D0D', borderRadius: 10, zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto' }}>
                  {months.filter(m => m !== month).map(m => (
                    <div key={m} onClick={() => { setMonth(m); setShowMonthMenu(false); }}
                      style={{ ...F, padding: '8px 20px', fontSize: 18, cursor: 'pointer' }}>{m}</div>
                  ))}
                </div>
              )}
            </div>
            <span style={{ ...F, fontSize: 22, color: '#0D0D0D' }}>월</span>

            {/* 일 */}
            <div style={{ position: 'relative' }}>
              <button style={{ ...dropBtn }} onClick={() => { setShowDayMenu(v => !v); setShowYearMenu(false); setShowMonthMenu(false); }}>
                {day}
                <img src={polygon} alt="▼" style={{ width: 10, height: 9 }} />
              </button>
              {showDayMenu && (
                <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #0D0D0D', borderRadius: 10, zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto' }}>
                  {days.filter(d => d !== day).map(d => (
                    <div key={d} onClick={() => { setDay(d); setShowDayMenu(false); }}
                      style={{ ...F, padding: '8px 20px', fontSize: 18, cursor: 'pointer' }}>{d}</div>
                  ))}
                </div>
              )}
            </div>
            <span style={{ ...F, fontSize: 22, color: '#0D0D0D' }}>일</span>
          </div>

          {/* ── 건강 상태 / 수면 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: HEALTH_LBL, display: 'flex' }}>
            <div>
              <p style={{ ...LABEL_STYLE, marginBottom: 20 }}>건강 상태</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['좋음', '보통', '좋지 않음'].map(v => (
                  <button key={v} onClick={() => setHealth(v)} style={tagStyle(health === v)}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', left: 1084 - CONTENT_LEFT }}>
              <p style={{ ...LABEL_STYLE, marginBottom: 20 }}>수면</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['잘잠', '보통', '못 잠'].map(v => (
                  <button key={v} onClick={() => setSleep(v)} style={tagStyle(sleep === v)}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 식사 / 통증·불편감 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: MEAL_LBL, display: 'flex' }}>
            <div>
              <p style={{ ...LABEL_STYLE, marginBottom: 20 }}>식사</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['식사함', '식사 못 함'].map(v => (
                  <button key={v} onClick={() => setMeal(v)} style={tagStyle(meal === v)}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', left: 1084 - CONTENT_LEFT }}>
              <p style={{ ...LABEL_STYLE, marginBottom: 20 }}>통증 / 불편감</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['없음', '있음'].map(v => (
                  <button key={v} onClick={() => setPain(v)} style={tagStyle(pain === v)}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 기분 상태 ── */}
          <p style={{ ...LABEL_STYLE, position: 'absolute', left: CONTENT_LEFT, top: MOOD_LBL }}>기분 상태</p>
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: MOOD_BTN, display: 'flex', gap: 10 }}>
            {['안정', '불안', '우울', '화남', '부기력'].map(v => (
              <button key={v} onClick={() => setMood(v)} style={tagStyle(mood === v)}>{v}</button>
            ))}
          </div>

          {/* ── 감정·행동 기록 (중복 선택 가능) ── */}
          <p style={{ ...LABEL_STYLE, position: 'absolute', left: CONTENT_LEFT, top: BEHAV_LBL }}>감정 · 행동 기록 (중복 선택 가능)</p>
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: BEHAV_BTN, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['반복 발화', '망상 또는 불안', '분노/무울 반응', '배회 (길을 해맴)', '기타'].map(v => (
              <button key={v} onClick={() => toggleBehavior(v)} style={tagStyle(behaviors.has(v))}>{v}</button>
            ))}
          </div>

          {/* ── 전문기관 연계 필요 여부 ── */}
          <p style={{ ...LABEL_STYLE, position: 'absolute', left: CONTENT_LEFT, top: REFERRAL_LBL }}>전문기관 연계 필요 여부</p>
          <div
            style={{ position: 'absolute', left: CONTENT_LEFT, top: REFERRAL_CB, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => setNeedReferral(v => !v)}
          >
            <img
              src={needReferral ? checkboxB : checkemty}
              alt="checkbox"
              style={{ width: 26, height: 26 }}
            />
            <span style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D' }}>
              연계 검토 필요 시 체크 (알림)
            </span>
          </div>

          {/* ── 특이 행동 메모 (선택) ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: MEMO_LBL, display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <p style={LABEL_STYLE}>특이 행동 메모 (선택)</p>
            <span style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#797980' }}>
              *작성한 메모는 의료진 리포트에도 참도될 수 있습니다.</span>
          </div>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            style={{
              position: 'absolute',
              left: CONTENT_LEFT,
              top: MEMO_BOX,
              width: 934,
              height: 110,
              padding: '23px 29px',
              boxSizing: 'border-box',
              borderRadius: 10,
              border: '1px solid #8E8E98',
              background: 'rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #4188ED',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 22,
              fontWeight: 400,
              color: '#0D0D0D',
              resize: 'none',
              outline: 'none',
            }}
          />

          {/* ── 버튼 행: 삭제 / 수정 / 저장 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: BTN_ROW, width: 934, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* 삭제 */}
            <button
              onClick={async () => {
                // 선택된 이전 메모가 있으면 서버에서도 삭제
                if (selectedMemoIdx !== null && prevMemos[selectedMemoIdx]?.memoId) {
                  const pCode = getPCode();
                  if (pCode) {
                    try {
                      await deleteGuardianMemo(pCode, prevMemos[selectedMemoIdx].memoId);
                      setPrevMemos(prev => prev.filter((_, i) => i !== selectedMemoIdx));
                      setSelectedMemoIdx(null);
                    } catch (err) {
                      console.log('삭제 실패:', err instanceof ApiError ? err.message : err);
                    }
                  }
                }
                setMemo('');
              }}
              style={{
                ...F, display: 'inline-flex', padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
                borderRadius: 50, background: '#F8F9FA', border: 'none',
                boxShadow: '0 0 4px 0 #E53134', cursor: 'pointer',
                fontSize: 22, fontWeight: 700, color: '#E53134',
              }}>삭제</button>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* 저장 완료 메시지 */}
              {savedMsg && (
                <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#4188ED' }}>저장되었습니다</span>
              )}

              {/* 수정 */}
              <button
                onClick={async () => {
                  if (selectedMemoIdx === null) {
                    alert('수정할 이전 메모를 먼저 선택해주세요.');
                    return;
                  }
                  const pCode = getPCode();
                  const memoId = prevMemos[selectedMemoIdx]?.memoId;
                  if (!pCode || !memoId) return;
                  try {
                    await updateGuardianMemo(pCode, memoId, {
                      record_date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
                      health_status: health,
                      sleep_status: sleep,
                      meal_status: meal,
                      pain_status: pain,
                      mood_status: mood,
                      behaviors: Array.from(behaviors),
                      need_referral: needReferral,
                      content: memo,
                    });
                    // UI에도 반영
                    setPrevMemos(prev => prev.map((m, i) =>
                      i === selectedMemoIdx
                        ? { ...m, desc: `${health} · ${sleep} · ${mood}`, data: { year, month, day, health, sleep, meal, pain, mood, behaviors: new Set(behaviors), needReferral, memo } }
                        : m
                    ));
                    setSavedMsg(true);
                    setTimeout(() => setSavedMsg(false), 2000);
                  } catch (err) {
                    console.log('수정 실패:', err instanceof ApiError ? err.message : err);
                  }
                }}
                style={{
                ...F, display: 'inline-flex', padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
                borderRadius: 50, background: '#F8F9FA', border: 'none',
                boxShadow: '0 0 4px 0 #0D0D0D', cursor: 'pointer',
                fontSize: 22, fontWeight: 700, color: '#0D0D0D',
              }}>수정</button>

              {/* 저장 */}
              <button
                onClick={async () => {
                  const pCode = getPCode();
                  if (pCode) {
                    try {
                      await createGuardianMemo(pCode, {
                        record_date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
                        health_status: health,
                        sleep_status: sleep,
                        meal_status: meal,
                        pain_status: pain,
                        mood_status: mood,
                        behaviors: Array.from(behaviors),
                        need_referral: needReferral,
                        content: memo,
                      });
                    } catch (err) {
                      console.log('메모 저장 API 실패:', err instanceof ApiError ? err.message : err);
                    }
                  }
                  setSavedMsg(true);
                  setTimeout(() => setSavedMsg(false), 2000);
                }}
                style={{
                  ...F, display: 'inline-flex', padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
                  borderRadius: 50, background: '#4188ED', border: 'none',
                  boxShadow: '0 0 4px 0 #4188ED', cursor: 'pointer',
                  fontSize: 22, fontWeight: 700, color: '#F8F9FA',
                }}>저장</button>
            </div>
          </div>

          {/* ── 이전 메모 ── */}
          <p style={{
            position: 'absolute', left: CONTENT_LEFT, top: PREV_LBL,
            fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700,
            lineHeight: '140%', color: '#0D0D0D', margin: 0,
          }}>이전 메모</p>

          {prevMemos.map((m, i) => {
            const isSelected = selectedMemoIdx === i;
            return (
            <div key={m.date}
              onClick={() => loadMemo(m.data, i)}
              style={{
                position: 'absolute',
                left: CONTENT_LEFT,
                top: (i === 0 ? PREV_CARD1 : PREV_CARD2),
                display: 'flex',
                width: 934,
                padding: '20px 29px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                boxSizing: 'border-box',
                borderRadius: 10,
                border: isSelected ? '1px solid #4188ED' : '1px solid #8E8E98',
                background: isSelected ? '#0F66E2' : '#F8F9FA',
                boxShadow: isSelected ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
                cursor: 'pointer',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
            >
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: isSelected ? '#F8F9FA' : '#0D0D0D' }}>{m.date}</p>
              <p style={{ ...F, margin: '4px 0 0', fontSize: 18, fontWeight: 400, lineHeight: '155%', color: isSelected ? 'rgba(248,249,250,0.8)' : '#797980' }}>{m.desc}</p>
            </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
