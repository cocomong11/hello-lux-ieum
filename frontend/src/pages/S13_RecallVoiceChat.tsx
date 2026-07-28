import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';

export default function S13_RecallVoiceChat() {
  const navigate = useNavigate();

  // 상태 관리
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('0.0');

  const startTimeRef = useRef<number>(0);
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // 제출 처리
  const handleSubmit = () => {
    if (isSubmitted) return;
    if (selectedOption === null) {
      alert('정답을 선택해 주세요!');
      return;
    }

    if (startTimeRef.current > 0) {
      const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setDuration(elapsed);
    }

    setIsSubmitted(true);
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

          {/* 상단 뱃지 */}
          <div style={{
            width: '184px', height: '42px', borderRadius: '50px', background: '#4188ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box', marginBottom: '26px'
          }}>
            <span style={{ fontWeight: 700, fontSize: '22px', color: '#F8F9FA' }}>
              회상형 음성 대화
            </span>
          </div>

          {/* 메인 질문 */}
          <h1 style={{
            width: '100%', margin: '0 0 9px 0', fontWeight: 700,
            fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', textAlign: 'left'
          }}>
            고향에서 가장 기억에 남는 장소는 어디인가요?
          </h1>
          <p style={{
            width: '100%', margin: '0 0 26px 0', fontWeight: 400,
            fontSize: '19px', lineHeight: '155%', color: '#797980', textAlign: 'left'
          }}>
            생각나시는 대로 편하게 선택해 주세요.
          </p>

          {/* 문제 듣기 */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '154px', height: '46px', borderRadius: '10px',
              border: isPlaying ? '1px solid #DFDF87' : '1px solid #0F66E2', 
              background: isPlaying ? '#0F66E2' : '#4188ED0D', 
              boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontWeight: 700, fontSize: '18px',
              color: isPlaying ? '#FFFFFF' : '#0F66E2', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '32px'
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

          {/* 객관식 선택지 */}
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
                    border: isSelected ? '1px solid #DFDF87': '1px solid #8E8E98',
                    backgroundColor: isSelected ? '#1566E0' : '#F8F9FA',
                    color: isSelected ? '#FFFFFF' : '#0D0D0D',
                    fontWeight: 400,
                    fontSize: '22px',
                    textAlign: 'left',
                    padding: '22px 32px',
                    boxSizing: 'border-box',
                    cursor: isSubmitted ? 'default' : 'pointer',
                    opacity: isSubmitted && !isSelected ? 0.6 : 1,
                    boxShadow: isSelected ? '0px 0px 4px 0px #2073E8' : '0px 0px 4px 0px #797980' ,
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
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '60px', marginBottom: '40px' }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              style={{
                width: '139px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: isSubmitted ? '#797980' : '#0F66E2',
                border: '1px solid #DFDF87',
                boxShadow: '0px 0px 4px 0px #4188ED',
                padding: '6px 19px',
                gap: '10px',
                boxSizing: 'border-box',
                fontWeight: 700,
                fontSize: '18px',
                color: '#FFFFFF',
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✓ {isSubmitted ? '제출완료' : '제출하기'}
            </button>
          </div>

          {/* 제출 완료 카드 */}
          {isSubmitted && (
            <div style={{
              height: '170px', width: '648px', borderRadius: '10px',
              border: '1px solid #4188ED', boxShadow: '0px 0px 4px 0px #4188ED',
              background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
              boxSizing: 'border-box', padding: '24px 29px', display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', marginBottom: '40px'
            }}>
              <h3 style={{ fontWeight: 700, fontSize: '30px', lineHeight: '140%', color: '#0D0D0D', margin: '0 0 6px 0' }}>
                대화 완료!
              </h3>
              <p style={{ fontWeight: 780, fontSize: '20px', lineHeight: '145%', color: '#0F66E2', margin: '0 0 12px 0' }}>
                멋진 이야기예요!
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: 700, color: '#797980' }}>
                <span>답변 소요 시간 : {duration}초</span>
              </div>
            </div>
          )}

          {/* 하단 페이지 이동 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '648px' }}>
            <button 
              onClick={() => navigate('/patient-home')}
              style={{
                width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
                border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
                fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
              }}>
              그만하기
            </button>

            <button
              onClick={() => navigate('/patient-result')}
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