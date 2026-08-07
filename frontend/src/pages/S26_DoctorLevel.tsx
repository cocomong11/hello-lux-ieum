import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/DoctorSidebar';
import { updatePatientStatus, updateDoctorLevel } from '../api/doctor';
import { getPatient } from '../api/patient';
import { getPCode } from '../utils/pcode';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 1773;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

const EMPTY_PATIENT_DATA = {
  name: '-', birth_date: '', dignosis: '-', support_level: '-',
  recentKMMSE: '', kmmseScore: '-', kmmseRange: '-',
  stats: { activity: '-', rate: '-', hint: '-' },
  memo: '',
};

const LEVELS = [
  { num: 1, label: '쉬움', desc: '힌트0' },
  { num: 2, label: '보통', desc: '힌트1' },
  { num: 3, label: '어려움', desc: '힌트1~2' },
];

const HINT_OPTIONS = ['없음', '보통', '1~2개'];
const TTS_LENGTH = ['짧음', '보통'];
const TTS_SPEED = ['느리게', '보통'];

export default function S26_DoctorLevel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pCode = Number(searchParams.get('p_code')) || 1001;
  const [scale, setScale] = useState(1);
  const [patientData, setPatientData] = useState(EMPTY_PATIENT_DATA);
  const patient = { ...patientData };

  const [selectedLevel, setSelectedLevel] = useState(3);

  // 난이도에 따라 힌트 제공 수준 자동 결정
  const getHintByLevel = (level: number): string => {
    if (level === 1) return '없음';
    if (level === 2) return '보통';
    return '1~2개';
  };

  const hintLevel = getHintByLevel(selectedLevel);
  const [repeatAuto, setRepeatAuto] = useState(true);
  const [ttsLength, setTtsLength] = useState('짧음');
  const [ttsSpeed, setTtsSpeed] = useState('느리게');
  const [reason, setReason] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);
  const [history, setHistory] = useState<{ title: string; desc: string }[]>([]);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // API: 환자 정보 로드
  useEffect(() => {
    getPatient(pCode)
      .then(data => {
        setPatientData(prev => ({
          ...prev,
          name: data.name,
          dignosis: data.diagnosis,
        }));
      })
      .catch(err => console.log('환자 정보 API 미연결:', err instanceof ApiError ? err.message : err));
  }, [pCode]);

  const handleSave = async () => {
    // 서버에 난이도 변경 요청
    const targetPCode = getPCode() || pCode;
    if (targetPCode) {
      try {
        const levelLabel = LEVELS[selectedLevel - 1]?.label || '';
        await updatePatientStatus(targetPCode, levelLabel);
        await updateDoctorLevel(targetPCode, { quiz_type: 'multiple', level: selectedLevel });
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('난이도 변경 실패:', err.message);
        }
      }
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
    const newEntry = {
      title: `${selectedLevel}단계로 조정 · ${dateStr}`,
      desc: reason + ` [담당 : 김민준]`,
    };
    setHistory(prev => [newEntry, ...prev]);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  // 토글 컴포넌트 (S06과 동일)
  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{
      width: 78, height: 41, borderRadius: 100, cursor: 'pointer',
      background: value ? '#DFDF87' : '#DDDDE6',
      position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        width: 33, height: 33, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        position: 'absolute', top: 4, left: value ? 41 : 4,
        transition: 'left 0.2s',
      }} />
    </div>
  );

  // 태그 버튼
  const TagBtn = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <div onClick={onClick} style={{
      display: 'inline-flex', padding: '6px 19px', justifyContent: 'center', alignItems: 'center', gap: 10,
      borderRadius: 10, cursor: 'pointer',
      border: selected ? '1px solid #DFDF87' : '1px solid #8E8E98',
      background: selected ? '#0F66E2' : '#F8F9FA',
      boxShadow: selected ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
    }}>
      <span style={{ ...F, fontSize: 22, fontWeight: selected ? 700 : 400, lineHeight: '155%', color: selected ? '#F8F9FA' : '#797980', textAlign: 'center' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: DESIGN_H * scale, overflowX: 'hidden', background: 'var(--color-neutral-100)' }}>
      <div style={{ width: DESIGN_W, height: DESIGN_H, position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})`, background: 'var(--color-neutral-100)' }}>
        <Sidebar patient={patient} />

        <div style={{ marginLeft: 348 }}>
          {/* 헤더 */}
          <div style={{ height: 67, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, paddingRight: 348 }}>
            <button onClick={() => navigate('/doctor-home')} style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>홈</button>
            <button onClick={() => navigate('/mypage')} style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>마이페이지</button>
          </div>

          {/* 메인 */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: 144 }}>

            {/* 안내 박스 */}
            <div style={{
              display: 'flex', width: 936, padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
              borderRadius: 10, border: '1px solid #4188ED',
              background: 'linear-gradient(180deg, rgba(223,223,135,0.20) 0%, rgba(248,249,250,0.20) 100%), rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #DFDF87',
            }}>
              <p style={{ ...F, fontSize: 16, fontWeight: 400, lineHeight: '165%', color: '#0D0D0D', margin: 0, textAlign: 'center' }}>
                난이도는 가능한 한 일정하게 유지합니다. 수시로 조절하면 환자 상태 변화를 객관적으로 파악하기 어렵습니다.<br />
                기본 원칙 : <span style={{ fontWeight: 700 }}>기준 난이도 유지</span> → 힌트 충분히 제공. 진행이 거의 불가능한 경우에만 하향 검토.
              </p>
            </div>

            {/* 현재 기준 난이도 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 60 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700, lineHeight: '140%', color: '#0D0D0D' }}>현재 기준 난이도</span>
              <div style={{
                display: 'inline-flex', height: 42, padding: '10px 20px', justifyContent: 'center', alignItems: 'center', gap: 10,
                borderRadius: 50, background: '#4188ED',
              }}>
                <span style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#F8F9FA' }}>2단계 보통</span>
              </div>
            </div>

            {/* 난이도 카드 3개 */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
              {LEVELS.map(lv => {
                const isSelected = selectedLevel === lv.num;
                return (
                  <div key={lv.num} onClick={() => setSelectedLevel(lv.num)} style={{
                    width: 175, height: 155, borderRadius: 10, cursor: 'pointer',
                    border: isSelected ? '1px solid #DFDF87' : '1px solid #8E8E98',
                    background: isSelected ? '#0F66E2' : '#F8F9FA',
                    boxShadow: isSelected ? '0 0 4px 0 #2073E8' : '0 0 4px 0 #797980',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ ...F, fontSize: 54, fontWeight: 700, lineHeight: '130%', color: isSelected ? '#F8F9FA' : '#0D0D0D', textAlign: 'center' }}>{lv.num}</span>
                    <span style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: isSelected ? '#F8F9FA' : '#0D0D0D', textAlign: 'center' }}>{lv.label}</span>
                    <span style={{ ...F, fontSize: 16, fontWeight: isSelected ? 700 : 400, lineHeight: '165%', color: isSelected ? '#F8F9FA' : '#797980', textAlign: 'center' }}>{lv.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* 힌트 및 안내 설정 */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700, lineHeight: '140%', color: '#0D0D0D', marginTop: 60, marginBottom: 20 }}>힌트 및 안내 설정</p>
            <div style={{
              width: 936, borderRadius: 10, background: 'rgba(65,136,237,0.05)',
              padding: '24px 29px', boxSizing: 'border-box',
              display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 24, columnGap: 40,
            }}>
              {/* 힌트 제공 수준 (자동 - 수정 불가) */}
              <div>
                <p style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D', margin: '0 0 16px' }}>힌트 제공 수준</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {HINT_OPTIONS.map(opt => (
                    <div key={opt} style={{
                      display: 'inline-flex', padding: '6px 19px', justifyContent: 'center', alignItems: 'center', gap: 10,
                      borderRadius: 10,
                      border: hintLevel === opt ? '1px solid #DFDF87' : '1px solid #8E8E98',
                      background: hintLevel === opt ? '#0F66E2' : '#F8F9FA',
                      boxShadow: hintLevel === opt ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
                      opacity: hintLevel === opt ? 1 : 0.5,
                    }}>
                      <span style={{ ...F, fontSize: 22, fontWeight: hintLevel === opt ? 700 : 400, lineHeight: '155%', color: hintLevel === opt ? '#F8F9FA' : '#797980', textAlign: 'center' }}>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 반복 안내 자동 제공 */}
              <div>
                <p style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D', margin: '0 0 16px' }}>반복 안내 자동 제공</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Toggle value={repeatAuto} onChange={() => setRepeatAuto(v => !v)} />
                  <span style={{ ...F, fontSize: 22, fontWeight: 400, color: '#0D0D0D' }}>{repeatAuto ? '켜짐' : '꺼짐'}</span>
                </div>
              </div>

              {/* TTS 문장 길이 */}
              <div>
                <p style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D', margin: '0 0 16px' }}>TTS 문장 길이</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {TTS_LENGTH.map(opt => <TagBtn key={opt} label={opt} selected={ttsLength === opt} onClick={() => setTtsLength(opt)} />)}
                </div>
              </div>

              {/* TTS 속도 */}
              <div>
                <p style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D', margin: '0 0 16px' }}>TTS 속도</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {TTS_SPEED.map(opt => <TagBtn key={opt} label={opt} selected={ttsSpeed === opt} onClick={() => setTtsSpeed(opt)} />)}
                </div>
              </div>
            </div>

            {/* 조정 사유 (필수) */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700, lineHeight: '140%', color: '#0D0D0D', marginTop: 85, marginBottom: 20 }}>
              조정 사유 (필수)<span style={{ color: '#4188ED' }}>*</span>
            </p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{
                width: 936, height: 113, padding: '23px 29px', boxSizing: 'border-box',
                borderRadius: 10, border: '1px solid #8E8E98',
                background: 'rgba(65,136,237,0.05)', boxShadow: '0 0 4px 0 #4188ED',
                ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D',
                resize: 'none', outline: 'none',
              }}
            />

            {/* 취소 / 저장 */}
            <div style={{ marginTop: 60, width: 936, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => navigate(-1)} style={{
                ...F, display: 'inline-flex', padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
                borderRadius: 50, background: '#F8F9FA', border: 'none',
                boxShadow: '0 0 4px 0 #E53134', cursor: 'pointer',
                fontSize: 22, fontWeight: 700, color: '#E53134',
              }}>취소</button>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {savedMsg && <span style={{ ...F, fontSize: 18, fontWeight: 600, color: '#4188ED' }}>저장되었습니다</span>}
                <button onClick={handleSave} style={{
                  ...F, display: 'inline-flex', padding: '12px 22px', justifyContent: 'center', alignItems: 'center', gap: 10,
                  borderRadius: 50, background: '#4188ED', border: 'none',
                  boxShadow: '0 0 4px 0 #4188ED', cursor: 'pointer',
                  fontSize: 22, fontWeight: 700, color: '#F8F9FA',
                }}>저장</button>
              </div>
            </div>

            {/* 이전 조정 이력 */}
            <p style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D', marginTop: 81, marginBottom: 20 }}>이전 조정 이력</p>
            {history.map((item, i) => (
              <div key={i} style={{
                display: 'inline-flex', width: 936, padding: '20px 29px', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'flex-start',
                borderRadius: 10, border: '1px solid #8E8E98', background: '#F8F9FA',
                boxShadow: '0 0 4px 0 #797980', boxSizing: 'border-box',
                marginBottom: 16,
              }}>
                <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: '#0D0D0D' }}>{item.title}</p>
                <p style={{ ...F, margin: '4px 0 0', fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#797980' }}>{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
