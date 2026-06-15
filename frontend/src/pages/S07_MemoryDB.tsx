import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const imgUpload = "https://www.figma.com/api/mcp/asset/daa64d7e-c69f-46f7-a280-9ff3c5e757b0"
const imgPolygon = "https://www.figma.com/api/mcp/asset/e85d2d33-89b8-4942-b51e-e59cf186889b"

const CANVAS_H = 1660
const SIDEBAR_W = 348
const F: React.CSSProperties = { fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }

type Category = '가족 정보' | '지인 정보' | '장소 정보' | '좋아하는 음식' | '좋아하는 노래' | '인생 주요 사건' | '사진 자료'
const CATEGORIES: Category[] = ['가족 정보', '지인 정보', '장소 정보', '좋아하는 음식', '좋아하는 노래', '인생 주요 사건', '사진 자료']

export default function S07_MemoryDB() {
  const navigate = useNavigate()
  const [scale, setScale] = useState(1)
  const [activeCategory, setActiveCategory] = useState<Category>('가족 정보')
  const [members, setMembers] = useState([
    { relation: '배우자', name: '김순자 / 여보', age: '78세' },
    { relation: '', name: '', age: '' },
  ])

  useEffect(() => {
    const update = () => setScale(window.innerWidth / 1920)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const updateMember = (idx: number, field: 'relation' | 'name' | 'age', value: string) => {
    setMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))
  }

  const addMember = () => {
    setMembers(prev => [...prev, { relation: '', name: '', age: '' }])
  }

  const InputBox = ({ left, top, width, placeholder, value, onChange, filled = false }: {
    left: number; top: number; width: number; placeholder: string; value: string; onChange?: (v: string) => void; filled?: boolean
  }) => (
    <div style={{
      position: 'absolute', left, top, width, height: 81, boxSizing: 'border-box',
      border: '1px solid #8e8e98', borderRadius: 10,
      background: filled ? 'rgba(65,136,237,0.05)' : '#f8f9fa',
      filter: 'drop-shadow(0 0 2px #4188ed)',
      display: 'flex', alignItems: 'center', paddingLeft: 29, paddingRight: 29,
    }}>
      {onChange ? (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...F, flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: value ? '#0d0d0d' : '#797980' }}
        />
      ) : (
        <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#0d0d0d', whiteSpace: 'nowrap' }}>{value}</p>
      )}
    </div>
  )

  const ColLabel = ({ left, top, children }: { left: number; top: number; children: string }) => (
    <p style={{ ...F, position: 'absolute', left, top, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#0d0d0d' }}>{children}</p>
  )

  const PhotoBox = ({ left, top, label }: { left: number; top: number; label: string }) => (
    <div style={{
      position: 'absolute', left, top, width: 296, height: 168,
      border: '1px solid #8e8e98', borderRadius: 10,
      background: 'rgba(217,217,217,0.2)',
      boxShadow: '0 0 4px #4188ed',
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 21, boxSizing: 'border-box',
    }}>
      <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#797980', textAlign: 'center' }}>
        {label}<br />(JPG/PNG 최대 5MB)
      </p>
      <img src={imgUpload} alt="" style={{ position: 'absolute', bottom: 20, width: 40, height: 40, opacity: 0.5, objectFit: 'cover' }} />
    </div>
  )

  const PREVIEW_QUESTIONS = [
    { text: '배우자 분 성함이 어떻게 되세요?', width: 338 },
    { text: '아드님 이름이 기억나시나요?', width: 309 },
    { text: '이 사진 속에 있는 사람은 누구인가요?', width: 381 },
  ]

  return (
    <div style={{ position: 'relative', width: '100vw', height: CANVAS_H * scale, overflowX: 'hidden', background: '#f8f9fa' }}>
      <div style={{ width: 1920, height: CANVAS_H, position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})`, background: '#f8f9fa' }}>

        {/* ═══ 왼쪽 사이드바 ═══ */}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: SIDEBAR_W, height: CANVAS_H,
          background: '#2073e8',
          borderTopRightRadius: 20,
          filter: 'drop-shadow(0 0 5px #4188ed)',
        }}>
          <p style={{ ...F, position: 'absolute', left: 49, top: 67, margin: 0, fontSize: 30, fontWeight: 400, lineHeight: '1.4', color: '#f8f9fa', whiteSpace: 'nowrap' }}>
            카테고리
          </p>

          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === cat
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                ...F, position: 'absolute', left: 47, top: 135 + i * 89,
                width: 291, height: 59,
                borderRadius: '50px 0 0 50px',
                background: isActive ? '#dfdf87' : '#f8f9fa',
                border: isActive ? 'none' : '2px solid rgba(65,136,237,0.5)',
                filter: isActive ? 'drop-shadow(0 0 4px #2073e8)' : 'none',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <p style={{
                  ...F, position: 'absolute', left: 29, top: 13, margin: 0, fontSize: 22,
                  fontWeight: isActive ? 700 : 400,
                  lineHeight: '1.55', color: isActive ? '#0d0d0d' : '#797980', whiteSpace: 'nowrap',
                }}>{cat}</p>
              </button>
            )
          })}
        </div>

        {/* ═══ 메인 콘텐츠 ═══ */}

        {/* 가족 정보 섹션 타이틀 */}
        <p style={{ ...F, position: 'absolute', left: 636, top: 135, margin: 0, fontSize: 30, fontWeight: 700, lineHeight: '1.4', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
          가족 정보
        </p>

        {/* 첫 번째 멤버 행 (기존 데이터 - 채워진 상태) */}
        <ColLabel left={636} top={203}>관계</ColLabel>
        <ColLabel left={917} top={203}>이름 / 호칭</ColLabel>
        <ColLabel left={1309} top={203}>나이</ColLabel>
        <InputBox left={636} top={251} width={263} placeholder="관계" value={members[0].relation} filled />
        <InputBox left={917} top={251} width={375} placeholder="이름 / 호칭" value={members[0].name} filled />
        <InputBox left={1309} top={251} width={263} placeholder="나이" value={members[0].age} filled />

        {/* 두 번째 멤버 행 (빈 입력) */}
        <ColLabel left={636} top={358}>관계</ColLabel>
        <ColLabel left={917} top={358}>이름 / 호칭</ColLabel>
        <ColLabel left={1309} top={358}>나이</ColLabel>
        <InputBox left={636} top={406} width={263} placeholder="관계" value={members[1].relation} onChange={v => updateMember(1, 'relation', v)} />
        <InputBox left={917} top={406} width={375} placeholder="이름 / 호칭" value={members[1].name} onChange={v => updateMember(1, 'name', v)} />
        <InputBox left={1309} top={406} width={263} placeholder="나이" value={members[1].age} onChange={v => updateMember(1, 'age', v)} />

        {/* 가족 구성원 추가 버튼 */}
        <button onClick={addMember} style={{
          ...F, position: 'absolute', left: 636, top: 517,
          display: 'flex', alignItems: 'center', gap: 10,
          paddingLeft: 19, paddingRight: 19, paddingTop: 6, paddingBottom: 6,
          background: '#f8f9fa', border: '1px solid #8e8e98', borderRadius: 10,
          filter: 'drop-shadow(0 0 2px #797980)', cursor: 'pointer',
        }}>
          <svg width="22" height="23" viewBox="0 0 22 23" fill="none" stroke="#797980" strokeWidth="2" strokeLinecap="round">
            <line x1="11" y1="5" x2="11" y2="18" /><line x1="4" y1="11.5" x2="18" y2="11.5" />
          </svg>
          <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#797980', whiteSpace: 'nowrap' }}>가족 구성원 추가</span>
        </button>

        {/* 사진 업로드 섹션 */}
        <p style={{ ...F, position: 'absolute', left: 636, top: 643, margin: 0, fontSize: 30, fontWeight: 700, lineHeight: '1.4', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
          사진 업로드
        </p>
        <p style={{ ...F, position: 'absolute', left: 636, top: 711, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#797980', whiteSpace: 'nowrap' }}>
          *업로드된 사진은 개인화 회상 활동에 사용됩니다
        </p>

        <PhotoBox left={636} top={771} label="가족 사진 업로드" />
        <PhotoBox left={950} top={771} label="지인 사진 업로드" />
        <PhotoBox left={1264} top={771} label="장소 사진 업로드" />

        {/* 예상 생성 질문 미리보기 */}
        <div style={{
          position: 'absolute', left: 637, top: 965, width: 935, height: 421,
          border: '1px solid #4188ed', borderRadius: 10,
          background: 'rgba(65,136,237,0.05)',
          boxShadow: '0 0 4px #4188ed',
        }}>
          <p style={{ ...F, position: 'absolute', left: 29, top: 24, margin: 0, fontSize: 16, fontWeight: 400, lineHeight: '1.65', color: '#0d0d0d' }}>
            예상 생성 질문 미리보기
          </p>

          {PREVIEW_QUESTIONS.map((q, i) => (
            <div key={i} style={{
              position: 'absolute', left: 29, top: 70 + i * 90, width: q.width, height: 65,
              border: '1px solid #8e8e98',
              borderRadius: '20px 20px 20px 0',
              boxShadow: '0 0 4px #4188ed',
              background: 'linear-gradient(180deg, rgba(32,115,232,0.2) 0%, rgba(223,223,135,0.2) 100%)',
              display: 'flex', alignItems: 'center', paddingLeft: 29, boxSizing: 'border-box',
            }}>
              <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '1.55', color: '#0d0d0d', whiteSpace: 'nowrap' }}>{q.text}</p>
            </div>
          ))}

          {/* TTS 버튼 */}
          <button style={{
            ...F, position: 'absolute', left: 29, top: 340,
            display: 'flex', alignItems: 'center', gap: 9,
            paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6,
            background: '#f8f9fa', border: '1px solid #8e8e98', borderRadius: 10,
            filter: 'drop-shadow(0 0 2px #797980)', cursor: 'pointer',
          }}>
            <img src={imgPolygon} alt="" style={{ width: 22, height: 24, transform: 'rotate(90deg)' }} />
            <span style={{ ...F, fontSize: 22, fontWeight: 400, color: '#797980', whiteSpace: 'nowrap' }}>TTS 음성 읽어주기</span>
          </button>
        </div>

        {/* ─── 네비게이션 ─── */}
        <button onClick={() => navigate(-1)} style={{
          ...F, position: 'absolute', left: 636, top: 1466, height: 59, paddingLeft: 24, paddingRight: 24,
          background: '#0d0d0d', borderRadius: 50, border: 'none',
          filter: 'drop-shadow(0 0 2px #4188ed)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa', whiteSpace: 'nowrap' }}>← 이전</span>
        </button>

        {/* 임시저장 */}
        <button style={{
          ...F, position: 'absolute', left: 1299, top: 1466, height: 59, paddingLeft: 30, paddingRight: 30,
          background: '#f8f9fa', borderRadius: 50, border: 'none',
          filter: 'drop-shadow(0 0 2px #0d0d0d)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#0d0d0d', whiteSpace: 'nowrap' }}>임시저장</span>
        </button>

        {/* 완료 → */}
        <button onClick={() => navigate('/patient-home')} style={{
          ...F, position: 'absolute', left: 1460, top: 1466, height: 59, paddingLeft: 24, paddingRight: 24,
          background: '#4188ed', borderRadius: 50, border: 'none',
          filter: 'drop-shadow(0 0 2px #4188ed)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa', whiteSpace: 'nowrap' }}>완료 →</span>
        </button>
      </div>
    </div>
  )
}
