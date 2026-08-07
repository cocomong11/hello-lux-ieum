import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';
import { getMemory, patchMemory, getPatient, uploadPatientImage, type LifeDbResponse } from '../api/patient';
import { getPCode } from '../utils/pcode';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 1747;
const CONTENT_LEFT = 636;

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

const DUMMY_PATIENT = {
  name: '-',
  birth_date: '',
  dignosis: '-',
};

type MemberEntry = {
  name: string;
  age: string;
  alias: string;
  keyword: string;
  isEditing: boolean;
  photo?: string; // 미리보기 URL
};

const INITIAL_MEMBERS: Record<string, MemberEntry[]> = {
  '가족': [],
  '지인': [],
  '장소': [],
  '음식': [],
  '인생 사건': [],
};

const LEVELS: Record<string, { field1: string; field2: string; field3: string }> = {
  '가족':     { field1: '이름', field2: '나이', field3: '호칭 / 유사표현' },
  '지인':     { field1: '이름', field2: '나이', field3: '호칭 / 유사표현' },
  '장소':     { field1: '이름', field2: '위치', field3: '호칭 / 유사표현' },
  '음식':     { field1: '이름', field2: '',     field3: '호칭 / 유사표현' },
  '인생 사건': { field1: '이름', field2: '당시 나이', field3: '호칭 / 유사표현' },
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
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
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
  const [patient, setPatient] = useState(DUMMY_PATIENT);

  const [members, setMembers] = useState<Record<string, MemberEntry[]>>(INITIAL_MEMBERS);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // API: 환자 정보 + 삶의 DB 로드
  useEffect(() => {
    const pCode = getPCode();
    if (!pCode) return;
    getPatient(pCode)
      .then(data => setPatient({ name: data.name, birth_date: '', dignosis: data.diagnosis }))
      .catch(() => {});
    getMemory(pCode, 1) // TODO: memory_id 관리
      .then((data: LifeDbResponse) => {
        // family 필드 → 가족 카테고리로 파싱
        if (data.family) {
          const parsed = data.family.split(';;').map(row => {
            const [name = '', age = '', alias = '', keyword = ''] = row.split('|');
            return { name, age, alias, keyword, isEditing: false };
          });
          if (parsed.length > 0) {
            setMembers(prev => ({ ...prev, '가족': parsed }));
          }
        }
        if (data.place) {
          const parsed = data.place.split(';;').map(row => {
            const [name = '', age = '', alias = '', keyword = ''] = row.split('|');
            return { name, age, alias, keyword, isEditing: false };
          });
          if (parsed.length > 0) {
            setMembers(prev => ({ ...prev, '장소': parsed }));
          }
        }
        if (data.like) {
          const parsed = data.like.split(';;').map(row => {
            const [name = '', age = '', alias = '', keyword = ''] = row.split('|');
            return { name, age, alias, keyword, isEditing: false };
          });
          if (parsed.length > 0) {
            setMembers(prev => ({ ...prev, '음식': parsed }));
          }
        }
      })
      .catch(err => {
        // API 실패 시 더미 데이터 유지
        console.log('API 미연결, 더미 데이터 사용:', err instanceof ApiError ? err.message : err);
      });
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

  const handleSave = async (idx: number) => {
    toggleEdit(idx);

    // 서버 연동: 카테고리 → LifeDb 필드 매핑
    const pCode = getPCode();
    if (pCode) {
      const currentData = members[category];
      const serialized = currentData
        .map(m => `${m.name}|${m.age}|${m.alias}|${m.keyword}`)
        .join(';;');

      // 카테고리별로 어떤 필드에 저장할지 매핑
      const fieldMap: Record<string, string> = {
        '가족': 'family',
        '지인': 'family',
        '장소': 'place',
        '음식': 'like',
        '인생 사건': 'hometown',
      };

      const field = fieldMap[category];
      if (field) {
        try {
          await patchMemory(pCode, {
            memory_id: 1, // TODO: 실제 memory_id 관리 필요
            [field]: serialized,
          });
        } catch (err) {
          if (err instanceof ApiError) {
            console.error('저장 실패:', err.message);
          }
        }
      }
    }

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
          <div style={{ height: 67, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, paddingRight: 348 }}>
            <button onClick={() => navigate('/caregiver-home')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>홈</button>
            <button onClick={() => navigate('/mypage')}
              style={{ ...F, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer' }}>마이페이지</button>
          </div>

          {/* ── 메인 콘텐츠 ── */}
          <div style={{ position: 'absolute', left: CONTENT_LEFT, top: 144 }}>

            {/* 타이틀 */}
            <p style={{ ...F, fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: 0 }}>
              {category} 정보 수정
            </p>

            {/* 멤버 수정 카드들 */}
            {currentMembers.length === 0 && (
              <p style={{ ...F, marginTop: 30, fontSize: 20, color: '#797980' }}>
                등록된 정보가 없습니다. 아래 "항목 추가" 버튼으로 추가해주세요.
              </p>
            )}
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
                  {/* 사진 영역 - 클릭하면 파일 선택 */}
                  <label style={{
                    position: 'absolute', top: 21, left: 23,
                    width: 138, height: 129,
                    display: 'flex',
                    justifyContent: 'center', alignItems: 'center',
                    borderRadius: 6,
                    border: '0.6px solid #8E8E98',
                    background: 'var(--color-neutral-90, #DDDDE6)',
                    boxShadow: '0 0 2.4px 0 #4188ED',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}>
                    {member.photo ? (
                      <img src={member.photo} alt="업로드된 사진" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ ...F, fontSize: 14, color: '#797980', textAlign: 'center' }}>{category} 사진</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // 로컬 미리보기
                          const url = URL.createObjectURL(file);
                          setMembers(prev => ({
                            ...prev,
                            [category]: prev[category].map((m, i) => i === idx ? { ...m, photo: url } : m),
                          }));
                          // 서버 업로드
                          const pCode = getPCode();
                          if (pCode) {
                            try {
                              const res = await uploadPatientImage(pCode, file);
                              // 서버 URL로 교체
                              setMembers(prev => ({
                                ...prev,
                                [category]: prev[category].map((m, i) => i === idx ? { ...m, photo: res.photo_url } : m),
                              }));
                            } catch (err) {
                              console.log('이미지 업로드 실패:', err);
                            }
                          }
                        }
                      }}
                    />
                  </label>

                  {/* 이름 */}
                  <div style={{ position: 'absolute', top: 21, left: 188 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>{LEVELS[category]?.field1 || '이름'}</p>
                    <input
                      value={member.name}
                      onChange={e => updateMember(idx, 'name', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 205, marginTop: 14, paddingTop:23,paddingLeft:29,paddingBottom:24}}
                    />
                  </div>

                  {/* 나이/위치/당시나이 */}
                  {LEVELS[category]?.field2 && (
                  <div style={{ position: 'absolute', top: 21, left: 407 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>{LEVELS[category].field2}</p>
                    <input
                      value={member.age}
                      onChange={e => updateMember(idx, 'age', e.target.value)}
                      disabled={!isEdit}
                      style={{ ...inputBoxStyle(isEdit), width: 150, marginTop: 14,paddingTop:23,paddingLeft:29,paddingBottom:24 }}
                    />
                  </div>
                  )}

                  {/* 호칭 / 유사표현 */}
                  <div style={{ position: 'absolute', top: 21, left: LEVELS[category]?.field2 ? 570 : 407 }}>
                    <p style={{ ...F, fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D', margin: 0 }}>{LEVELS[category]?.field3 || '호칭 / 유사표현'}</p>
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
