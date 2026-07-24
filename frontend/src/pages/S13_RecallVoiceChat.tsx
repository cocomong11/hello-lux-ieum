import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import HintPopup from '../pages/S16_HintPopup';
import QuizVoiceController from '../components/quizButton';


const DESIGN = {
  WIDTH: '1920px',
  MIN_HEIGHT: '1450px',
  CONTENT_WIDTH: '648px',
  BACKGROUND_COLOR: '#F8F9FA',
} as const;

export default function S13_RecallVoiceChat() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  const handleHintClick = () => {
    setIsHintOpen(true);
    if (hintCount === 0) {
      setHintCount(1);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: DESIGN.MIN_HEIGHT, 
        backgroundColor: DESIGN.BACKGROUND_COLOR,
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <Header />

      
      <main
        style={{
          width: '100%',
          maxWidth: DESIGN.WIDTH, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '80px',
          paddingBottom: '120px',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        <div
          style={{
            width: DESIGN.CONTENT_WIDTH, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* 상단 뱃지 */}
          <div
            style={{
              width: '184px',
              height: '42px',
              borderRadius: '50px',
              background: '#4188ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              marginBottom: '26px',
            }}
          >
            <span
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                fontWeight: 700,
                fontSize: '22px',
                color: '#F8F9FA',
              }}
            >
              회상형 음성 대화
            </span>
          </div>

         
          <h1
            style={{
              width: '100%',
              margin: '0 0 9px 0',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontWeight: 700,
              fontSize: '30px',
              lineHeight: '140%',
              color: '#0D0D0D',
              textAlign: 'left',
            }}
          >
            고향에서 가장 기억에 남는 장소는 어디인가요?
          </h1>

          
          <p
            style={{
              width: '100%',
              margin: '0 0 26px 0',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontWeight: 400,
              fontSize: '19px',
              lineHeight: '155%',
              color: '#797980',
              textAlign: 'left',
            }}
          >
            정답이 없으니 생각나시는 대로 편하게 말씀해 주세요.
          </p>

        
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '154px',
              height: '46px',
              borderRadius: '10px',
              border: isPlaying ? '1px solid #DFDF87' : '1px solid #0F66E2',
              background: isPlaying ? '#0F66E2' : '#4188ED0D',
              boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              color: isPlaying ? '#FFFFFF' : '#0F66E2',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isPlaying ? (
              <>
                <span>↻</span>
                <span>다시 듣기</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>문제 듣기</span>
              </>
            )}
          </button>

         
          <QuizVoiceController
            onHintClick={handleHintClick}
            hintCount={hintCount}
            placeholder="“마이크를 눌러 장소와 관련된 추억을 말씀해 주세요”"
            onSuccessSubmit={(finalDuration) =>
              console.log('13페이지 소요시간:', finalDuration)
            }
            resultTitle="대화 완료!"
            resultDescription="멋진 이야기예요!"
          />

          
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '40px',
            }}
          >
            <button
              onClick={() => navigate('/patient-home')}
              style={{
                width: '121px',
                height: '59px',
                borderRadius: '50px',
                backgroundColor: '#0D0D0D',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              그만하기
            </button>

            <button
              onClick={() => navigate('/patient-draw')}
              style={{
                width: '151px',
                height: '59px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              다음 활동 →
            </button>
          </div>
        </div>
      </main>

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