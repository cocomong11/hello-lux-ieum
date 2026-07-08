import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import HintPopup from '../pages/S16_HintPopup';
import QuizVoiceController from '../components/quizButton';

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
    <div style={{
      width: '100vw', margin: 0, padding: 0, minHeight: '100vh', backgroundColor: '#FFFFFF',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingBottom: '100px', boxSizing: 'border-box', overflowX: 'hidden' 
    }}>

      <Header/>

      {/* 중앙 메인 콘텐츠 영역 */}
      <main style={{
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginTop: '68px', boxSizing: 'border-box'
      }}>

        <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          {/* 상단 뱃지 */}
          <div style={{
            width: '184px', height: '42px', borderRadius: '50px', background: '#4188ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box', marginBottom: '26px'
          }}>
            <span style={{ fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '22px', color: '#F8F9FA' }}>
              회상형 음성 대화
            </span>
          </div>

          {/* 질문 타이틀 */}
          <h1 style={{
            width: '100%', margin: '0 0 9px 0', fontFamily: 'Inter, sans-serif', fontWeight: 700,
            fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', textAlign: 'left'
          }}>
            고향에서 가장 기억에 남는 장소는 어디인가요?
          </h1>

          {/* 서브 설명 문구 */}
          <p style={{
            width: '100%', margin: '0 0 26px 0', fontFamily: 'Pretendard Variable', fontWeight: 400,
            fontSize: '19px', lineHeight: '155%', color: '#797980', textAlign: 'left'
          }}>
            정답이 없으니 생각나시는 대로 편하게 말씀해 주세요.
          </p>

          {/* 🔊 문제 듣기 / 다시 듣기 버튼 (메인 페이지 유지) */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '154px', height: '46px', borderRadius: '10px',
              border: isPlaying ? '1px solid #DFDF87' : '1px solid #0F66E2', 
              background: isPlaying ? '#0F66E2' : '#4188ED0D', 
              boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px',
              color: isPlaying ? '#FFFFFF' : '#0F66E2', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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

          {/* 마이크 박스부터 정답 결과 카드까지 통째로 압축 */}
          <QuizVoiceController 
            onHintClick={handleHintClick}
            hintCount={hintCount}
            placeholder="“마이크를 눌러 장소와 관련된 추억을 말씀해 주세요”"
            onSuccessSubmit={(finalDuration) => console.log('13페이지 소요시간:', finalDuration)}
          />

          {/* 하단 내비게이션 바 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '648px', marginTop: '40px' }}>
            <button style={{
              width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
              border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
            }}>
              그만하기
            </button>

            <button
              onClick={() => navigate('/patient-draw')}
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