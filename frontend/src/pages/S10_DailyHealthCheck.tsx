import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import loadingIcon from '../assets/loading.png';
type ButtonStatus = 'READY' | 'LOADING' | 'MISSING' | 'FAIL';
export default function S10_DailyHealthCheck() {
  const navigate = useNavigate();
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>('READY');
  const [condition, setCondition] = useState<string|null>(null);
  const [sleep, setSleep] = useState<string|null>(null);
  const [meal, setMeal] = useState<string|null>(null);
  const [pain, setPain] = useState<string|null>(null);
  const [mood, setMood] = useState<string|null>(null);
  const [cognitiveChanges, setCognitiveChanges] = useState<string[]>([]);
  const [isMemoFocused, setIsMemoFocused] = useState<boolean>(false);
  const [memoText, setMemoText] = useState<string>('');

  const toggleCognitive = (value: string) => {
    if (cognitiveChanges.includes(value)) {
      setCognitiveChanges(cognitiveChanges.filter(item => item !== value));
    } else {
      setCognitiveChanges([...cognitiveChanges, value]);
    }
  };
  const handleSaveAndNext = () => {
    if (!condition || !sleep || !meal || !pain || !mood) {
      setBtnStatus('MISSING'); //입력 누락
      return;
    }
    setBtnStatus('LOADING');
    setTimeout(() => {
      //  현재는 정상 이동 처리! 
      navigate('/patient-voicequiz');
      // setBtnStatus('FAIL'); // 저장 실패
    }, 1500);
  };

  const sectionTitleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '22px', 
    lineHeight: '140%',
    color: '#0D0D0D',
    margin: '0 0 16px 0',
    textAlign: 'left' as const,
    width: '100%'
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
    fontSize: '15px', 
    fontWeight: 500,
    transition: 'all 0.2s ease'
  };

  const blackTextDefaultStyle = {
    ...baseBoxStyle,
    color: '#0D0D0D'
  };

  const grayTextDefaultStyle = {
    ...baseBoxStyle,
    color: '#797980'
  };

  const activeBoxStyle = {
    ...baseBoxStyle,
    backgroundColor: '#0F66E2',
    border: '1px solid #DFDF87',
    boxShadow: '0px 0px 4px 0px #2073E8',
    color: '#FFFFFF',
    fontWeight: 700
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF', 
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      paddingBottom: '120px'
    }}>
      
      <Header/>

      
      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* 오늘의 컨디션 */}
        <h2 style={sectionTitleStyle}>오늘의 컨디션</h2>
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginBottom: '36px' }}>
          {['좋음', '보통', '좋지 않음'].map((item) => (
            <div 
              key={item}
              style={{ ...(condition === item ? activeBoxStyle : blackTextDefaultStyle), width: '208px', height: '140px', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}
              onClick={() => setCondition(item)}
            >
              <span style={{ fontSize: '28px' }}>{item === '좋음' ? '😃' : item === '보통' ? '😐' : '😔'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* 수면 상태 */}
        <h2 style={sectionTitleStyle}>수면 상태</h2>
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginBottom: '36px' }}>
          {['잘 잤음', '보통', '거의 못 잠'].map((item) => (
            <div 
              key={item}
              style={{ ...(sleep === item ? activeBoxStyle : blackTextDefaultStyle), width: '208px', height: '140px', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}
              onClick={() => setSleep(item)}
            >
              <span style={{ fontSize: '28px' }}>{item === '잘 잤음' ? '😴' : item === '보통' ? '😐' : '😫'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* 식사 여부 */}
        <h2 style={sectionTitleStyle}>식사 여부</h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '36px' }}>
          <div style={{ ...(meal === '식사함' ? activeBoxStyle : grayTextDefaultStyle), width: '96px', height: '42px', justifyContent: 'center' }} onClick={() => setMeal('식사함')}>식사함</div>
          <div style={{ ...(meal === '식사 못 함' ? activeBoxStyle : grayTextDefaultStyle), width: '126px', height: '42px', justifyContent: 'center' }} onClick={() => setMeal('식사 못 함')}>식사 못 함</div>
        </div>

        {/* 통증 / 불편감 */}
        <h2 style={sectionTitleStyle}>통증 / 불편감</h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '36px' }}>
          {['없음', '있음'].map((item) => (
            <div key={item} style={{ ...(pain === item ? activeBoxStyle : grayTextDefaultStyle), width: '77px', height: '42px', justifyContent: 'center' }} onClick={() => setPain(item)}>{item}</div>
          ))}
        </div>

        {/* 오늘 기분 상태 */}
        <h2 style={sectionTitleStyle}>오늘 기분 상태</h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '36px', flexWrap: 'wrap' }}>
          {[
            { name: '안정적', w: '96px' }, { name: '불안', w: '77px' }, { name: '우울', w: '77px' }, { name: '화남', w: '77px' }, { name: '무기력', w: '96px' }
          ].map((item) => (
            <div key={item.name} style={{ ...(mood === item.name ? activeBoxStyle : grayTextDefaultStyle), width: item.w, height: '42px', justifyContent: 'center' }} onClick={() => setMood(item.name)}>{item.name}</div>
          ))}
        </div>

        {/* 오늘 행동 및 인지 변화 */}
        <h2 style={sectionTitleStyle}>오늘 행동 및 인지 변화 (중복 선택 가능)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', marginBottom: '36px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...(cognitiveChanges.includes('반복 발화') ? activeBoxStyle : grayTextDefaultStyle), width: '120px', height: '42px', justifyContent: 'center' }} onClick={() => toggleCognitive('반복 발화')}>반복 발화</div>
            <div style={{ ...(cognitiveChanges.includes('망상 또는 불안') ? activeBoxStyle : grayTextDefaultStyle), width: '164px', height: '42px', justifyContent: 'center' }} onClick={() => toggleCognitive('망상 또는 불안')}>망상 또는 불안</div>
            <div style={{ ...(cognitiveChanges.includes('분노/우울 반응') ? activeBoxStyle : grayTextDefaultStyle), width: '165px', height: '42px', justifyContent: 'center' }} onClick={() => toggleCognitive('분노/우울 반응')}>분노/우울 반응</div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...(cognitiveChanges.includes('배회 (길을 헤맴)') ? activeBoxStyle : grayTextDefaultStyle), width: '179px', height: '42px', justifyContent: 'center' }} onClick={() => toggleCognitive('배회 (길을 헤맴)')}>배회 (길을 헤맴)</div>
            <div style={{ ...(cognitiveChanges.includes('기타') ? activeBoxStyle : grayTextDefaultStyle), width: '77px', height: '42px', justifyContent: 'center' }} onClick={() => toggleCognitive('기타')}>기타</div>
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
            width: '648px', height: '120px', borderRadius: '10px', border: '1px solid #8E8E98',
            backgroundColor: isMemoFocused ? '#4188ED0D' : '#F8F9FA',
            boxShadow: isMemoFocused ? '0px 0px 8px 0px #4188ED' : '0px 0px 4px 0px #797980',
            padding: '16px', boxSizing: 'border-box', fontSize: '15px', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'none',
            transition: 'background-color 300ms ease-out, box-shadow 300ms ease-out'
          }}
        />

        {/* 하단 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '50px' }}>
          <button 
            onClick={() => navigate('/patient-home')} 
            style={{ width: '180px', height: '52px', borderRadius: '50px', backgroundColor: '#0D0D0D', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', color: '#FFFFFF', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ← 홈으로 돌아가기
          </button>
          {btnStatus === 'READY'&&(
          <button 
            onClick={handleSaveAndNext} 
            style={{ width: '180px', height: '52px', borderRadius: '50px', backgroundColor: '#4188ED', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', color: '#FFFFFF', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            저장 후 활동 시작 →
          </button>
          )}
          {btnStatus === 'LOADING'&&(
          <button 
            disabled
            style={{ width: '142px', height: '52px', borderRadius: '50px', backgroundColor: '#4188ED', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', color: '#FFFFFF', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
          >
            저장 중 <img src={loadingIcon}  
                    alt="로딩 아이콘" 
                    style={{ width: '23px', height: '23px' }}/>

          </button>
          )}
          {btnStatus === 'MISSING'&&(
          <button 
            onClick={handleSaveAndNext} 
            style={{ width: '126px', height: '52px', borderRadius: '50px', backgroundColor: '#DFDF87', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', color: '#0D0D0D', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            입력 누락
          </button>
          )}
          {btnStatus === 'FAIL'&&(
          <button 
            onClick={handleSaveAndNext} 
            style={{ width: '126px', height: '52px', borderRadius: '50px', backgroundColor: '#E53134', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', color: '#FFFFFF', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            저장 실패
          </button>
          )}
        </div>

      </div>
    </div>
  );
}