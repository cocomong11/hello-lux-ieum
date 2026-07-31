import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HintPopup from '../pages/S16_HintPopup';  
import Header from '../components/patientHeader';
import QuizVoiceController from '../components/quizButton'; 
import QuizResultCard from '../components/quizResultCard';

const currentQuizData = {
  id: 1,
  question: "오늘이 몇 월 며칠인지 말씀해 주세요.",
  hintText: "달력을 참고하거나, 오늘 아침에 확인했던 날짜를 떠올려보세요."
};

export default function S11_TextVoiceQuiz() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const preventGoBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventGoBack);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('0.0');

  
  const [hasUsedHintThisQuiz, setHasUsedHintThisQuiz] = useState<boolean>(false);

  
  const [hintCount, setHintCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('totalHintCount') || 0);
  });

 
  const [totalSolvedCount, setTotalSolvedCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('completedActivityCount') || 0);
  });

  
  const handleHintClick = () => {
    if (!hasUsedHintThisQuiz) {
      setHasUsedHintThisQuiz(true); 
      const nextHintCount = hintCount + 1;
      setHintCount(nextHintCount);
      sessionStorage.setItem('totalHintCount', String(nextHintCount)); 
    }
    setIsHintOpen(true); 
  };

  // 🎯 성공 제출 시
  const handleSuccessSubmit = (finalDuration: string) => {
    setElapsedTime(finalDuration);

    if (!isSubmitted) {
      const updatedCount = totalSolvedCount + 1;
      setTotalSolvedCount(updatedCount);
      sessionStorage.setItem('completedActivityCount', String(updatedCount)); 
      setIsSubmitted(true);
    }
  };

  const handleNextPage = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    navigate('/patient-photo'); 
  };

  const handleQuit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    sessionStorage.setItem('todayActivityQuit', 'true');
    navigate('/patient-home');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', paddingBottom: '120px', position: 'relative' }}>
      <Header />

      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transform: 'translateX(6px)', zIndex: 10 }}>
        <div style={{ width: '184px', height: '42px', borderRadius: '50px', backgroundColor: '#4188ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', boxSizing: 'border-box', gap: '10px', marginBottom: '26px', marginTop: '60px' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#F8F9FA' }}>주관식 음성 퀴즈</span>
        </div>

        <h1 style={{ width: '458px', fontWeight: 700, fontSize: '28px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 26px 0' }}>
          {currentQuizData.question}
        </h1>
        
        <button 
          type="button"
          onClick={() => setIsListening(!isListening)}
          style={{ width: '154px', height: '46px', borderRadius: '10px', padding: '6px 19px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', backgroundColor: isListening ? '#0F66E2' : '#4188ED0D', border: isListening ? '1px solid #DFDF87' : '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED', marginBottom: '26px' }}
        >
          <span style={{ fontWeight: 700, fontSize: '20px', color: isListening ? '#FFFFFF' : '#0F66E2' }}>
            {isListening ? '↻ 다시 듣기' : '▶ 문제 듣기'}
          </span>
        </button>

       
            <QuizVoiceController 
                  onHintClick={handleHintClick}
                   placeholder="“오월 이십육일이요.”"
                     onSuccessSubmit={handleSuccessSubmit}
              showHintButton={true}
              />
        {isSubmitted && (
          <div style={{ marginTop: '10px', width: '100%' }}>
            <QuizResultCard 
              duration={elapsedTime}
              hintCount={hintCount}
              resultDescription={`잘하셨어요! 지금까지 총 ${totalSolvedCount}문제를 완료하셨어요.`}
              showHintCount={true}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px', position: 'relative', zIndex: 10 }}>
          <button type="button" onClick={handleQuit} style={{ width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer' }}>
            그만하기
          </button>
          <button type="button" onClick={handleNextPage} style={{ width: '151px', height: '59px', borderRadius: '50px', backgroundColor: '#4188ED', border: 'none', boxShadow: '0px 0px 4px 0px #4188ED', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer' }}>
            다음 활동 →
          </button>
        </div>
      </div>

      {isHintOpen && (
        <div style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100vw', height: '100vh' }}>
          <HintPopup isOpen={isHintOpen} onClose={() => setIsHintOpen(false)} hintText={currentQuizData.hintText} />
        </div>
      )}
    </div>
  );
}