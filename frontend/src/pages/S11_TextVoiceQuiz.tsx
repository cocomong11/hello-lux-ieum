import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import HintPopup from '../pages/S16_HintPopup'; 
import Header from '../components/patientHeader';
import QuizVoiceController from '../components/quizButton'; 
import QuizResultCard from '../components/quizResultCard';

import { submitQuizAnswer, submitQuizResult, type QuizItem, type QuizResultPayload } from '../api/patientApi';

export default function S11_TextVoiceQuiz() {
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState<QuizItem[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  
  const getSafePCode = (quizItem?: QuizItem): string => {
    const sessionPCode = sessionStorage.getItem('p_code');
    if (sessionPCode && isNaN(Number(sessionPCode))) {
      return sessionPCode;
    }
    const itemPCode = quizItem?.p_code ?? quizItem?.pCode;
    if (itemPCode !== undefined && itemPCode !== null && isNaN(Number(itemPCode))) {
      return String(itemPCode);
    }
    return sessionPCode || 'HH5N7S';
  };

  
  const getNumericPCode = (quizItem?: QuizItem): number => {
    const rawPCode = quizItem?.p_code ?? quizItem?.pCode;
    if (rawPCode !== undefined && rawPCode !== null && !isNaN(Number(rawPCode))) {
      return Number(rawPCode);
    }

    const sessionNum = sessionStorage.getItem('p_code_num') || sessionStorage.getItem('internal_code');
    if (sessionNum && !isNaN(Number(sessionNum))) {
      return Number(sessionNum);
    }

    const sessionPCode = sessionStorage.getItem('p_code');
    if (sessionPCode && !isNaN(Number(sessionPCode))) {
      return Number(sessionPCode);
    }

    return 1;
  };

 
  useEffect(() => {
    try {
      const storedQuizzesRaw = sessionStorage.getItem('quizList');
      const storedQuizzes: QuizItem[] = storedQuizzesRaw ? JSON.parse(storedQuizzesRaw) : [];
      
      let storedIndex = parseInt(sessionStorage.getItem('currentQuizIndex') || '0', 10);

      if (isNaN(storedIndex) || storedIndex < 0) {
        storedIndex = 0;
      }

     
      if (storedQuizzes.length > 0 && storedIndex >= storedQuizzes.length) {
        storedIndex = storedQuizzes.length - 1;
      }
      
      setQuizList(storedQuizzes);
      setCurrentIndex(storedIndex);
    } catch (e) {
      console.error('퀴즈 데이터 로딩 실패:', e);
      setQuizList([]);
    }
  }, []);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('0.0');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('잘 하셨어요!');

  const [thisQuizIsCorrect, setThisQuizIsCorrect] = useState<boolean | undefined>(undefined);

  const startTimeRef = useRef<number>(Date.now());
  const initialAccumulatedTimeRef = useRef<number>(0); 

  const [maxHintStepThisQuiz, setMaxHintStepThisQuiz] = useState<number>(0);
  const [isHintCountReflected, setIsHintCountReflected] = useState<boolean>(false);

  const [hintCount, setHintCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('totalHintCount') || 0);
  });

  const [totalSolvedCount, setTotalSolvedCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('completedActivityCount') || 0);
  });

  const [correctCount, setCorrectCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('correctQuizCount') || 0);
  });

  
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

  
  useEffect(() => {
    setIsSubmitted(false);
    setIsListening(false);
    setIsHintCountReflected(false);
    setIsHintOpen(false);
    setFeedbackMessage('잘 하셨어요!');
    setThisQuizIsCorrect(undefined); 

    const savedTempHintStep = parseInt(sessionStorage.getItem('tempQuizHintStep') || '0', 10);
    setMaxHintStepThisQuiz(savedTempHintStep);

    const savedAccumulated = parseFloat(sessionStorage.getItem('currentQuizElapsedTime') || '0');
    initialAccumulatedTimeRef.current = savedAccumulated;
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  if (!quizList) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>퀴즈를 불러오는 중입니다...</h2>
      </div>
    );
  }

  if (quizList.length === 0 || currentIndex >= quizList.length) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <h2>불러올 퀴즈가 없거나 진행 상태가 유효하지 않습니다.</h2>
        <button 
          onClick={() => {
            sessionStorage.setItem('currentQuizIndex', '0');
            navigate('/patient-home');
          }} 
          style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#4188ED', color: '#FFF', border: 'none', cursor: 'pointer' }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const currentQuiz = quizList[currentIndex];

  const currentQuizComment = 
    currentQuiz?.quiz_comment || 
    currentQuiz?.quizComment || 
    currentQuiz?.question || 
    '질문 내용이 없습니다.';

  const hintsList = currentQuiz?.hints && currentQuiz.hints.length > 0 
    ? currentQuiz.hints 
    : ['힌트 정보가 없습니다.'];

  const handleHintClick = () => {
    setIsHintOpen(true); 
    if (maxHintStepThisQuiz === 0) {
      setMaxHintStepThisQuiz(1);
    }
  };

  const handleStepChange = (maxStep: number) => {
    if (maxStep > maxHintStepThisQuiz) {
      setMaxHintStepThisQuiz(maxStep);
    }
  };

 
  const handleSuccessSubmit = async (finalDuration: string, answerText?: string) => {
    const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
    const totalSpentSeconds = (initialAccumulatedTimeRef.current + sessionSpent).toFixed(1);

    const actualDuration = finalDuration !== '0.0' ? finalDuration : totalSpentSeconds;
    setElapsedTime(actualDuration);

    sessionStorage.removeItem('currentQuizElapsedTime');
    sessionStorage.removeItem('tempQuizHintStep');

    const userAnswer = answerText || '';

    if (!isHintCountReflected) {
      const addedCount = maxHintStepThisQuiz; 
      const updatedHintTotal = hintCount + addedCount;
      
      setHintCount(updatedHintTotal);
      sessionStorage.setItem('totalHintCount', String(updatedHintTotal));
      setIsHintCountReflected(true);
    }

    const payloadData = {
      pCode: getSafePCode(currentQuiz),
      setId: Number(currentQuiz.set_id || currentQuiz.setId || 1),
      quizNum: Number(currentQuiz.quiz_num || currentQuiz.quizNum || 1),
      userAnswer: userAnswer,
    };

    try {
      const response = await submitQuizAnswer(payloadData);
      
      if (response?.feedback) {
        setFeedbackMessage(response.feedback);
      }

      const rawCorrect = response?.correct ?? response?.isCorrect ?? response?.is_correct;
      const isCurrentCorrect = rawCorrect === true || String(rawCorrect).toLowerCase() === 'true';
      
      setThisQuizIsCorrect(isCurrentCorrect);

      if (!isSubmitted && isCurrentCorrect) {
        const newCorrect = correctCount + 1;
        setCorrectCount(newCorrect);
        sessionStorage.setItem('correctQuizCount', String(newCorrect));
      }

    } catch (error) {
      console.error('답안 제출 API 오류:', error);
      setThisQuizIsCorrect(false);
    }

    if (!isSubmitted) {
      const updatedCount = totalSolvedCount + 1;
      setTotalSolvedCount(updatedCount);
      sessionStorage.setItem('completedActivityCount', String(updatedCount)); 
      setIsSubmitted(true);
    }
  };

  
  const handleNextPage = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!isSubmitted) {
      setThisQuizIsCorrect(false);

      const pCode = getSafePCode(currentQuiz);
      const setId = Number(currentQuiz.set_id || currentQuiz.setId || 1);
      const quizNum = Number(currentQuiz.quiz_num || currentQuiz.quizNum || 1);

      const payloadData = {
        pCode,
        setId,
        quizNum,
        userAnswer: '',
      };

      try {
        await submitQuizAnswer(payloadData);
      } catch (error) {
        console.error('주관식 퀴즈 스킵 답안 제출 실패:', error);
      }

      const updatedCount = totalSolvedCount + 1;
      setTotalSolvedCount(updatedCount);
      sessionStorage.setItem('completedActivityCount', String(updatedCount));
    }

    sessionStorage.removeItem('currentQuizElapsedTime');
    sessionStorage.removeItem('tempQuizHintStep');

    const nextIndex = currentIndex + 1;

    
    if (nextIndex >= quizList.length) {
      try {
        const numericPCode = getNumericPCode(currentQuiz);
        const finalSetId = Number(currentQuiz.set_id || currentQuiz.setId || 1);
        
        const validSolvedCount = parseInt(sessionStorage.getItem('completedActivityCount') || String(totalSolvedCount + (isSubmitted ? 0 : 1)), 10);
        const finalCorrectCount = parseInt(sessionStorage.getItem('correctQuizCount') || String(correctCount), 10);
        const totalHint = Number(sessionStorage.getItem('totalHintCount') || 0);

        const finalPayload: QuizResultPayload = {
          setId: finalSetId,
          pCode: numericPCode,
          totalCount: validSolvedCount,
          correctCount: finalCorrectCount,
          hint: totalHint,
          caculate: "0", 
          feedbackContent: `총 ${validSolvedCount}문제 중 ${finalCorrectCount}문제를 맞추셨습니다. 오늘도 수고하셨습니다!`
        };

        await submitQuizResult(finalPayload);
      } catch (err) {
        console.error('전체 퀴즈 결과 제출 실패:', err);
      }

      sessionStorage.setItem('todayActivityCompleted', 'true');
      navigate('/patient-result');
      return;
    }

    sessionStorage.setItem('currentQuizIndex', String(nextIndex));

    const nextQuiz = quizList[nextIndex];
    const rawCategory = nextQuiz?.quiz_category ?? nextQuiz?.quizCategory ?? nextQuiz?.category ?? '';
    const category = String(rawCategory).toLowerCase().trim();

    if (category === 'choice' || category === '1' || category === '객관식') {
      navigate('/patient-voicechat');
    } else if (category === 'photo' || category === '2' || category === '사진') {
      navigate('/patient-photo');
    } else if (category === 'text' || category === '3' || category === '단답형' || category === '주관식') {
      setCurrentIndex(nextIndex);
      window.scrollTo(0, 0);
    } else {
      setCurrentIndex(nextIndex);
      window.scrollTo(0, 0);
    }
  };

 
  const handleQuit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!isSubmitted) {
     
      const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
      const totalAccumulated = initialAccumulatedTimeRef.current + sessionSpent;
      sessionStorage.setItem('currentQuizElapsedTime', String(totalAccumulated));
      sessionStorage.setItem('tempQuizHintStep', String(maxHintStepThisQuiz));
      sessionStorage.setItem('currentQuizIndex', String(currentIndex));
    } else {
      sessionStorage.removeItem('currentQuizElapsedTime');
      sessionStorage.removeItem('tempQuizHintStep');
      const nextIdx = Math.min(currentIndex + 1, quizList.length - 1);
      sessionStorage.setItem('currentQuizIndex', String(nextIdx));
    }

    sessionStorage.setItem('todayActivityQuit', 'true');
    sessionStorage.setItem('completedActivityCount', String(totalSolvedCount));

    navigate('/patient-home');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', paddingBottom: '120px', position: 'relative' }}>
      <Header />

      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transform: 'translateX(6px)', zIndex: 10 }}>
        <div style={{ width: 'auto', minWidth: '220px', height: '42px', borderRadius: '50px', backgroundColor: '#4188ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', boxSizing: 'border-box', gap: '10px', marginBottom: '26px', marginTop: '60px', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#F8F9FA' }}>
            Q{currentIndex + 1}. 문장 주관식
          </span>
        </div>

        <h1 
          style={{ 
            width: '100%', 
            fontWeight: 700, 
            fontSize: '28px', 
            lineHeight: '140%', 
            color: '#0D0D0D', 
            margin: '0 0 26px 0',
            wordBreak: 'keep-all',
            whiteSpace: 'pre-line'
          }}
        >
          {currentQuizComment}
        </h1>
        
        <button 
          type="button"
          onClick={() => {
            setIsListening(!isListening);
          }}
          style={{ width: '154px', height: '46px', borderRadius: '10px', padding: '6px 19px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', backgroundColor: isListening ? '#0F66E2' : '#4188ED0D', border: isListening ? '1px solid #DFDF87' : '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED', marginBottom: '26px' }}
        >
          <span style={{ fontWeight: 700, fontSize: '20px', color: isListening ? '#FFFFFF' : '#0F66E2' }}>
            {isListening ? '↻ 다시 듣기' : '▶ 문제 듣기'}
          </span>
        </button>

        <QuizVoiceController 
          key={currentIndex}
          onHintClick={handleHintClick}
          placeholder="“정답을 말씀해 주세요.”"
          onSuccessSubmit={handleSuccessSubmit}
          showHintButton={true}
        />

        {isSubmitted && (
          <div style={{ marginTop: '10px', width: '100%' }}>
            <QuizResultCard 
              duration={elapsedTime}
              hintCount={hintCount}
              feedback={feedbackMessage}
              resultDescription={`잘하셨어요! 지금까지 총 ${totalSolvedCount}문제를 완료하셨어요.`}
              showHintCount={true}
              isCorrect={thisQuizIsCorrect}
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
        <HintPopup 
          hints={hintsList}
          initialStep={maxHintStepThisQuiz > 0 ? maxHintStepThisQuiz : 1}
          onClose={() => setIsHintOpen(false)}
          onStepChange={handleStepChange}
        />
      )}
    </div>
  );
}