import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import QuizResultCard from '../components/quizResultCard';

export default function S13_RecallVoiceChat() {
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

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('0.0');

 
  const [totalSolvedCount, setTotalSolvedCount] = useState<number>(() => {
    const saved = sessionStorage.getItem('completedActivityCount');
    return saved ? parseInt(saved, 10) : 0;
  });

 
  const [totalHintCount] = useState<number>(() => {
    const savedHints = sessionStorage.getItem('totalHintCount');
    return savedHints ? parseInt(savedHints, 10) : 0;
  });

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

 
  const handleSubmit = () => {
    if (selectedOption === null) {
      alert('정답을 선택해 주세요!');
      return;
    }

    if (startTimeRef.current > 0) {
      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setElapsedTime(elapsed);
    }

    if (!isSubmitted) {
      const nextSolvedCount = totalSolvedCount + 1;
      setTotalSolvedCount(nextSolvedCount);
      
      sessionStorage.setItem('completedActivityCount', String(nextSolvedCount));
      setIsSubmitted(true);
    }
  };

 
  const handleNextPage = () => {
    sessionStorage.setItem('todayActivityCompleted', 'true');
    navigate('/patient-result');
  };

  
  const handleQuit = () => {
    sessionStorage.setItem('todayActivityQuit', 'true');
    sessionStorage.setItem('completedActivityCount', String(totalSolvedCount));
    navigate('/patient-home');
  };

  return (
    <div style={{
      width: '100vw', minHeight: '1172px', backgroundColor: '#F8F9FA',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingBottom: '100px', boxSizing: 'border-box', overflowX: 'hidden' 
    }}>
      <Header />

      <main style={{
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginTop: '68px', boxSizing: 'border-box'
      }}>
        <div style={{ width: '648px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          
          <div style={{
            width: '184px', height: '42px', borderRadius: '50px', background: '#4188ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box', marginBottom: '26px'
          }}>
            <span style={{ fontWeight: 700, fontSize: '22px', color: '#F8F9FA' }}>
              회상형 음성 대화
            </span>
          </div>

          
          <h1 style={{
            width: '100%', margin: '0 0 9px 0', fontWeight: 700,
            fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', textAlign: 'left'
          }}>
            고향에서 가장 기억에 남는 장소는 어디인가요?
          </h1>
          <p style={{
            width: '100%', margin: '0 0 26px 0', fontWeight: 500,
            fontSize: '19px', lineHeight: '155%', color: '#797980', textAlign: 'left'
          }}>
            생각나시는 대로 편하게 선택해 주세요.
          </p>

          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {['1번  슈퍼마켓', '2번  집', '3번  공원', '4번  우물가'].map((option, idx) => {
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
                    alignItems: 'center'
                  }}
                >
                  {option}
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
                justifyContent:'center',
                transition: 'all 0.2s ease'
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
                resultDescription={`지금까지 총 ${totalSolvedCount}문제를 완료하셨어요! 고생하셨습니다.`}
                showHintCount={true}
              />
            </div>
          )}

          {/* 하단 페이지 이동 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '648px', marginTop: '20px' }}>
            <button 
              onClick={handleQuit}
              style={{
                width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
                border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
                fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
              }}>
              그만하기
            </button>

            <button
              onClick={handleNextPage}
              style={{
                width: '151px', height: '59px', borderRadius: '50px', backgroundColor: '#4188ED',
                border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
                fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
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