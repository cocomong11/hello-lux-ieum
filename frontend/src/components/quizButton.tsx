import { useState, useRef, useEffect, type ChangeEvent } from 'react';

interface QuizVoiceControllerProps {
  onHintClick?: () => void;
  onRetryClick?: () => void;
  hintCount?: number;         
  placeholder: string;   
  onSuccessSubmit?: (duration: string, answer: string) => void; 
  showHintButton?: boolean; 
}

export default function QuizVoiceController({ 
  onHintClick, 
  onRetryClick,
  placeholder, 
  onSuccessSubmit,
  showHintButton = true 
}: QuizVoiceControllerProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [myAnswer, setMyAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); 
  
  const startTimeRef = useRef<number>(Date.now());
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

   
    if (sessionStorage.getItem('retryCount') === null) {
      sessionStorage.setItem('retryCount', '0');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicrophoneClick = () => {
    if (isSubmitted) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('현재 브라우저가 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop(); 
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'ko-KR'; 
        recognition.continuous = true; 
        recognition.interimResults = true; 

        recognition.onstart = () => {
          setIsRecording(true);
          setMyAnswer('음성 인식 중입니다...'); 
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const currentText = finalTranscript || interimTranscript;
          if (currentText.trim()) setMyAnswer(currentText); 
        };

        recognition.onerror = () => {
          setMyAnswer('인식에 실패했습니다.');
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setMyAnswer((prev) => (prev === '음성 인식 중입니다...' || prev.trim() === '' ? '' : prev));
        };

        recognition.start();
      } catch (error) {
        console.error('STT 초기화 에러:', error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;
    setMyAnswer(e.target.value);
  };

 
  const handleResetAnswer = () => {
    setMyAnswer(''); 
    setIsSubmitted(false);

   
    const currentRetry = parseInt(sessionStorage.getItem('retryCount') || '0', 10);
    const validRetry = isNaN(currentRetry) ? 0 : currentRetry;
    sessionStorage.setItem('retryCount', String(validRetry + 1));

    if (onRetryClick) {
      onRetryClick();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
    const cleanAnswer = myAnswer.trim();

    if (!cleanAnswer || cleanAnswer === '음성 인식 중입니다...') {
      alert("답변을 말씀하시거나 직접 입력해 주세요!");
      return;
    }

    setIsSubmitted(true);

    try {
      if (onSuccessSubmit) onSuccessSubmit(elapsed, cleanAnswer);
    } catch (error) {
      console.error("퀴즈 제출 실패:", error);
    }
  };

  return (
    <>
      <div style={{
        width: '648px', height: '335px', borderRadius: '10px', backgroundColor: '#4188ED0D',
        marginTop: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxSizing: 'border-box', paddingTop: '24px', position: 'relative'
      }}>
        <span style={{ fontSize: '18px', color: '#797980', textAlign: 'center', marginBottom: '37px',
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
        }}>
          아래 마이크를 누르고 말씀하시거나, 아래 칸에 직접 입력해 주세요.
        </span>

        <div onClick={handleMicrophoneClick} style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'linear-gradient(0deg, #0D0D0D, #0D0D0D)',
          border: '2px solid #0F66E2',
          boxShadow : '0px 0px 4px 20px #0F66E240, 0px 0px 4px 10px #0F66E280',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', 
          cursor: isSubmitted ? 'default' : 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '30px', color: '#FFFFFF', letterSpacing: '1px' }}>
            MIC
          </span>
        </div>

        <span style={{ fontWeight: 700, fontSize: '20px', color: '#0F66E2', marginBottom: '0px' }}>
          {isRecording ? '🔵 음성을 듣고 있어요...' : '🔵 마이크 대기 상태'}
        </span>

        <span style={{ fontSize: '16px', color: '#797980' }}>
          {isRecording ? '[음성 인식 중]' : '[버튼을 누르거나 직접 타이핑 하세요]'}
        </span>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: '22px', marginTop: '26px', marginBottom: '14px', color: '#0D0D0D' }}>
        나의 답변
      </h2>
      
      <div style={{
        width: '648px', height: '79px', borderRadius: '10px',
        border: '1px solid #4188ED', backgroundColor: '#4188ED0D', 
        boxShadow: '0px 0px 4px 0px #4188ED',
        display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box'
      }}>
        <input 
          type="text"
          value={myAnswer}
          onChange={handleInputChange}
          placeholder={placeholder}
          readOnly={isSubmitted}
          style={{
            width: '100%',
            fontSize: '20px',
            fontWeight: 500,
            color: '#0D0D0D',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            cursor: isSubmitted ? 'default' : 'text'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', width: '648px', marginTop: '26px', marginBottom: '40px' }}>
        <button onClick={handleResetAnswer} style={{ width: showHintButton ? '171px' : '300px', height: '46px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid #0D0D0D', boxShadow: '0px 0px 4px 0px #0F66E2', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          ↻ 다시 입력하기 
        </button>
        <button onClick={handleSubmit} style={{ width: showHintButton ? '139px' : '332px', height: '46px', borderRadius: '10px', backgroundColor: '#0F66E2', border: '1px solid #DFDF87', boxShadow: '0px 0px 4px 0px #4188ED', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: isSubmitted ? 'default' : 'pointer' }}>
          ✓ 제출하기
        </button>
        
        {showHintButton && (
          <button onClick={onHintClick} style={{ width: '145px', height: '46px', borderRadius: '10px', backgroundColor: '#DFDF87', border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED', fontFamily:"'Pretendard Variable', Pretendard, sans-serif", fontWeight:700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer' }}>
            💡 힌트 보기
          </button>
        )}
      </div>
    </>
  );
}