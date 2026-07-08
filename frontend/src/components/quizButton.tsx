import { useState, useRef } from 'react';

interface QuizVoiceControllerProps {
  onHintClick: () => void; // 힌트 팝업 열기 함수
  hintCount: number;       // 현재 힌트 사용 횟수
  placeholder: string;   
  onSuccessSubmit?: (duration: string) => void; 
}

export default function QuizVoiceController({ 
  onHintClick, 
  hintCount, 
  placeholder, 
  onSuccessSubmit 
}: QuizVoiceControllerProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [myAnswer, setMyAnswer] = useState<string>(placeholder);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('0.0');

  //  답변 시간 측정 및 녹음 데이터용 
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 마이크 클릭 핸들러
  const handleMicrophoneClick = async () => {
    if (isRecording) {
      // 1. 녹음 중지 동작
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      
     
      setMyAnswer('“오월 이십육일이요”'); 
    } else {
      // 2. 녹음 시작 동작
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // .wav 형태의 오디오 파일(Blob)이 생성
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          console.log('생성된 오디오 블롭(.wav):', audioBlob);
          
          //STT API 연동 코드
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        startTimeRef.current = Date.now(); // 타이머 시작
        setIsRecording(true);
        setMyAnswer('“음성 녹음 중입니다...”');
      } catch (error) {
        console.error('마이크 권한 에러:', error);
        alert('마이크 접근 권한을 승인해 주세요!');
      }
    }
  };

  // ↻ 다시 말하기 
  const handleResetAnswer = () => {
    setMyAnswer(placeholder); 
    startTimeRef.current = 0;
    setDuration('0.0');
    setIsSubmitted(false);
  };

  // ✓ 제출하기
  const handleSubmit = () => {
    let elapsed = '0.0';
    if (startTimeRef.current > 0) {
      elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setDuration(elapsed);
    } else {
      setDuration('0.0');
    }
    setIsSubmitted(true);
    if (onSuccessSubmit) onSuccessSubmit(elapsed);
  };

  return (
    <>
      
      

      {/* 마이크 안내 박스 */}
      <div style={{
        width: '648px', height: '335px', borderRadius: '10px', backgroundColor: '#4188ED0D',
        marginTop: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxSizing: 'border-box', paddingTop: '24px', position: 'relative'
      }}>
        <span style={{ fontSize: '18px', color: '#797980', textAlign: 'center', marginBottom: '37px' }}>
          {isRecording ? '답변을 마친 후 마이크를 다시 눌러주세요.' : '아래 마이크를 누르고 말씀해 주세요.'}
        </span>

        <div
          onClick={handleMicrophoneClick}
          style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: isRecording ? 'linear-gradient(0deg, #E22020, #FF4D4D)' : 'linear-gradient(0deg, #0D0D0D, #0D0D0D)',
            border: isRecording ? '2px solid #E22020' : '2px solid #0F66E2',
            boxShadow: isRecording ? '0px 0px 12px 25px rgba(226, 32, 32, 0.3)' : '0px 0px 4px 20px #0F66E240, 0px 0px 4px 10px #0F66E280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px', cursor: 'pointer', transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '30px', color: '#FFFFFF', letterSpacing: '1px' }}>
            {isRecording ? 'STOP' : 'MIC'}
          </span>
        </div>

        <span style={{ fontWeight: 700, fontSize: '20px', color: isRecording ? '#E22020' : '#0F66E2', marginBottom: '0px' }}>
          {isRecording ? '🔴 음성을 녹음하고 있어요...' : '🔵 마이크 대기 상태'}
        </span>

        <span style={{ fontSize: '16px', color: '#797980' }}>
          {isRecording ? '[실제 음성 녹음 중]' : '[버튼을 누르면 녹음 시작]'}
        </span>
      </div>

      {/* 나의 답변 영역 */}
      <h2 style={{ fontWeight: 700, fontSize: '22px', marginTop: '26px', marginBottom: '14px', color: '#0D0D0D' }}>
        나의 답변
      </h2>
      <div style={{
        width: '648px', height: '79px', borderRadius: '10px',
        border: '1px solid #4188ED', backgroundColor: '#4188ED0D', boxShadow: '0px 0px 4px 0px #4188ED',
        display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box'
      }}>
        <p style={{ fontSize: '20px', fontWeight: 500, color: '#0D0D0D', margin: 0 }}>
          {myAnswer}
        </p>
      </div>

      {/* ⚙️ 제어 버튼 삼총사 */}
      <div style={{ display: 'flex', gap: '16px', width: '648px', marginTop: '26px', marginBottom: '40px' }}>
        <button
          onClick={handleResetAnswer}
          style={{
            width: '171px', height: '46px', borderRadius: '10px', backgroundColor: '#F8F9FA',
            border: '1px solid #0D0D0D', boxShadow: '0px 0px 4px 0px #0F66E2',
            fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
        >
          ↻ 다시 말하기
        </button>

        <button
          onClick={handleSubmit}
          style={{
            width: '139px', height: '46px', borderRadius: '10px', backgroundColor: '#0F66E2',
            border: '1px solid #DFDF87', boxShadow: '0px 0px 4px 0px #4188ED',
            fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
          }}
        >
          ✓ 제출하기
        </button>

        <button
          onClick={onHintClick}
          style={{
            width: '145px', height: '46px', borderRadius: '10px', backgroundColor: '#DFDF87',
            border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #4188ED',
            fontFamily: 'Pretendard Variable', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', cursor: 'pointer'
          }}
        >
          💡 힌트 보기
        </button>
      </div>

      {/* 📊 정답 결과 리포트 박스 (제출하기 버튼 눌렀을 때 나오는 박스*/}
      {isSubmitted && (
        <div style={{
          width: '648px', height: '170px', borderRadius: '10px', border: '1px solid #4188ED',
          boxShadow: '0px 0px 4px 0px #4188ED',
          background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
          boxSizing: 'border-box', padding: '24px 29px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '50px'
        }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 6px 0' }}>
            정답입니다!
          </h3>
          <p style={{ fontWeight: 700, fontSize: '22px', lineHeight: '155%', color: '#0F66E2', margin: '0 0 12px 0' }}>
            잘하셨어요! 질문에 정확히 답변해 주셨어요.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '16px', fontWeight: 700, color: '#797980' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '110px' }}>답변 소요 시간 :</span>
              <span>{duration}초</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '85px' }}>힌트 사용 :</span>
              <span style={{ fontSize: '18px' }}>{hintCount}회</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}