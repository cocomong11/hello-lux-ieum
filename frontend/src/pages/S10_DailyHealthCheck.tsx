import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import loadingIcon from '../assets/loading.png';

type ButtonStatus = 'READY' | 'LOADING' | 'MISSING' | 'FAIL';

export default function S10_DailyHealthCheck() {
  const navigate = useNavigate();
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>('READY');
  const [condition, setCondition] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [meal, setMeal] = useState<string | null>(null);
  const [pain, setPain] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [cognitiveChanges, setCognitiveChanges] = useState<string[]>([]);
  const [isMemoFocused, setIsMemoFocused] = useState<boolean>(false);
  const [memoText, setMemoText] = useState<string>('');

  const toggleCognitive = (value: string) => {
    if (cognitiveChanges.includes(value)) {
      setCognitiveChanges(cognitiveChanges.filter((item) => item !== value));
    } else {
      setCognitiveChanges([...cognitiveChanges, value]);
    }
  };

  const handleSaveAndNext = () => {
    if (!condition || !sleep || !meal || !pain || !mood) {
      setBtnStatus('MISSING');
      return;
    }
    setBtnStatus('LOADING');
    setTimeout(() => {
      navigate('/patient-voicequiz');
    }, 1500);
  };

  const sectionTitleStyle = {
    fontFamily: "'Pretendard Variable', Pretendard, Inter, sans-serif",
    fontWeight: 700,
    fontSize: '30px',
    lineHeight: '140%',
    color: '#0D0D0D',
    marginBottom: '8px',
    textAlign: 'left' as const,
    width: '100%',
  };

  const baseBoxStyle = {
    backgroundColor: '#F8F9FA',
    border: '1px solid #8E8E98',
    boxShadow: '0px 0px 4px 0px #797980',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box' as const,
    fontSize: '18px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  const blackTextDefaultStyle = {
    ...baseBoxStyle,
    color: '#0D0D0D',
  };

  const grayTextDefaultStyle = {
    ...baseBoxStyle,
    color: '#797980',
  };

  const activeBoxStyle = {
    ...baseBoxStyle,
    backgroundColor: '#0F66E2',
    border: '1px solid #DFDF87',
    boxShadow: '0px 0px 4px 0px #2073E8',
    color: '#FFFFFF',
    fontWeight: 700,
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1920px',
        minHeight: '2059px',
        backgroundColor: '#F8F9FA',
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        margin: '0 auto',
      }}
    >
      <Header />

      {/* 내부 콘텐츠 컨테이너 (648px) */}
      <div
        style={{
          width: '100%',
          maxWidth: '648px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '40px',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* 오늘의 컨디션 */}
        <h2 style={sectionTitleStyle}>오늘의 컨디션</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '56px',
            justifyContent: 'space-between',
          }}
        >
          {['좋음', '보통', '좋지 않음'].map((item) => (
            <div
              key={item}
              style={{
                ...(condition === item
                  ? activeBoxStyle
                  : blackTextDefaultStyle),
                width: '208px',
                height: '155px',
                borderRadius: '10px',
                flexDirection: 'column',
                gap: '8px',
              }}
              onClick={() => setCondition(item)}
            >
              <span style={{ fontSize: '32px' }}>
                {item === '좋음' ? '😃' : item === '보통' ? '😐' : '😔'}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* 수면 상태 */}
        <h2 style={sectionTitleStyle}>수면 상태</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '56px',
          }}
        >
          {['잘 잤음', '보통', '거의 못 잠'].map((item) => (
            <div
              key={item}
              style={{
                ...(sleep === item ? activeBoxStyle : blackTextDefaultStyle),
                flex: 1,
                height: '140px',
                borderRadius: '10px',
                flexDirection: 'column',
                gap: '8px',
              }}
              onClick={() => setSleep(item)}
            >
              <span style={{ fontSize: '32px' }}>
                {item === '잘 잤음' ? '😴' : item === '보통' ? '😐' : '😫'}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* 식사 여부 */}
        <h2 style={sectionTitleStyle}>식사 여부</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '56px',
          }}
        >
          <div
            style={{
              ...(meal === '식사함' ? activeBoxStyle : grayTextDefaultStyle),
              width: '118px',
              height: '42px',
            }}
            onClick={() => setMeal('식사함')}
          >
            식사함
          </div>
          <div
            style={{
              ...(meal === '식사 못 함'
                ? activeBoxStyle
                : grayTextDefaultStyle),
              width: '118px',
              height: '42px',
            }}
            onClick={() => setMeal('식사 못 함')}
          >
            식사 못 함
          </div>
        </div>

        {/* 통증 / 불편감 */}
        <h2 style={sectionTitleStyle}>통증 / 불편감</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '56px',
          }}
        >
          {['없음', '있음'].map((item) => (
            <div
              key={item}
              style={{
                ...(pain === item ? activeBoxStyle : grayTextDefaultStyle),
                width: '118px',
                height: '42px',
              }}
              onClick={() => setPain(item)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 오늘 기분 상태 */}
        <h2 style={sectionTitleStyle}>오늘 기분 상태</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '56px',
            flexWrap: 'wrap',
          }}
        >
          {['안정적', '불안', '우울', '화남', '무기력'].map((item) => (
            <div
              key={item}
              style={{
                ...(mood === item ? activeBoxStyle : grayTextDefaultStyle),
                width: '118px',
                height: '42px',
              }}
              onClick={() => setMood(item)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 오늘 행동 및 인지 변화 */}
        <h2 style={sectionTitleStyle}>오늘 행동 및 인지 변화 (중복 선택 가능)</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            width: '100%',
            marginBottom: '56px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['반복 발화', '망상 또는 불안', '분노/우울 반응'].map((item) => (
              <div
                key={item}
                style={{
                  ...(cognitiveChanges.includes(item)
                    ? activeBoxStyle
                    : grayTextDefaultStyle),
                  padding: '0 20px',
                  height: '42px',
                }}
                onClick={() => toggleCognitive(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['배회 (길을 헤맴)', '기타'].map((item) => (
              <div
                key={item}
                style={{
                  ...(cognitiveChanges.includes(item)
                    ? activeBoxStyle
                    : grayTextDefaultStyle),
                  padding: '0 20px',
                  height: '42px',
                }}
                onClick={() => toggleCognitive(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 보호자 메모 */}
        <h2 style={sectionTitleStyle}>보호자 메모 (선택)</h2>
        <textarea
          placeholder="ex. 보호자가 자유롭게 적어 주세요."
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          onFocus={() => setIsMemoFocused(true)}
          onBlur={() => setIsMemoFocused(false)}
          style={{
            width: '100%',
            height: '140px',
            borderRadius: '10px',
            border: '1px solid #8E8E98',
            backgroundColor: isMemoFocused ? '#4188ED0D' : '#F8F9FA',
            boxShadow: isMemoFocused
              ? '0px 0px 8px 0px #4188ED'
              : '0px 0px 4px 0px #797980',
            padding: '16px',
            boxSizing: 'border-box',
            fontSize: '16px',
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            outline: 'none',
            resize: 'none',
            transition:
              'background-color 300ms ease-out, box-shadow 300ms ease-out',
            marginBottom: '60px',
          }}
        />

        {/* 하단 버튼 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '60px',
            boxSizing: 'border-box',
          }}
        >
          <button
            onClick={() => navigate('/patient-home')}
            style={{
              width: '180px',
              height: '52px',
              borderRadius: '50px',
              backgroundColor: '#0D0D0D',
              border: 'none',
              boxShadow: '0px 0px 4px 0px #4188ED',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ← 홈으로 돌아가기
          </button>

          {btnStatus === 'READY' && (
            <button
              onClick={handleSaveAndNext}
              style={{
                width: '180px',
                height: '52px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              저장 후 활동 시작 →
            </button>
          )}
          {btnStatus === 'LOADING' && (
            <button
              disabled
              style={{
                width: '142px',
                height: '52px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              저장 중{' '}
              <img
                src={loadingIcon}
                alt="로딩 아이콘"
                style={{ width: '23px', height: '23px' }}
              />
            </button>
          )}
          {btnStatus === 'MISSING' && (
            <button
              onClick={handleSaveAndNext}
              style={{
                width: '126px', 
                height: '52px',
                borderRadius: '50px',
                backgroundColor: '#DFDF87',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED', 
                color: '#0D0D0D',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              입력 누락
            </button>
          )}
          {btnStatus === 'FAIL' && (
            <button
              onClick={handleSaveAndNext}
              style={{
                width: '126px', 
                height: '52px',
                borderRadius: '50px',
                backgroundColor: '#E53134', 
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED', 
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              저장 실패
            </button>
          )}
        </div>
      </div>
    </div>
  );
}