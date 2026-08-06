import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import QuizResultCard from '../components/quizResultCard';

import { submitQuizAnswer, submitQuizResult, type QuizItem, type QuizResultPayload } from '../api/patientApi';

export default function S13_RecallVoiceChat() {
  const navigate = useNavigate();

  const [quizList, setQuizList] = useState<QuizItem[]>([]);
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

  const currentQuiz = quizList[currentIndex] || {
    p_code: '1',
    set_id: 1,
    quiz_num: 1,
    quiz_comment: '고향에서 가장 기억에 남는 장소는 어디인가요?',
    options: ['슈퍼마켓', '집', '공원', '우물가'],
  };

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const isSubmittedRef = useRef<boolean>(false); 

  const [elapsedTime, setElapsedTime] = useState<string>('0.0');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('잘 하셨어요!');

  const [totalSolvedCount, setTotalSolvedCount] = useState<number>(() => {
    const saved = sessionStorage.getItem('completedActivityCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalHintCount] = useState<number>(() => {
    const savedHints = sessionStorage.getItem('totalHintCount');
    return savedHints ? parseInt(savedHints, 10) : 0;
  });

  const startTimeRef = useRef<number>(Date.now());
  const initialAccumulatedTimeRef = useRef<number>(0);

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
    setSelectedOption(null);
    setIsSubmitted(false);
    isSubmittedRef.current = false; 
    setElapsedTime('0.0');
    setFeedbackMessage('잘 하셨어요!');

    const savedAccumulated = parseFloat(sessionStorage.getItem('currentQuizElapsedTime') || '0');
    initialAccumulatedTimeRef.current = savedAccumulated;
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const optionsList: string[] = currentQuiz.options || ['1번 옵션', '2번 옵션', '3번 옵션', '4번 옵션'];

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('정답을 선택해 주세요!');
      return;
    }

    if (isSubmittedRef.current) return; 

    // 제출 처리 즉시 플래그 세팅
    setIsSubmitted(true);
    isSubmittedRef.current = true;

    const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
    const totalSpentSeconds = (initialAccumulatedTimeRef.current + sessionSpent).toFixed(1);

    setElapsedTime(totalSpentSeconds);
    sessionStorage.removeItem('currentQuizElapsedTime');

    const selectedAnswerText = optionsList[selectedOption];
    
    const pCode = String(currentQuiz.p_code || sessionStorage.getItem('p_code') || '1');
    const setId = Number(currentQuiz.set_id || 1);
    const quizNum = Number(currentQuiz.quiz_num || 1);

    const payloadData = {
      pCode,
      setId,
      quizNum,
      userAnswer: selectedAnswerText,
    };

    try {
      const res = await submitQuizAnswer(payloadData);

      console.log(' [S13 제출 응답 수신]', res);

      if (res?.feedback) {
        setFeedbackMessage(res.feedback);
      }

      if (res?.isCorrect === true) {
        const currentCorrect = parseInt(sessionStorage.getItem('correctQuizCount') || '0', 10);
        sessionStorage.setItem('correctQuizCount', String(currentCorrect + 1));
      }
    } catch (error) {
      console.error(' 객관식 답안 제출 API 오류:', error);
    }

    const nextSolvedCount = totalSolvedCount + 1;
    setTotalSolvedCount(nextSolvedCount);
    sessionStorage.setItem('completedActivityCount', String(nextSolvedCount));
  };

  const handleNextPage = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!isSubmittedRef.current) {
      const pCode = String(currentQuiz.p_code || sessionStorage.getItem('p_code') || '1');
      const setId = Number(currentQuiz.set_id || 1);
      const quizNum = Number(currentQuiz.quiz_num || 1);

      const payloadData = {
        pCode,
        setId,
        quizNum,
        userAnswer: '',
      };

      console.log('⏭ [제출 없이 다음 활동] 스킵 답안 Payload 전송:', payloadData);

      try {
        const res = await submitQuizAnswer(payloadData);
        console.log(' [스킵 답안 제출 응답 수신]', res);

        if (res?.isCorrect === true) {
          const currentCorrect = parseInt(sessionStorage.getItem('correctQuizCount') || '0', 10);
          sessionStorage.setItem('correctQuizCount', String(currentCorrect + 1));
        }
      } catch (error) {
        console.error(' 스킵 답안 제출 API 오류:', error);
      }
    }

    sessionStorage.removeItem('currentQuizElapsedTime');

    const nextIndex = currentIndex + 1;

    if (nextIndex >= quizList.length) {
      try {
        const rawPCode = String(currentQuiz.p_code || sessionStorage.getItem('p_code') || '1');
        const numericPCode = parseInt(rawPCode, 10) || 0;
        const finalSetId = Number(currentQuiz.set_id || 1);
        
        const validSolvedCount = parseInt(sessionStorage.getItem('completedActivityCount') || '0', 10);
        const correctCount = parseInt(sessionStorage.getItem('correctQuizCount') || '0', 10);
        const totalHint = parseInt(sessionStorage.getItem('totalHintCount') || '0', 10);

        const finalPayload: QuizResultPayload = {
          setId: finalSetId,
          pCode: numericPCode,
          totalCount: validSolvedCount,
          correctCount: correctCount,
          hint: totalHint,
          caculate: "0", // 백엔드 DTO에 맞춘 caculate 키
          feedbackContent: "오늘도 퀴즈를 잘 마쳤습니다!"
        };

        console.log('[전체 퀴즈 결과 최종 제출 Payload 전송]', finalPayload);

        const resultResponse = await submitQuizResult(finalPayload);
        console.log('[전체 퀴즈 결과 제출 완료 응답]', resultResponse);
      } catch (err) {
        console.error('전체 퀴즈 결과 제출 실패:', err);
      }

      sessionStorage.setItem('todayActivityCompleted', 'true');
      navigate('/patient-result');
      return;
    }

    sessionStorage.setItem('currentQuizIndex', String(nextIndex));

    const nextQuiz = quizList[nextIndex];
    const category = (nextQuiz?.quiz_category || '').toLowerCase().trim();

    if (category === 'choice') {
      setCurrentIndex(nextIndex);
      window.scrollTo(0, 0);
    } else if (category === 'photo') {
      navigate('/patient-photo');
    } else if (category === 'text') {
      navigate('/patient-voicequiz');
    } else {
      navigate('/patient-home');
    }
  };

  const handleQuit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!isSubmittedRef.current) {
      const sessionSpent = (Date.now() - startTimeRef.current) / 1000;
      const totalAccumulated = initialAccumulatedTimeRef.current + sessionSpent;
      sessionStorage.setItem('currentQuizElapsedTime', String(totalAccumulated));
    } else {
      sessionStorage.removeItem('currentQuizElapsedTime');
    }

    sessionStorage.setItem('todayActivityQuit', 'true');

    const targetIndex = isSubmittedRef.current ? currentIndex + 1 : currentIndex;
    sessionStorage.setItem('currentQuizIndex', String(targetIndex));
    sessionStorage.setItem('completedActivityCount', String(totalSolvedCount));

    navigate('/patient-home');
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '1172px',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '100px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Header />

      <main
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '68px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          <div
            style={{
              width: '200px',
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
            <span style={{ fontWeight: 700, fontSize: '20px', color: '#F8F9FA' }}>
              Q{currentIndex + 1}. 객관식 퀴즈
            </span>
          </div>

          <h1
            style={{
              width: '100%',
              margin: '0 0 9px 0',
              fontWeight: 700,
              fontSize: '30px',
              lineHeight: '140%',
              color: '#0D0D0D',
              textAlign: 'left',
            }}
          >
            {currentQuiz.quiz_comment}
          </h1>
          <p
            style={{
              width: '100%',
              margin: '0 0 26px 0',
              fontWeight: 500,
              fontSize: '19px',
              lineHeight: '155%',
              color: '#797980',
              textAlign: 'left',
            }}
          >
            생각나시는 대로 편하게 선택해 주세요.
          </p>

          <div key={currentIndex} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {optionsList.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  style={{
                    width: '648px',
                    height: '86px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #DFDF87' : '1px solid #8E8E98',
                    backgroundColor: isSelected ? '#1566E0' : '#F8F9FA',
                    color: isSelected ? '#FFFFFF' : '#0D0D0D',
                    fontWeight: 400,
                    fontSize: '22px',
                    textAlign: 'left',
                    padding: '22px 32px',
                    boxSizing: 'border-box',
                    cursor: isSubmitted ? 'default' : 'pointer',
                    opacity: isSubmitted && !isSelected ? 0.5 : 1,
                    boxShadow: isSelected ? '0px 0px 4px 0px #2073E8' : '0px 0px 4px 0px #797980',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {`${idx + 1}번  ${optionText}`}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '60px', marginBottom: '20px' }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              style={{
                width: '139px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: isSubmitted ? '#8E8E98' : '#0F66E2',
                border: '1px solid #DFDF87',
                boxShadow: '0px 0px 4px 0px #4188ED',
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              ✓ 제출하기
            </button>
          </div>

          {isSubmitted && (
            <div style={{ marginTop: '20px', marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <QuizResultCard
                duration={elapsedTime}
                hintCount={totalHintCount}
                feedback={feedbackMessage}
                resultDescription={`지금까지 총 ${totalSolvedCount}문제를 완료하셨어요! 고생하셨습니다.`}
                showHintCount={true}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '648px', marginTop: '20px' }}>
            <button
              onClick={handleQuit}
              style={{
                width: '121px',
                height: '59px',
                borderRadius: '50px',
                backgroundColor: '#0D0D0D',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              그만하기
            </button>

            <button
              onClick={handleNextPage}
              style={{
                width: '151px',
                height: '59px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
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
    </div>
  );
}