import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CANVAS_H = 1542
const F: React.CSSProperties = { fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }

export default function S06_VoiceSetting() {
  const navigate = useNavigate()
  const [scale, setScale] = useState(1)
  const [formal, setFormal] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)
  const [repeat, setRepeat] = useState(true)
  const [lowStress, setLowStress] = useState(false)
  const [positiveFeedback, setPositiveFeedback] = useState(true)
  const [speed, setSpeed] = useState<'느리게' | '보통' | '빠르게'>('느리게')
  const [sentenceLen, setSentenceLen] = useState<'짧음 (권장)' | '보통' | '길음'>('짧음 (권장)')

  useEffect(() => {
    const update = () => setScale(window.innerWidth / 1920)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const SectionTitle = ({ top, children }: { top: number; children: string }) => (
    <p style={{ ...F, position: 'absolute', left: 636, top, margin: 0, fontSize: 30, fontWeight: 700, lineHeight: '1.4', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
      {children}
    </p>
  )

  const Toggle = ({ x, y, value, onChange }: { x: number; y: number; value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{
      position: 'absolute', left: x, top: y, width: 78, height: 41, borderRadius: 100, cursor: 'pointer',
      background: value
        ? 'linear-gradient(180deg, rgba(32,115,232,0.8) 0%, rgba(65,136,237,0.8) 100%)'
        : '#f8f9fa',
      border: value ? 'none' : '1px solid #8e8e98',
      transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', width: 34, height: 34, borderRadius: '50%',
        background: 'white', top: '50%', transform: 'translateY(-50%)',
        left: value ? 40 : 4,
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </div>
  )

  const ToggleRow = ({ x, y, value, onChange, label }: { x: number; y: number; value: boolean; onChange: () => void; label: string }) => (
    <>
      <Toggle x={x} y={y} value={value} onChange={onChange} />
      <p style={{ ...F, position: 'absolute', left: x + 92, top: y + 3, margin: 0, fontSize: 22, fontWeight: 400, lineHeight: '1.55', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
        {label}
      </p>
    </>
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

  return (
    <div style={{ position: 'relative', width: '100vw', height: CANVAS_H * scale, overflowX: 'hidden', background: '#f8f9fa' }}>
      <div style={{ width: 1920, height: CANVAS_H, position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})`, background: '#f8f9fa' }}>

        {/* ─── 말투 설정 ─── */}
        <SectionTitle top={135}>말투 설정</SectionTitle>
        <ToggleRow x={633} y={203} value={formal} onChange={() => setFormal(v => !v)} label="존댓말 사용 (권장)" />
        <ToggleRow x={633} y={261} value={autoPlay} onChange={() => setAutoPlay(v => !v)} label="TTS 음성 자동 재생" />

        {/* ─── TTS 음성 속도 ─── */}
        <SectionTitle top={382}>TTS 음성 속도</SectionTitle>
        <ChipBtn left={636} top={450} label="느리게" selected={speed === '느리게'} onClick={() => setSpeed('느리게')} />
        <ChipBtn left={748} top={450} label="보통" selected={speed === '보통'} onClick={() => setSpeed('보통')} />
        <ChipBtn left={840} top={450} label="빠르게" selected={speed === '빠르게'} onClick={() => setSpeed('빠르게')} />

        {/* ─── 문장 길이 ─── */}
        <SectionTitle top={576}>문장 길이</SectionTitle>
        <ChipBtn left={636} top={644} label="짧음 (권장)" selected={sentenceLen === '짧음 (권장)'} onClick={() => setSentenceLen('짧음 (권장)')} />
        <ChipBtn left={787} top={644} label="보통" selected={sentenceLen === '보통'} onClick={() => setSentenceLen('보통')} />
        <ChipBtn left={879} top={644} label="길음" selected={sentenceLen === '길음'} onClick={() => setSentenceLen('길음')} />

        {/* ─── 반복 안내 및 피드백 ─── */}
        <SectionTitle top={770}>반복 안내 및 피드백</SectionTitle>
        <ToggleRow x={633} y={838} value={repeat} onChange={() => setRepeat(v => !v)} label="반복 안내 자동 제공" />
        <ToggleRow x={633} y={896} value={lowStress} onChange={() => setLowStress(v => !v)} label="압박감 민감도 낮춤 (실패 표현 최소화)" />
        <ToggleRow x={633} y={954} value={positiveFeedback} onChange={() => setPositiveFeedback(v => !v)} label="긍정 피드백 강화" />

        {/* ─── 예시 문장 미리보기 ─── */}
        <div style={{
          position: 'absolute', left: 637, top: 1027, width: 648, height: 241,
          border: '1px solid #4188ed', borderRadius: 10,
          background: 'rgba(65,136,237,0.05)',
          boxShadow: '0 0 4px #4188ed',
        }}>
          <p style={{ ...F, position: 'absolute', left: 29, top: 24, margin: 0, fontSize: 16, fontWeight: 400, lineHeight: '1.65', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
            예시 문장 미리보기
          </p>
          {/* 말풍선 */}
          <div style={{
            position: 'absolute', left: 29, top: 70, width: 463, height: 65,
            border: '1px solid #8e8e98',
            borderRadius: '20px 20px 20px 0',
            boxShadow: '0 0 4px #4188ed',
            background: 'linear-gradient(180deg, rgba(32,115,232,0.2) 0%, rgba(223,223,135,0.2) 100%)',
            display: 'flex', alignItems: 'center', paddingLeft: 29, boxSizing: 'border-box',
          }}>
            <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '1.55', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
              오늘도 잘 오셨어요. 천천히 함께 시작해볼까요?
            </p>
          </div>
          {/* TTS 버튼 */}
          <button style={{
            ...F, position: 'absolute', left: 29, top: 160,
            display: 'flex', alignItems: 'center', gap: 9,
            paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6,
            background: '#f8f9fa', border: '1px solid #8e8e98', borderRadius: 10,
            filter: 'drop-shadow(0 0 2px #797980)', cursor: 'pointer',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#797980"><polygon points="5,3 19,12 5,21" /></svg>
            <span style={{ ...F, fontSize: 22, fontWeight: 400, color: '#797980', whiteSpace: 'nowrap' }}>TTS 음성 읽어주기</span>
          </button>
        </div>

        {/* ─── 네비게이션 ─── */}
        <button onClick={() => navigate(-1)} style={{
          ...F, position: 'absolute', left: 636, top: 1348, height: 59, paddingLeft: 24, paddingRight: 24,
          background: '#0d0d0d', borderRadius: 50, border: 'none',
          filter: 'drop-shadow(0 0 2px #4188ed)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa', whiteSpace: 'nowrap' }}>← 이전</span>
        </button>

        <button onClick={() => navigate('/memory-db')} style={{
          ...F, position: 'absolute', left: 1173, top: 1348, height: 59, paddingLeft: 24, paddingRight: 24,
          background: '#4188ed', borderRadius: 50, border: 'none',
          filter: 'drop-shadow(0 0 2px #4188ed)', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa', whiteSpace: 'nowrap' }}>다음 →</span>
        </button>
      </div>
    </div>
  )
}
