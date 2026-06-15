import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CANVAS_H = 1718
const F: React.CSSProperties = { fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }

export default function S05_PatientInfo() {
  const navigate = useNavigate()
  const [scale, setScale] = useState(1)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState<'남성' | '여성' | '선택 안 함'>('남성')
  const [diagnosis, setDiagnosis] = useState('')
  const [level, setLevel] = useState<'낮음' | '보통' | '높음'>('낮음')
  const [companion, setCompanion] = useState<'동행' | '혼자'>('동행')

  useEffect(() => {
    const update = () => setScale(window.innerWidth / 1920)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const SectionTitle = ({ left = 636, top, children }: { left?: number; top: number; children: string }) => (
    <p style={{ ...F, position: 'absolute', left, top, margin: 0, fontSize: 30, fontWeight: 700, lineHeight: '1.4', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
      {children}
    </p>
  )

  const Label = ({ left, top, children }: { left: number; top: number; children: string }) => (
    <p style={{ ...F, position: 'absolute', left, top, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
      {children}
    </p>
  )

  const TextInput = ({ left, top, width, placeholder, value, onChange, filled = false }: {
    left: number; top: number; width: number; placeholder: string; value: string; onChange: (v: string) => void; filled?: boolean
  }) => (
    <div style={{
      position: 'absolute', left, top, width, height: 81,
      border: '1px solid #8e8e98', borderRadius: 10,
      background: filled ? 'rgba(65,136,237,0.05)' : '#f8f9fa',
      boxShadow: '0 0 4px rgba(65,136,237,0.35)',
      display: 'flex', alignItems: 'center',
      paddingLeft: 29, paddingRight: 29, boxSizing: 'border-box',
    }}>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...F, flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: value ? '#0d0d0d' : '#797980' }}
      />
    </div>
  )

  const ChipBtn = ({ left, top, label, selected, onClick }: { left: number; top: number; label: string; selected: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      ...F, position: 'absolute', left, top,
      paddingLeft: 19, paddingRight: 19, paddingTop: 6, paddingBottom: 6,
      border: selected ? '1px solid #dfdf87' : '1px solid #8e8e98',
      borderRadius: 10,
      background: selected ? '#0f66e2' : '#f8f9fa',
      filter: selected ? 'drop-shadow(0 0 2px #4188ed)' : 'drop-shadow(0 0 2px #797980)',
      cursor: 'pointer', fontSize: 22, fontWeight: selected ? 700 : 400,
      lineHeight: '1.55', color: selected ? '#f8f9fa' : '#797980', whiteSpace: 'nowrap',
    }}>{label}</button>
  )

  const LevelCard = ({ top, value, description }: { top: number; value: '낮음' | '보통' | '높음'; description: string }) => {
    const selected = level === value
    return (
      <button onClick={() => setLevel(value)} style={{
        position: 'absolute', left: 636, top, width: 648, height: 107,
        border: selected ? '1px solid #dfdf87' : '1px solid #8e8e98',
        borderRadius: 10,
        background: selected ? '#0f66e2' : '#f8f9fa',
        filter: selected ? 'drop-shadow(0 0 2px #2073e8)' : 'drop-shadow(0 0 2px #797980)',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <p style={{ ...F, position: 'absolute', left: 29, top: 20, margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '1.55', color: selected ? '#f8f9fa' : '#0d0d0d' }}>{value}</p>
        <p style={{ ...F, position: 'absolute', left: 29, top: 54, right: 20, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: selected ? 'rgba(248,249,250,0.8)' : '#797980' }}>{description}</p>
      </button>
    )
  }

  const NavBtn = ({ left, label, onClick, dark = false }: { left: number; label: string; onClick: () => void; dark?: boolean }) => (
    <button onClick={onClick} style={{
      ...F, position: 'absolute', left, top: 1524, height: 59,
      paddingLeft: 24, paddingRight: 24,
      background: dark ? '#0d0d0d' : '#4188ed',
      borderRadius: 50, border: 'none',
      filter: 'drop-shadow(0 0 2px #4188ed)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  )

  return (
    <div style={{ position: 'relative', width: '100vw', height: CANVAS_H * scale, overflowX: 'hidden', background: '#f8f9fa' }}>
      <div style={{ width: 1920, height: CANVAS_H, position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})`, background: '#f8f9fa' }}>

        {/* ─── 환자 기본 정보 ─── */}
        <SectionTitle top={135}>환자 기본 정보</SectionTitle>

        {/* 이름 */}
        <Label left={636} top={203}>이름 (실명)</Label>
        <div style={{ position: 'absolute', left: 738, top: 210, width: 10, height: 10, borderRadius: '50%', background: '#4188ed' }} />
        <TextInput left={636} top={251} width={648} placeholder="이름 (실명)" value={name} onChange={setName} />

        {/* 생년월일 / 나이 */}
        <Label left={636} top={346}>생년월일</Label>
        <div style={{ position: 'absolute', left: 718, top: 353, width: 10, height: 10, borderRadius: '50%', background: '#4188ed' }} />
        <Label left={1061} top={346}>나이 (자동)</Label>
        <TextInput left={636} top={394} width={409} placeholder="생년월일 (8자리)" value={birthdate} onChange={setBirthdate} />
        <TextInput left={1061} top={394} width={223} placeholder="나이 (자동)" value="" onChange={() => {}} />

        {/* 성별 */}
        <Label left={636} top={489}>성별</Label>
        <ChipBtn left={636} top={537} label="남성" selected={gender === '남성'} onClick={() => setGender('남성')} />
        <ChipBtn left={729} top={537} label="여성" selected={gender === '여성'} onClick={() => setGender('여성')} />
        <ChipBtn left={822} top={537} label="선택 안 함" selected={gender === '선택 안 함'} onClick={() => setGender('선택 안 함')} />

        {/* 주요 진단 상태 */}
        <Label left={636} top={600}>주요 진단 상태</Label>
        <TextInput left={636} top={648} width={648} placeholder="ex. 경도인지장애, 초기 치매 등" value={diagnosis} onChange={setDiagnosis} />

        {/* ─── 인지 지원 수준 ─── */}
        <SectionTitle top={809}>인지 지원 수준</SectionTitle>
        <div style={{ position: 'absolute', left: 821, top: 814, width: 10, height: 10, borderRadius: '50%', background: '#4188ed' }} />
        <LevelCard top={877} value="낮음" description="간단한 안내만 있어도 활동을 수행할 수 있어요" />
        <LevelCard top={1010} value="보통" description="힌트와 반복 안내가 있으면 더 편하게 수행할 수 있어요" />
        <LevelCard top={1143} value="높음" description="짧은 문장, 충분한 음성 안내, 단계별 힌트가 필요해요" />

        {/* ─── 보호자 동행 여부 ─── */}
        <SectionTitle top={1330}>보호자 동행 여부</SectionTitle>
        <ChipBtn left={636} top={1398} label="활동 시 보호자 동행" selected={companion === '동행'} onClick={() => setCompanion('동행')} />
        <ChipBtn left={900} top={1398} label="혼자 수행" selected={companion === '혼자'} onClick={() => setCompanion('혼자')} />

        {/* ─── 네비게이션 ─── */}
        <NavBtn left={636} label="← 이전" onClick={() => navigate(-1)} dark />
        <NavBtn left={1172} label="다음 →" onClick={() => navigate('/voice-setting')} />
      </div>
    </div>
  )
}
