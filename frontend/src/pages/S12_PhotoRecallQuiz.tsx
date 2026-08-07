import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import HintPopup from '../pages/S16_HintPopup';
import QuizVoiceController from '../components/quizButton'; 
import QuizResultCard from '../components/quizResultCard';

import { submitQuizAnswer, submitQuizResult, type QuizItem, type QuizResultPayload } from '../api/patientApi';

export default function S12_PhotoRecallQuiz() {
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState<QuizItem[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const getSafePCode = (quizItem?: QuizItem) => {
    const sessionPCode = sessionStorage.getItem('p_code');
    if (sessionPCode && isNaN(Number(sessionPCode))) {
      return sessionPCode;
    }
    if (quizItem?.p_code && isNaN(Number(quizItem.p_code))) {
      return String(quizItem.p_code);
    }
    if (quizItem?.pCode && isNaN(Number(quizItem.pCode))) {
      return String(quizItem.pCode);
    }
    return sessionPCode || quizItem?.p_code || quizItem?.pCode || 'HH5N7S';
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

      if (storedQuizzes.length > 0 && storedQuizzes[storedIndex]) {
        const currentQuizData = storedQuizzes[storedIndex] as any;
        const rawCategory = currentQuizData?.quizCategory ?? currentQuizData?.quiz_category ?? currentQuizData?.category ?? currentQuizData?.level ?? '';
        const cat = String(rawCategory).toLowerCase().trim();
        const hasPhoto = Boolean(currentQuizData?.quiz_photo || currentQuizData?.quizPhoto);

        const isPhotoCategory = cat === 'photo' || cat === '2' || cat === '사진' || cat === 'picture' || cat === 'image' || hasPhoto;

        if (!isPhotoCategory) {
          if (cat === 'choice' || cat === '1' || cat === '객관식') {
            navigate('/patient-voicechat', { replace: true });
            return;
          } else if (cat === 'text' || cat === '3' || cat === '단답형' || cat === '주관식') {
            navigate('/patient-voicequiz', { replace: true });
            return;
          }
        }
      }

      setQuizList(storedQuizzes);
      setCurrentIndex(storedIndex);
    } catch (e) {
      console.error('퀴즈 데이터 로딩 실패:', e);
      setQuizList([]);
    }
  }, [navigate]);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('0.0');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('잘 하셨어요!');

  const [thisQuizIsCorrect, setThisQuizIsCorrect] = useState<boolean | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const initialAccumulatedTimeRef = useRef<number>(0); 

  const [maxHintStepThisQuiz, setMaxHintStepThisQuiz] = useState<number>(0);
  const [isHintCountReflected, setIsHintCountReflected] = useState<boolean>(false);

  // --- 퀴즈 진행 상태 State (세션오염 최소화) ---
  const [hintCount, setHintCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('totalHintCount') || 0);
  });

  const [totalSolvedCount, setTotalSolvedCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('completedActivityCount') || 0);
  });

  const [correctCount, setCorrectCount] = useState<number>(() => {
    return Number(sessionStorage.getItem('correctQuizCount') || 0);
  });

  // 뒤로가기 방지
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

  // 문항 전환 시 문제 상태 초기화
  useEffect(() => {
    setIsSubmitted(false);
    setIsListening(false);
    setIsHintCountReflected(false);
    setIsHintOpen(false);
    setFeedbackMessage('잘 하셨어요!');
    setThisQuizIsCorrect(null); 

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
            sessionStorage.removeItem('completedActivityCount');
            sessionStorage.removeItem('correctQuizCount');
            sessionStorage.removeItem('totalHintCount');
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

  const currentQuestionText = 
    currentQuiz?.quiz_comment || 
    currentQuiz?.quizComment || 
    currentQuiz?.question || 
    '문제를 불러오는 중입니다.';

  const imageUrl = currentQuiz?.quiz_photo || currentQuiz?.quizPhoto;

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

  
  const handleSuccessSubmit = async (finalDuration: string, userSpokenAnswer?: string) => {
    const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
    const totalSpentSeconds = (initialAccumulatedTimeRef.current + sessionSpent).toFixed(1);

    const actualDuration = finalDuration !== '0.0' ? finalDuration : totalSpentSeconds;
    setElapsedTime(actualDuration);

    sessionStorage.removeItem('currentQuizElapsedTime');
    sessionStorage.removeItem('tempQuizHintStep');

    const answerText = userSpokenAnswer || currentQuiz.answer || '';

   
    if (!isHintCountReflected) {
      const addedCount = maxHintStepThisQuiz; 
      const updatedHintTotal = hintCount + addedCount;
      
      setHintCount(updatedHintTotal);
      sessionStorage.setItem('totalHintCount', String(updatedHintTotal));
      setIsHintCountReflected(true);
    }

    const payloadData = {
      pCode: String(getSafePCode(currentQuiz)), 
      setId: Number(currentQuiz.set_id || currentQuiz.setId || 1),
      quizNum: Number(currentQuiz.quiz_num || currentQuiz.quizNum || 1),
      userAnswer: answerText,
    };

    try {
      const res = await submitQuizAnswer(payloadData);

      if (res?.feedback) {
        setFeedbackMessage(res.feedback);
      }

      const rawCorrect = res?.correct ?? res?.isCorrect ?? res?.is_correct;
      const isCurrentCorrect = rawCorrect === true || String(rawCorrect).toLowerCase() === 'true';

      setThisQuizIsCorrect(isCurrentCorrect);

      
      if (!isSubmitted) {
       
        const nextSolvedCount = totalSolvedCount + 1;
        setTotalSolvedCount(nextSolvedCount);
        sessionStorage.setItem('completedActivityCount', String(nextSolvedCount));

       
        if (isCurrentCorrect) {
          const nextCorrectCount = correctCount + 1;
          setCorrectCount(nextCorrectCount);
          sessionStorage.setItem('correctQuizCount', String(nextCorrectCount));
        }

        setIsSubmitted(true);
      }

    } catch (error) {
      console.error('사진 퀴즈 답안 제출 실패:', error);
      setThisQuizIsCorrect(false);

      if (!isSubmitted) {
        const nextSolvedCount = totalSolvedCount + 1;
        setTotalSolvedCount(nextSolvedCount);
        sessionStorage.setItem('completedActivityCount', String(nextSolvedCount));
        setIsSubmitted(true);
      }
    }
  };

 
  const handleNextPage = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

   
    if (!isSubmitted) {
      setThisQuizIsCorrect(false);

      const pCode = String(getSafePCode(currentQuiz)); 
      const setId = Number(currentQuiz.set_id || currentQuiz.setId || 1);
      const quizNum = Number(currentQuiz.quiz_num || currentQuiz.quizNum || 1);

      try {
        await submitQuizAnswer({
          pCode,
          setId,
          quizNum,
          userAnswer: '',
        });
      } catch (error) {
        console.error('사진 퀴즈 스킵 알림 실패:', error);
      }
    }

    sessionStorage.removeItem('currentQuizElapsedTime');
    sessionStorage.removeItem('tempQuizHintStep');

    const nextIndex = currentIndex + 1;

    // 🏁 모든 문항을 마쳤을 때 최종 결과 제출
    if (nextIndex >= quizList.length) {
      try {
        const finalPCodeStr = String(getSafePCode(currentQuiz)); 
        const finalSetId = Number(currentQuiz.set_id || currentQuiz.setId || 1);
        const totalHint = Number(sessionStorage.getItem('totalHintCount') || 0);

        const finalPayload: QuizResultPayload = {
          setId: finalSetId,
          pCode: finalPCodeStr as any,
          totalCount: totalSolvedCount, // 제출 누른 횟수만 전달
          correctCount: correctCount,   // 제출 눌러 맞힌 횟수만 전달
          hint: totalHint,
          caculate: "0",
          feedbackContent: `총 ${totalSolvedCount}문제 제출 중 ${correctCount}문제를 맞추셨습니다. 오늘도 수고하셨습니다!`
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

    const nextQuiz = quizList[nextIndex] as any;
    const rawCategory = nextQuiz?.quiz_category ?? nextQuiz?.quizCategory ?? nextQuiz?.category ?? nextQuiz?.level ?? '';
    const category = String(rawCategory).toLowerCase().trim();
    const hasPhoto = Boolean(nextQuiz?.quiz_photo || nextQuiz?.quizPhoto);

    if (category === 'choice' || category === '1' || category === '객관식') {
      navigate('/patient-voicechat');
    } else if (category === 'photo' || category === '2' || category === '사진' || category === 'picture' || category === 'image' || hasPhoto) {
      setCurrentIndex(nextIndex);
      window.scrollTo(0, 0);
    } else if (category === 'text' || category === '3' || category === '단답형' || category === '주관식') {
      navigate('/patient-voicequiz');
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
    navigate('/patient-home');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', paddingBottom: '120px', position: 'relative' }}>
      <Header />

      <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transform: 'translateX(6px)', zIndex: 10 }}>
        <div style={{ width: '220px', height: '42px', borderRadius: '50px', backgroundColor: '#4188ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', gap: '10px', marginBottom: '26px', marginTop: '60px' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#F8F9FA' }}>
            Q{currentIndex + 1}. 사진 회상 퀴즈
          </span>
        </div>

        <h1 style={{ width: '100%', fontWeight: 700, fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 9px 0', textAlign: 'left' }}>
          {currentQuestionText}
        </h1>

        <p style={{ width: '100%', fontWeight: 400, fontSize: '22px', lineHeight: '155%', color: '#797980', margin: '0 0 26px 0', textAlign: 'left' }}>
          사진을 잘 보시고, 생각나시는 대로 말씀해 주세요.
        </p>

        <button 
          type="button"
          onClick={() => setIsListening(!isListening)}
          style={{ width: '154px', height: '46px', borderRadius: '10px', padding: '6px 19px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', backgroundColor: isListening ? '#0F66E2' : '#4188ED0D', border: isListening ? '1px solid #DFDF87' : '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED', marginBottom: '26px' }}
        >
          <span style={{ fontWeight: 700, fontSize: '20px', color: isListening ? '#FFFFFF' : '#0F66E2' }}>
            {isListening ? '↻ 다시 듣기' : '▶ 문제 듣기'}
          </span>
        </button>

        <div style={{ width: '100%', height: '317px', borderRadius: '10px', border: '1px solid #8E8E98', backgroundColor: '#D9D9D9', boxShadow: '0px 0px 4px 0px #4188ED', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="회상 퀴즈 사진" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span style={{ fontWeight: 400, fontSize: '18px', color: '#797980', textAlign: 'center' }}>
              (가족/지인 사진)
            </span>
          )}
        </div>

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
              isCorrect={thisQuizIsCorrect}
              resultDescription={`지금까지 총 ${totalSolvedCount}문제를 완료하셨어요.`}
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