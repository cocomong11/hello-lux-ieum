import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HintPopup from '../pages/S16_HintPopup';  
import Header from '../components/patientHeader';
import QuizVoiceController from '../components/quizButton'; 
export default function S11_TextVoiceQuiz() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  const handleHintClick = () => {
    setIsHintOpen(true);
    if (hintCount === 0) {
      setHintCount(1);
    }
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh', backgroundColor: '#FFFFFF',
      fontFamily: 'Pretendard Variable, Inter, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxSizing: 'border-box', paddingBottom: '120px', position: 'relative'
    }}>
      
      <Header/>

      {/* 메인 콘텐츠 영역 */}
      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* 상단 뱃지 */}
        <div style={{
          width: '184px', height: '42px', borderRadius: '50px', backgroundColor: '#4188ED',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px',
          boxSizing: 'border-box', gap: '10px', marginBottom: '26px'
        }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#F8F9FA' }}>주관식 음성 퀴즈</span>
        </div>

        {/* 퀴즈 질문 타이틀 */}
        <h1 style={{
          width: '458px', height: '42px', fontFamily: 'Inter', fontWeight: 700, fontSize: '30px',
          lineHeight: '140%', color: '#0D0D0D', margin: '0 0 26px 0'
        }}>
          오늘이 몇 월 며칠인지 말씀해 주세요.
        </h1>
        <button 
        onClick={() => setIsListening(!isListening)}
        style={{
          width: '154px', height: '46px', borderRadius: '10px', boxSizing: 'border-box',
          padding: '6px 19px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
          backgroundColor: isListening ? '#0F66E2' : '#4188ED0D',
          border: isListening ? '1px solid #DFDF87' : '1px solid #0F66E2',
          boxShadow: '0px 0px 4px 0px #4188ED'
        }}
      >
        <span style={{
          fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '20px',
          lineHeight: '155%', textAlign: 'center', color: isListening ? '#FFFFFF' : '#0F66E2'
        }}>
          {isListening ? '↻ 다시 듣기' : '▶ 문제 듣기'}
        </span>
      </button>

        <QuizVoiceController 
          onHintClick={handleHintClick}
          hintCount={hintCount}
          placeholder="“오월 이십육일이요.”"
          onSuccessSubmit={(finalDuration) => console.log('소요시간:', finalDuration)}
        />

        {/* 하단 액션 버튼 그룹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px' }}>
          <button
            onClick={() => {}}
            style={{
              width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
              border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
            }}
          >
            그만하기
          </button>

          <button
            onClick={() => navigate('/patient-photo')}
            style={{
              width: '151px', height: '59px', borderRadius: '50px', backgroundColor: '#4188ED',
              border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
            }}
          >
            다음 활동 →
          </button>
        </div>

      </div>

      {/* 힌트 팝업 */}
      {isHintOpen && (
        <HintPopup 
          onClose={() => setIsHintOpen(false)}             
          onStepChange={(maxStep) => setHintCount(maxStep)} 
        />
      )}

    </div>
  );
}