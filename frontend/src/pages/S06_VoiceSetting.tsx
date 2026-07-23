import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';

const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

export default function S06_VoiceSetting() {
  const navigate = useNavigate();
  const [formal, setFormal] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [repeat, setRepeat] = useState(true);
  const [lowStress, setLowStress] = useState(false);
  const [positiveFeedback, setPositiveFeedback] = useState(true);
  const [speed, setSpeed] = useState<'느리게' | '보통' | '빠르게'>('느리게');
  const [sentenceLen, setSentenceLen] = useState<
    '짧음 (권장)' | '보통' | '길음'
  >('짧음 (권장)');

  const SectionTitle = ({ children }: { children: string }) => (
    <p
      style={{
        ...F,
        margin: '0 0 24px 0',
        fontSize: 30,
        fontWeight: 700,
        lineHeight: '1.4',
        color: '#0d0d0d',
      }}
    >
      {children}
    </p>
  );

  const ToggleRow = ({
    value,
    onChange,
    label,
  }: {
    value: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
      }}
    >
      <div
        onClick={onChange}
        style={{
          position: 'relative',
          width: 78,
          height: 41,
          borderRadius: 100,
          cursor: 'pointer',
          background: value
            ? 'linear-gradient(180deg, rgba(32,115,232,0.8) 0%, rgba(65,136,237,0.8) 100%)'
            : '#f8f9fa',
          border: value ? 'none' : '1px solid #8e8e98',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 34,
            height: 34,
            borderRadius: '50%',
            // 👇 켜졌을 때는 요청하신 #DFDF87, 꺼졌을 때는 연한 회색으로 변해요!
            background: value ? '#DFDF87' : '#c6c6cc',
            top: '50%',
            transform: 'translateY(-50%)',
            left: value ? 40 : 4,
            // 👇 움직임뿐만 아니라 색상도 부드럽게 변하도록 애니메이션을 추가했어요!
            transition: 'left 0.2s, background 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          }}
        />
      </div>
      <p
        style={{
          ...F,
          margin: 0,
          fontSize: 22,
          fontWeight: 400,
          lineHeight: '1.55',
          color: '#0d0d0d',
        }}
      >
        {label}
      </p>
    </div>
  );

  const ChipBtn = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        ...F,
        padding: '6px 19px',
        border: selected ? '1px solid #dfdf87' : '1px solid #8e8e98',
        borderRadius: 10,
        background: selected ? '#0f66e2' : '#f8f9fa',
        filter: selected
          ? 'drop-shadow(0 0 2px #4188ed)'
          : 'drop-shadow(0 0 2px #797980)',
        cursor: 'pointer',
        fontSize: 22,
        fontWeight: selected ? 700 : 400,
        lineHeight: '1.55',
        color: selected ? '#f8f9fa' : '#797980',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );

  return (
    <PageLayout scrollable>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
        }}
      >
        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
            gap: 60,
          }}
        >
          {/* 1. 말투 설정 */}
          <div>
            <SectionTitle>말투 설정</SectionTitle>
            <ToggleRow
              value={formal}
              onChange={() => setFormal((v) => !v)}
              label='존댓말 사용 (권장)'
            />
            <ToggleRow
              value={autoPlay}
              onChange={() => setAutoPlay((v) => !v)}
              label='TTS 음성 자동 재생'
            />
          </div>

          {/* 2. TTS 음성 속도 */}
          <div>
            <SectionTitle>TTS 음성 속도</SectionTitle>
            <div style={{ display: 'flex', gap: 12 }}>
              <ChipBtn
                label='느리게'
                selected={speed === '느리게'}
                onClick={() => setSpeed('느리게')}
              />
              <ChipBtn
                label='보통'
                selected={speed === '보통'}
                onClick={() => setSpeed('보통')}
              />
              <ChipBtn
                label='빠르게'
                selected={speed === '빠르게'}
                onClick={() => setSpeed('빠르게')}
              />
            </div>
          </div>

          {/* 3. 문장 길이 */}
          <div>
            <SectionTitle>문장 길이</SectionTitle>
            <div style={{ display: 'flex', gap: 12 }}>
              <ChipBtn
                label='짧음 (권장)'
                selected={sentenceLen === '짧음 (권장)'}
                onClick={() => setSentenceLen('짧음 (권장)')}
              />
              <ChipBtn
                label='보통'
                selected={sentenceLen === '보통'}
                onClick={() => setSentenceLen('보통')}
              />
              <ChipBtn
                label='길음'
                selected={sentenceLen === '길음'}
                onClick={() => setSentenceLen('길음')}
              />
            </div>
          </div>

          {/* 4. 반복 안내 및 피드백 */}
          <div>
            <SectionTitle>반복 안내 및 피드백</SectionTitle>
            <ToggleRow
              value={repeat}
              onChange={() => setRepeat((v) => !v)}
              label='반복 안내 자동 제공'
            />
            <ToggleRow
              value={lowStress}
              onChange={() => setLowStress((v) => !v)}
              label='압박감 민감도 낮춤 (실패 표현 최소화)'
            />
            <ToggleRow
              value={positiveFeedback}
              onChange={() => setPositiveFeedback((v) => !v)}
              label='긍정 피드백 강화'
            />
          </div>

          {/* 5. 예시 문장 미리보기 */}
          <div
            style={{
              width: '100%',
              padding: '24px 29px',
              border: '1px solid #4188ed',
              borderRadius: 10,
              background: 'rgba(65,136,237,0.05)',
              boxShadow: '0 0 4px #4188ed',
              boxSizing: 'border-box',
            }}
          >
            <p
              style={{
                ...F,
                margin: '0 0 20px 0',
                fontSize: 16,
                fontWeight: 400,
                lineHeight: '1.65',
                color: '#0d0d0d',
              }}
            >
              예시 문장 미리보기
            </p>
            <div
              style={{
                width: 'fit-content',
                padding: '0 29px',
                height: 65,
                border: '1px solid #8e8e98',
                borderRadius: '20px 20px 20px 0',
                boxShadow: '0 0 4px #4188ed',
                background:
                  'linear-gradient(180deg, rgba(32,115,232,0.2) 0%, rgba(223,223,135,0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  ...F,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#0d0d0d',
                }}
              >
                오늘도 잘 오셨어요. 천천히 함께 시작해볼까요?
              </p>
            </div>
            <button
              style={{
                ...F,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '6px 14px',
                background: '#f8f9fa',
                border: '1px solid #8e8e98',
                borderRadius: 10,
                filter: 'drop-shadow(0 0 2px #797980)',
                cursor: 'pointer',
              }}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='#797980'>
                <polygon points='5,3 19,12 5,21' />
              </svg>
              <span style={{ fontSize: 22, fontWeight: 400, color: '#797980' }}>
                TTS 음성 읽어주기
              </span>
            </button>
          </div>

          {/* 네비게이션 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 40,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                ...F,
                height: 59,
                padding: '0 24px',
                background: '#0d0d0d',
                borderRadius: 50,
                border: 'none',
                filter: 'drop-shadow(0 0 2px #4188ed)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa' }}>
                ← 이전
              </span>
            </button>
            <button
              onClick={() => navigate('/memory-db')}
              style={{
                ...F,
                height: 59,
                padding: '0 24px',
                background: '#4188ed',
                borderRadius: 50,
                border: 'none',
                filter: 'drop-shadow(0 0 2px #4188ed)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa' }}>
                다음 →
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
