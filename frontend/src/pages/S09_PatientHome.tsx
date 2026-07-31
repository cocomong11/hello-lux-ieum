import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};


function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


function todayStr() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
}

export default function S09_PatientHome() {
  const navigate = useNavigate();

  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCodeClicked, setIsCodeClicked] = useState(false);

  const healthStatusValue = sessionStorage.getItem('todayHealthCondition') || '-';
  const pairCode = 'AB37X2';

  useEffect(() => {
    const todayKey = getTodayDateKey();
    const savedDate = sessionStorage.getItem('lastActivityDate');

   
    if (savedDate && savedDate !== todayKey) {
      sessionStorage.removeItem('todayActivityCompleted');
      sessionStorage.removeItem('todayActivityQuit');
      sessionStorage.removeItem('completedActivityCount');
      sessionStorage.removeItem('todayHealthCondition');
      sessionStorage.removeItem('totalHintCount');
      sessionStorage.removeItem('retryCount');
      
      // 날짜도 오늘 날짜로 새로 갱신
      sessionStorage.setItem('lastActivityDate', todayKey);
      
      setIsCompleted(false);
      setCompletedCount(0);
      return;
    }

    // 날짜가 같거나(오늘), 아직 진행 기록을 확인하는 로직
    const isDone = sessionStorage.getItem('todayActivityCompleted');
    const isQuit = sessionStorage.getItem('todayActivityQuit');
    const savedCount = sessionStorage.getItem('completedActivityCount');

    const count = savedCount ? parseInt(savedCount, 10) : 0;

    if (isDone !== null || isQuit !== null || count > 0) {
      setIsCompleted(true);
      setCompletedCount(count);
    } else {
      setIsCompleted(false);
      setCompletedCount(0);
    }
  }, []);

  
  const handleStartActivity = () => {
    const todayKey = getTodayDateKey();
    
    
    sessionStorage.setItem('lastActivityDate', todayKey);
    
    sessionStorage.setItem('completedActivityCount', '0');
    sessionStorage.setItem('totalHintCount', '0');
    sessionStorage.setItem('retryCount', '0');
    
    sessionStorage.removeItem('todayActivityCompleted');
    sessionStorage.removeItem('todayActivityQuit');

    navigate('/patient-check');
  };

  
  const handleResetAllData = () => {
    sessionStorage.clear();
    alert('모든 활동 데이터가 초기화되었습니다.');
    window.location.reload();
  };

  const successRate = completedCount > 0
    ? `${Math.round((completedCount / 7) * 100)}%`
    : '-';

  return (
    <div
      style={{
        ...F,
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        paddingBottom: '80px',
        overflowX: 'hidden',
      }}
    >
      <Header />

      <main
        style={{
          ...F,
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '60px',
          padding: '0 20px',
          boxSizing: 'border-box',
        }}
      >
        <section
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '36px',
          }}
        >
          <p style={{ ...F, margin: 0, fontSize: '28px', fontWeight: 700, lineHeight: '1.3', color: '#0d0d0d', whiteSpace: 'nowrap' }}>
            안녕하세요, 홍길동님!🖐️
          </p>
          <p style={{ ...F, margin: '8px 0 0', fontSize: '16px', fontWeight: 500, lineHeight: '1.4', color: '#4188ed', whiteSpace: 'nowrap' }}>
            오늘도 천천히 듣고 말하면서 기억을 떠올려볼까요?
          </p>
          <p style={{ ...F, margin: '8px 0 0', fontSize: '15px', fontWeight: 400, lineHeight: '1.4', color: '#797980', whiteSpace: 'nowrap' }}>
            {todayStr()}
          </p>
        </section>

        <h2 style={{ ...F, margin: '0 0 14px 0', fontSize: '27px', fontWeight: 700, lineHeight: '1.3', color: '#0d0d0d' }}>
          오늘의 두뇌 활동
        </h2>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            border: '1px solid #4188ed',
            borderRadius: '16px',
            boxShadow: '0px 0px 6px 0px #4188ED',
            padding: '24px 26px',
            boxSizing: 'border-box',
            background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
            marginBottom: '50px',
          }}
        >
          <p style={{ ...F, margin: 0, fontSize: '23px', fontWeight: 700, lineHeight: '1.3', color: '#0d0d0d' }}>
            오늘의 인지 자극 활동 시작하기
          </p>
          <p style={{ ...F, margin: '8px 0 0', fontSize: '14px', fontWeight: 400, lineHeight: '1.3', color: '#797980' }}>
            건강 체크 → 음성 퀴즈 → 회상 활동 → 그림/노래 활동
          </p>

          <button
            type="button"
            onClick={() => navigate('/mypage')}
            style={{
              ...F,
              position: 'absolute',
              top: '22px',
              right: '26px',
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: isCompleted ? '#DFDF87' : '#D9D9D9',
              border: isCompleted ? '1.5px solid #0F66E2' : '1.2px dashed #8E8E98',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              color: isCompleted ? '#0F66E2' : '#8E8E98',
              boxShadow: isCompleted ? '0px 0px 4px 0px #0F66E2' : 'none',
            }}
          >
            {isCompleted ? '완료' : '미완료'}
          </button>

          <button
            type="button"
            disabled={isCompleted}
            onClick={() => !isCompleted && handleStartActivity()}
            style={{
              ...F,
              position: 'absolute',
              left: '26px',
              bottom: '18px',
              width: 'calc(100% - 52px)',
              height: '60px',
              borderRadius: '50px',
              cursor: isCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isCompleted ? '1px solid #0D0D0D' : 'none',
              boxShadow: isCompleted ? '0px 0px 4px 0px #0D0D0D' : '0px 0px 4px 0px #4188ED',
              background: isCompleted ? '#0D0D0D' : '#0f66e2',
            }}
          >
            <span style={{ ...F, fontSize: '17px', fontWeight: 500, lineHeight: '1.3', color: '#f8f9fa' }}>
              {isCompleted ? '오늘 활동 완료' : '활동 시작하기'}
            </span>
          </button>
        </div>

        <h2 style={{ ...F, margin: '0 0 16px 0', fontSize: '22px', fontWeight: 700, lineHeight: '1.3', color: '#0d0d0d' }}>
          오늘 이만큼 했어요
        </h2>

        <div style={{ display: 'flex', width: '100%', gap: '16px', marginBottom: '30px' }}>
          {[
            {
              label: completedCount > 0 ? '오늘의 건강 상태' : '건강 상태',
              value: healthStatusValue,
            },
            {
              label: '진행한 활동',
              value: `${completedCount} / 7`,
            },
            {
              label: '성공률',
              value: successRate,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '108px',
                background: isCompleted ? '#4188ED0D' : 'rgba(217, 217, 217, 0.2)',
                border: isCompleted ? '1px solid #4188ED' : '1px solid #8E8E98',
                boxShadow: isCompleted ? '0px 0px 4px 0px #4188ED' : '0px 0px 4px 0px #797980',
                borderRadius: '12px',
                boxSizing: 'border-box',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '6px',
              }}
            >
              <p style={{ ...F, margin: 0, fontSize: '14px', fontWeight: 500, lineHeight: '1.2', color: isCompleted ? '#0D0D0D' : '#797980' }}>
                {stat.label}
              </p>
              <p style={{ ...F, margin: 0, fontSize: '24px', fontWeight: 700, lineHeight: '1.2', color: isCompleted ? '#0D0D0D' : '#797980' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '16px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/patient-result')}
            style={{
              ...F, flex: 1, height: '50px', background: '#ffffff', border: '1px solid #797980',
              boxShadow: '0px 0px 4px 0px #797980', borderRadius: '50px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ ...F, fontSize: '17px', fontWeight: 700, lineHeight: '1.3', color: '#0d0d0d' }}>
              이전 결과 보기
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCodeClicked(!isCodeClicked)}
            style={{
              ...F, flex: 1, height: '50px', background: isCodeClicked ? '#4188ED0D' : '#0D0D0D',
              border: isCodeClicked ? '1px solid #8E8E98' : 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              ...F, fontSize: isCodeClicked ? '19px' : '17px', fontWeight: 700,
              lineHeight: '1.3', letterSpacing: isCodeClicked ? '2px' : 'normal',
              color: isCodeClicked ? '#0D0D0D' : '#f8f9fa',
            }}>
              {isCodeClicked ? pairCode : '내 연동 코드 보기'}
            </span>
          </button>
        </div>

        {/* ⚙️ [테스트용 수동 초기화 버튼] */}
        <button
          type="button"
          onClick={handleResetAllData}
          style={{
            ...F,
            width: '100%',
            height: '44px',
            backgroundColor: '#FFF2F2',
            border: '1px dashed #FF4D4F',
            borderRadius: '12px',
            color: '#FF4D4F',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          [테스트용] 모든 데이터 초기화
        </button>
      </main>
    </div>
  );
}