import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import HintPopup from '../pages/S16_HintPopup';
import QuizVoiceController from '../components/quizButton'; 

export default function S12_PhotoRecallQuiz() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  // 힌트 사용 클릭 핸들러 
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
      boxSizing: 'border-box', paddingBottom: '120px'
    }}>
      
      <Header/>

      {/* 메인 중앙 콘텐츠 영역 */}
      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* 상단 뱃지 */}
        <div style={{
          width: '208px', height: '42px', borderRadius: '50px', backgroundColor: '#4188ED',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px',
          boxSizing: 'border-box', gap: '10px', marginBottom: '26px'
        }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#F8F9FA' }}>사진 기반 회상 퀴즈</span>
        </div>

        {/* 퀴즈 타이틀 텍스트 */}
        <h1 style={{
          width: '100%', height: '42px', fontFamily: 'Inter, sans-serif', fontWeight: 700,
          fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 9px 0', textAlign: 'left' 
        }}>
          사진 속 인물은 누구인가요?
        </h1>

        {/* 서브 설명 문구 */}
        <p style={{
          width: '100%', height: '34px', fontFamily: 'Pretendard Variable, sans-serif', fontWeight: 400,
          fontSize: '22px', lineHeight: '155%', color: '#797980', margin: '0 0 26px 0', textAlign: 'left'
        }}>
          사진을 잘 보시고, 생각나시는 대로 말씀해 주세요.
        </p>
         <button 
        onClick={() => setIsListening(!isListening)}
        style={{
          width: '154px', height: '46px', borderRadius: '10px', boxSizing: 'border-box',
          padding: '6px 19px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
          backgroundColor: isListening ? '#0F66E2' : '#4188ED0D',
          border: isListening ? '1px solid #DFDF87' : '1px solid #0F66E2',
          boxShadow: '0px 0px 4px 0px #4188ED'
          ,marginBottom: '26px'
        }}
      >
        <span style={{
          fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '20px',
          lineHeight: '155%', textAlign: 'center', color: isListening ? '#FFFFFF' : '#0F66E2'
        }}>
          {isListening ? '↻ 다시 듣기' : '▶ 문제 듣기'}
        </span>
      </button>


        {/* 🖼️ 고유 영역: 가족/지인 사진 박스 */}
        <div style={{
          width: '648px', height: '317px', borderRadius: '10px', border: '1px solid #8E8E98',
          backgroundColor: '#D9D9D9', boxShadow: '0px 0px 4px 0px #4188ED',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{
            width: '142px', height: '34px', fontFamily: 'Pretendard Variable', fontWeight: 400,
            fontSize: '18px', lineHeight: '155%', color: '#797980', textAlign: 'center'
          }}>
            (가족/지인 사진)
          </span>
        </div>

        
        <QuizVoiceController 
          onHintClick={handleHintClick}
          hintCount={hintCount}
          placeholder="“우리 아들 민수”"
          onSuccessSubmit={(finalDuration) => console.log('12페이지 소요시간:', finalDuration)}
        />

        {/* 글로벌 내비게이션 하단 제어 버블 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px' }}>
          <button style={{
            width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
            border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
            fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
          }}>
            그만하기
          </button>

          <button 
            onClick={() => navigate('/patient-voicechat')}
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
       {isHintOpen && (
              <HintPopup 
                onClose={() => setIsHintOpen(false)}             
                onStepChange={(maxStep) => setHintCount(maxStep)} 
              />
            )}
    </div>
  );
}