import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import HintPopup from '../pages/S16_HintPopup';
import QuizVoiceController from '../components/quizButton'; 
import QuizResultCard from '../components/quizResultCard';

import { submitQuizAnswer, submitQuizResult, type QuizItem } from '../api/patientApi';

export default function S12_PhotoRecallQuiz() {
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState<QuizItem[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    try {
      const storedQuizzes = JSON.parse(sessionStorage.getItem('quizList') || '[]');
      const storedIndex = parseInt(sessionStorage.getItem('currentQuizIndex') || '0', 10);
      
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

  const [thisQuizIsCorrect, setThisQuizIsCorrect] = useState<boolean | null>(null);

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

  if (quizList.length === 0) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <h2>불러올 퀴즈가 없습니다.</h2>
        <button onClick={() => navigate('/patient-home')} style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#4188ED', color: '#FFF', border: 'none', cursor: 'pointer' }}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const currentQuiz = quizList[currentIndex] || quizList[0];

  const hintsList = currentQuiz?.hints && currentQuiz.hints.length > 0 
    ? currentQuiz.hints 
    : ['힌트 정보가 없습니다.'];

  // 문자/숫자 혼합 pCode 호환성 함수
  const getValidPCode = (): string => {
    return (
      currentQuiz?.p_code ||
      sessionStorage.getItem('p_code') ||
      sessionStorage.getItem('pCode') ||
      'AB37X2'
    );
  };

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
      pCode: getValidPCode(),
      setId: currentQuiz.set_id || 1,
      quizNum: currentQuiz.quiz_num || 1,
      userAnswer: answerText,
    };

    try {
      const res = await submitQuizAnswer(payloadData);

      console.log('📩 [S12 제출 응답 수신]', res);
      console.log('✅ 정답 여부 (isCorrect):', res?.isCorrect);
      console.log('💬 피드백 메시지 (feedback):', res?.feedback);

      if (res?.feedback) {
        setFeedbackMessage(res.feedback);
      }

      const isCurrentCorrect = Boolean(res?.isCorrect);

      setCorrectCount((prev) => {
        let newCount = prev;

        if (thisQuizIsCorrect !== true && isCurrentCorrect) {
          newCount = prev + 1;
        } else if (thisQuizIsCorrect === true && !isCurrentCorrect) {
          newCount = Math.max(0, prev - 1);
        }

        sessionStorage.setItem('correctQuizCount', String(newCount));
        return newCount;
      });

      setThisQuizIsCorrect(isCurrentCorrect);

    } catch (error) {
      console.error('❌ 사진 퀴즈 답안 제출 실패:', error);
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

    let latestCorrectCount = correctCount;

    if (!isSubmitted) {
      const pCode = getValidPCode();
      const setId = currentQuiz.set_id || 1;
      const quizNum = currentQuiz.quiz_num || 1;

      const payloadData = {
        pCode,
        setId,
        quizNum,
        userAnswer: '',
      };

      try {
        const res = await submitQuizAnswer(payloadData);

        console.log('[다음 활동 - 스킵/미제출 응답 수신]', res);
        console.log(' 정답 여부 (isCorrect):', res?.isCorrect);
        console.log(' 피드백 메시지 (feedback):', res?.feedback);

        const isCurrentCorrect = Boolean(res?.isCorrect);

        if (thisQuizIsCorrect !== true && isCurrentCorrect) {
          latestCorrectCount = correctCount + 1;
        } else if (thisQuizIsCorrect === true && !isCurrentCorrect) {
          latestCorrectCount = Math.max(0, correctCount - 1);
        }

        setCorrectCount(latestCorrectCount);
        sessionStorage.setItem('correctQuizCount', String(latestCorrectCount));
        setThisQuizIsCorrect(isCurrentCorrect);
      } catch (error) {
        console.error(' 사진 퀴즈 스킵 제출 실패:', error);
      }
    }

    sessionStorage.removeItem('currentQuizElapsedTime');
    sessionStorage.removeItem('tempQuizHintStep');

    const nextIndex = currentIndex + 1;

    if (nextIndex >= quizList.length) {
      try {
        const finalPCode = getValidPCode();
        const finalSetId = currentQuiz.set_id || 1;
        
        const validSolvedCount = parseInt(sessionStorage.getItem('completedActivityCount') || '0', 10);
        const finalCorrectCount = latestCorrectCount;
        const totalHint = Number(sessionStorage.getItem('totalHintCount') || 0);

        const finalPayload = {
          setId: finalSetId,
          pCode: finalPCode,
          totalCount: validSolvedCount,
          correctCount: finalCorrectCount,
          hint: totalHint,
          calculate: "0",
          feedbackContent: `총 ${validSolvedCount}문제 중 ${finalCorrectCount}문제를 맞추셨습니다. 오늘도 수고하셨습니다!`
        };

        console.log(' [전체 퀴즈 결과 최종 제출 Payload 전송]', finalPayload);

        const resultResponse = await submitQuizResult(finalPayload);
        console.log(' [전체 퀴즈 결과 제출 완료 응답]', resultResponse);
      } catch (err) {
        console.error(' 전체 퀴즈 결과 제출 실패:', err);
      }

      sessionStorage.setItem('todayActivityCompleted', 'true');
      navigate('/patient-result');
      return;
    }

    sessionStorage.setItem('currentQuizIndex', String(nextIndex));

    const nextQuiz = quizList[nextIndex];
    const category = (nextQuiz?.quiz_category || '').toLowerCase().trim();

    if (category === 'choice') {
      navigate('/patient-voicechat');
    } else if (category === 'photo') {
      setCurrentIndex(nextIndex);
      window.scrollTo(0, 0);
    } else if (category === 'text') {
      navigate('/patient-voicequiz');
    } else {
      navigate('/patient-home');
    }
  };

  const handleQuit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!isSubmitted) {
      const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
      const totalAccumulated = initialAccumulatedTimeRef.current + sessionSpent;
      sessionStorage.setItem('currentQuizElapsedTime', String(totalAccumulated));
      sessionStorage.setItem('tempQuizHintStep', String(maxHintStepThisQuiz));
    } else {
      sessionStorage.removeItem('currentQuizElapsedTime');
      sessionStorage.removeItem('tempQuizHintStep');
    }

    sessionStorage.setItem('todayActivityQuit', 'true');

    const targetIndex = isSubmitted ? currentIndex + 1 : currentIndex;
    sessionStorage.setItem('currentQuizIndex', String(targetIndex));
    sessionStorage.setItem('completedActivityCount', String(totalSolvedCount));

    navigate('/patient-home');
  };

  const imageUrl = currentQuiz?.quiz_photo;

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
          {currentQuiz?.quiz_comment}
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