import { useState, useRef } from 'react';

interface QuizVoiceControllerProps {
  onHintClick: () => void;
  hintCount: number;       
  placeholder: string;   
  onSuccessSubmit?: (duration: string) => void; 
  resultTitle: string;       
  resultDescription: string;
}

export default function QuizVoiceController({ 
  onHintClick, 
  hintCount, 
  placeholder, 
  onSuccessSubmit,
  resultTitle,       
  resultDescription
}: QuizVoiceControllerProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // 초기 상태는 따옴표 없이 순수 placeholder만 둡니다.
  const [myAnswer, setMyAnswer] = useState<string>(placeholder);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('0.0');

  const startTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  // 마이크 클릭
  const handleMicrophoneClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('현재 브라우저가 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); 
      }
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'ko-KR'; 
        recognition.continuous = true; 
        recognition.interimResults = true; 

        recognition.onstart = () => {
          startTimeRef.current = Date.now(); 
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
          if (currentText.trim()) {
            setMyAnswer(currentText); // 실시간 텍스트 반영
          }
        };

        recognition.onerror = (event: any) => {
          console.error('STT 인식 에러:', event.error);
          if (event.error === 'not-allowed') {
            alert('마이크 접근 권한을 승인해 주세요!');
          } else {
            setMyAnswer('인식에 실패했습니다. 다시 시도해 주세요.');
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setMyAnswer((prev) => {
            if (prev === '음성 인식 중입니다...' || prev.trim() === '') {
              return placeholder;
            }
            return prev;
          });
        };

        recognition.start();
      } catch (error) {
        console.error('STT 초기화 에러:', error);
      }
    }
  };

  const handleResetAnswer = () => {
    setMyAnswer(placeholder); 
    startTimeRef.current = 0;
    setDuration('0.0');
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    let elapsed = '0.0';
    if (startTimeRef.current > 0) {
      elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setDuration(elapsed);
    }

    const cleanAnswer = myAnswer.trim();

    if (!cleanAnswer || cleanAnswer === placeholder || cleanAnswer === '음성 인식 중입니다...') {
      alert("답변을 말씀하신 후 제출해 주세요!");
      return;
    }

    try {
      /*const response = await axios.post(`/api/quiz/1001/1/1/answer`, {
        quiz_num: 1,
        answer: cleanAnswer 
      });
      */
      
      setIsSubmitted(true);
      if (onSuccessSubmit) onSuccessSubmit(elapsed);
    } catch (error) {
      console.error("퀴즈 제출 실패:", error);
      alert("서버 전송에 실패했습니다.");
    }
  };

  return (
    <>
      {/* UI 영역은 기존 코드 유지하되, 화면에 뿌려줄 때만 이쁘게 따옴표를 붙여줍니다 */}
      <div style={{
        width: '648px', height: '335px', borderRadius: '10px', backgroundColor: '#4188ED0D',
        marginTop: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxSizing: 'border-box', paddingTop: '24px', position: 'relative'
      }}>
        <span style={{ fontSize: '18px', color: '#797980', textAlign: 'center', marginBottom: '37px' }}>
          아래 마이크를 누르고 말씀해 주세요.
        </span>

        <div
          onClick={handleMicrophoneClick}
          style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(0deg, #0D0D0D, #0D0D0D)',
            border: '2px solid #0F66E2',
            boxShadow : '0px 0px 4px 20px #0F66E240, 0px 0px 4px 10px #0F66E280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px', cursor: 'pointer', transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '30px', color: '#FFFFFF', letterSpacing: '1px' }}>
            {isRecording ? 'STOP' : 'MIC'}
          </span>
        </div>

        <span style={{ fontWeight: 700, fontSize: '20px', color: '#0F66E2', marginBottom: '0px' }}>
          {isRecording ? '🔵 음성을 듣고 있어요...' : '🔵 마이크 대기 상태'}
        </span>

        <span style={{ fontSize: '16px', color: '#797980' }}>
          {isRecording ? '[음성 인식 중]' : '[버튼을 누르면 녹음 시작]'}
        </span>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: '22px', marginTop: '26px', marginBottom: '14px', color: '#0D0D0D' }}>
        나의 답변
      </h2>
      <div style={{
        width: '648px', height: '79px', borderRadius: '10px',
        border: '1px solid #4188ED', backgroundColor: '#4188ED0D', boxShadow: '0px 0px 4px 0px #4188ED',
        display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box'
      }}>
        <p style={{ fontSize: '20px', fontWeight: 500, color: '#0D0D0D', margin: 0 }}>
          “{myAnswer}”
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', width: '648px', marginTop: '26px', marginBottom: '40px' }}>
        <button onClick={handleResetAnswer} style={{ width: '171px', height: '46px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid #0D0D0D', boxShadow: '0px 0px 4px 0px #0F66E2', fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          ↻ 다시 말하기
        </button>
        <button onClick={handleSubmit} style={{ width: '139px', height: '46px', borderRadius: '10px', backgroundColor: '#0F66E2', border: '1px solid #DFDF87', boxShadow: '0px 0px 4px 0px #4188ED', fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer' }}>
          ✓ 제출하기
        </button>
        <button onClick={onHintClick} style={{ width: '145px', height: '46px', borderRadius: '10px', backgroundColor: '#DFDF87', border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED', fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer' }}>
          💡 힌트 보기
        </button>
      </div>

      {isSubmitted && (
        <div style={{ height: '170px', width: '648px',  borderRadius: '10px', border: '1px solid #4188ED', boxShadow: '0px 0px 4px 0px #4188ED', background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)', boxSizing: 'border-box', padding: '24px 29px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '50px' }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 6px 0' }}>{resultTitle}</h3>
          <p style={{ fontWeight: 780, fontSize: '20px', lineHeight: '145%', color: '#0F66E2', margin: '0 0 12px 0' }}>{resultDescription}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: 700, color: '#797980' }}>
            <span>답변 소요 시간 : {duration}초</span>
            <span>힌트 사용 : {hintCount}회</span>
          </div>
        </div>
      )}
    </>
  );
}