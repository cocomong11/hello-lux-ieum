import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';

const DESIGN_W = 1920;
const DESIGN_H = 1747;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
};

const DUMMY_PATIENT = {
  name: '홍길동',
  birth_date: '1950-01-01',
  level: '경도인지장애',
};

type MemberEntry = {
  name: string;
  age: string;
  alias: string;
  keyword: string;
  isEditing: boolean;
};

const INITIAL_MEMBERS: Record<string, MemberEntry[]> = {
  '가족': [
    { name: '김순자', age: '78세', alias: '아내, 여보', keyword: '김순자, 순자, 아내, 여보, 우리 마누라, 집사람', isEditing: true },
    { name: '홍민수', age: '41세', alias: '아들, 장남', keyword: '홍민수, 민수, 아들, 큰아들, 장남', isEditing: false },
  ],
  '지인': [{ name: '', age: '', alias: '', keyword: '', isEditing: true }],
  '장소': [{ name: '', age: '', alias: '', keyword: '', isEditing: true }],
  '음식': [{ name: '', age: '', alias: '', keyword: '', isEditing: true }],
  '노래': [{ name: '', age: '', alias: '', keyword: '', isEditing: true }],
  '인생 사건': [{ name: '', age: '', alias: '', keyword: '', isEditing: true }],
};

const PREVIEW_QUESTIONS = [
  '배우자 분 성함이 어떻게 되세요?',
  '아드님 이름이 기억나시나요?',
  '이 사진 속에 있는 사람은 누구인가요?',
];

// 텍스트 인풋 박스 기본 스타일
function inputBoxStyle(isEditing: boolean): React.CSSProperties {
  return {
    borderRadius: 10,
    border: '1px solid #8E8E98',
    background: isEditing ? 'rgba(65,136,237,0.05)' : '#F8F9FA',
    boxShadow: isEditing ? '0 0 4px 0 #4188ED' : '0 0 4px 0 #797980',
    padding: '10px 14px',
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontSize: 22,
    fontWeight: 400,
    color: '#0D0D0D',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };
}

export default function S21_CargiverUpdate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '가족';
  const [scale, setScale] = useState(1);
  const patient = DUMMY_PATIENT;

  const [members, setMembers] = useState<Record<string, MemberEntry[]>>(INITIAL_MEMBERS);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const currentMembers = members[category] || [];

  const updateMember = (idx: number, field: keyof MemberEntry, value: string) => {
    setMembers(prev => ({
      ...prev,
      [category]: prev[category].map((m, i) => i === idx ? { ...m, [field]: value } : m),
    }));
  };

  const toggleEdit = (idx: number) => {
    setMembers(prev => ({
      ...prev,
      [category]: prev[category].map((m, i) => i === idx ? { ...m, isEditing: !m.isEditing } : m),
    }));
  };

  const deleteMember = (idx: number) => {
    setMembers(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx),
    }));
  };

  const addMember = () => {
    setMembers(prev => ({
      ...prev,
      [category]: [
        prev[category][0],
        { name: '', age: '', alias: '', keyword: '', isEditing: true },
        ...prev[category].slice(1),
      ],
    }));
  };

  const handleSave = (idx: number) => {
    toggleEdit(idx);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

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
          <div style={{ height: 67, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, paddingRight: 40 }}>
            <button onClick={() => navigate('/cargiver-home')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>홈</button>
            <button onClick={() => navigate('/cargiver-mypage')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>마이페이지</button>
          </div>

          {/* ── 메인 콘텐츠 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: 144 }}>

            {/* 타이틀 */}
            <p style={{ ...F, fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>
              {category} 정보 수정
            </p>

            {/* 멤버 수정 카드들 */}
            {currentMembers.map((member, idx) => {
              const isEdit = member.isEditing;

              return (
                <div
                  key={idx}
                  style={{
                    marginTop: idx === 0 ? 20 : 38,
                    width: 936,
                    minHeight: 401,
                    borderRadius: 10,
                    border: isEdit ? 'none' : '1px solid #8E8E98',
                    background: isEdit ? 'rgba(65,136,237,0.05)' : '#F8F9FA',
                    boxShadow: isEdit ? 'none' : '0 0 4px 0 #797980',
                    padding: '21px 23px 22px 23px',
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                >
                  {/* 사진 영역 */}
                  <div style={{
                    position: 'absolute', top: 21, left: 23,
                    width: 138, height: 129,
                    display: 'flex',
                    justifyContent: 'center', alignItems: 'center',
                    borderRadius: 6,
                    border: '0.6px solid #8E8E98',
                    background: 'var(--color-neutral-90, #DDDDE6)',
                    boxShadow: '0 0 2.4px 0 #4188ED',
                  }}>
                    <span style={{ ...F, fontSize: 14, color: '#797980', textAlign: 'center' }}>{category} 사진</span>
                  </div>

                  {/* 이름 */}
                  <div style={{ position: 'absolute', top: 21, left: 188 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>이름</p>
                    <input
                      value={member.name}
                      onChange={e => updateMember(idx, 'name', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 205, marginTop: 14, paddingTop:23,paddingLeft:29,paddingBottom:24}}
                    />
                  </div>

                  {/* 나이 */}
                  <div style={{ position: 'absolute', top: 21, left: 407 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>나이</p>
                    <input
                      value={member.age}
                      onChange={e => updateMember(idx, 'age', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 150, marginTop: 14,paddingTop:23,paddingLeft:29,paddingBottom:24 }}
                    />
                  </div>

                  {/* 호칭 / 유사표현 */}
                  <div style={{ position: 'absolute', top: 21, left: 570 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>호칭 / 유사표현</p>
                    <input
                      value={member.alias}
                      onChange={e => updateMember(idx, 'alias', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 346, marginTop: 14, paddingTop:23,paddingLeft:29,paddingBottom:24}}
                    />
                  </div>

                  {/* 정답 키워드 */}
                  <div style={{ position: 'absolute', top: 164, left: 188 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D'}}>정답 키워드</p>
                    <input
                      value={member.keyword}
                      onChange={e => updateMember(idx, 'keyword', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 728, marginTop:14, paddingTop:23,paddingLeft:29,paddingBottom:24 }}
                    />
                  </div>

                  {/* 버튼 행 */}
                  <div style={{
                    position: 'absolute', bottom: 21, left: 23, right: 20,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {isEdit ? (
                      <>
                        {/* 삭제 */}
                        <button
                          onClick={() => deleteMember(idx)}
                          style={{
                            ...F, display: 'inline-flex', padding: '12px 22px',
                            justifyContent: 'center', alignItems: 'center', gap: 10,
                            borderRadius: 50, background: 'var(--color-neutral-100)', border: 'none',
                            boxShadow: '0 0 4px 0 #E53134', cursor: 'pointer',
                            fontSize: 22, fontWeight: 700, color: '#E53134',
                          }}
                        >삭제</button>
                        <div>
                          {/* 저장 */}
                          <button
                            onClick={() => handleSave(idx)}
                            style={{
                              ...F, display: 'inline-flex', padding: '12px 22px',
                              justifyContent: 'center', alignItems: 'center', gap: 10,
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
                          onClick={() => toggleEdit(idx)}
                          style={{
                            ...F, display: 'inline-flex', padding: '12px 22px',
                            justifyContent: 'center', alignItems: 'center', gap: 10,
                            borderRadius: 50, background: '#F8F9FA', border: 'none',
                            boxShadow: '0 0 4px 0 #0D0D0D', cursor: 'pointer',
                            fontSize: 22, fontWeight: 700, color: '#0D0D0D',
                          }}
                        >수정</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 저장 메시지 */}
            {savedMsg && (
              <p style={{ ...F, marginTop: 8, fontSize: 18, fontWeight: 600, color: '#4188ED' }}>저장되었습니다</p>
            )}

            {/* + 항목 추가 버튼 */}
            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={addMember}
                style={{
                  ...F, display: 'inline-flex', padding: '6px 19px',
                  justifyContent: 'center', alignItems: 'center', gap: 10,
                  borderRadius: 10, border: '1px solid #8E8E98',
                  background: '#F8F9FA', boxShadow: '0 0 4px 0 #797980',
                  cursor: 'pointer', fontSize: 22, fontWeight: 700, color: '#0D0D0D',
                }}
              >
                + 항목 추가
              </button>
            </div>

            {/* 예상 생성 질문 미리보기 */}
            <div style={{
              marginTop: 60,
              width: 935, height: 421,
              borderRadius: 10,
              border: '1px solid #4188ED',
              background: 'rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px 0 #4188ED',
              paddingTop: 24, paddingLeft: 29, paddingBottom: 29,
              boxSizing: 'border-box',
              position: 'relative',
            }}>
              <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 400, lineHeight: '165%', color: '#0D0D0D' }}>
                예상 생성 질문 미리보기
              </p>

              {PREVIEW_QUESTIONS.map((q, i) => (
                <div key={i} style={{
                  marginTop: 20,
                  display: 'flex',
                  width: 'fit-content',
                  padding: '16px 29px 15px 29px',
                  justifyContent: 'center', alignItems: 'center',
                  borderRadius: '20px 20px 20px 0',
                  border: '1px solid #8E8E98',
                  background: 'linear-gradient(180deg, rgba(32,115,232,0.20) 0%, rgba(223,223,135,0.20) 100%), rgba(65,136,237,0.05)',
                  boxShadow: '0 0 4px 0 #4188ED',
                }}>
                  <span style={{ ...F, fontSize: 22, fontWeight: 600, lineHeight: '155%', color: '#0D0D0D' }}>{q}</span>
                </div>
              ))}

              {/* TTS 버튼 */}
              <div style={{
                marginTop: 20,
                display: 'inline-flex',
                padding: '6px 19px', alignItems: 'center', gap: 10,
                borderRadius: 10, border: '1px solid #8E8E98',
                background: '#F8F9FA', boxShadow: '0 0 2px 0 #797980',
                cursor: 'pointer',
              }}>
                <span style={{ ...F, fontSize: 22, fontWeight: 400, color: '#797980' }}>▶ TTS 음성 읽어주기</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
