import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import { 
  getPatientMe, 
  getDailyStatus, 
  type PatientMeResponse, 
  type DailyStatusResponse 
} from '../api/patientApi';
import { api } from '../api/client';

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

interface UserInfoResponse {
  name?: string;
  patientCode?: string;
  p_code?: string;
  user_email?: string;
  role?: string;
}

function todayStr() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
}

function getTodayIsoString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formatHealthStatus = (status: string | null | undefined) => {
  if (!status || status === '-') return '-';
  switch (status) {
    case 'good':
    case '좋음':
      return '좋음';
    case 'normal':
    case '보통':
      return '보통';
    case 'bad':
    case '나쁨':
    case '좋지 않음':
      return '나쁨';
    default:
      return status;
  }
};

export default function S09_PatientHome() {
  const navigate = useNavigate();

  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCodeClicked, setIsCodeClicked] = useState(false);
  const [healthStatusValue, setHealthStatusValue] = useState<string>('-');

  const [patientName, setPatientName] = useState<string>(() => {
    return sessionStorage.getItem('name') || sessionStorage.getItem('patientName') || '환자';
  });

  const [pairCode, setPairCode] = useState<string>(() => {
    return sessionStorage.getItem('p_code') || sessionStorage.getItem('pCode') || '-------';
  });

  
  const syncStorageState = useCallback(() => {
    const currentPCode = sessionStorage.getItem('p_code') || sessionStorage.getItem('pCode');

    if (currentPCode) {
      const savedCount = sessionStorage.getItem(`completedActivityCount_${currentPCode}`) || sessionStorage.getItem('completedActivityCount');
      const count = savedCount ? parseInt(savedCount, 10) : 0;

      const isDone = sessionStorage.getItem(`todayActivityCompleted_${currentPCode}`);
      const savedHealth = sessionStorage.getItem(`todayHealthCondition_${currentPCode}`) || sessionStorage.getItem('conditionStatus');

      setHealthStatusValue(formatHealthStatus(savedHealth));
      setCompletedCount(count);
      setIsCompleted(isDone === 'true');
    } else {
      const savedCount = sessionStorage.getItem('completedActivityCount');
      const count = savedCount ? parseInt(savedCount, 10) : 0;
      const isDone = sessionStorage.getItem('todayActivityCompleted');
      const savedHealth = sessionStorage.getItem('conditionStatus');

      setHealthStatusValue(formatHealthStatus(savedHealth));
      setCompletedCount(count);
      setIsCompleted(isDone === 'true');
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      let internalCode: number | string | undefined = sessionStorage.getItem('internalCode') || undefined;
      let pCode: string | undefined = sessionStorage.getItem('p_code') || sessionStorage.getItem('pCode') || undefined;

      
      try {
        const userData = await api.get<UserInfoResponse>('/auth/me');
        if (userData?.name) {
          setPatientName(userData.name);
          sessionStorage.setItem('name', userData.name);
        }
      } catch (err) {
        console.warn('사용자 프로필 조회 실패:', err);
      }

      
      try {
        const meRes: PatientMeResponse = await getPatientMe();
        if (meRes) {
          internalCode = meRes.internal_code ?? meRes.internalCode ?? internalCode;
          pCode = meRes.p_code ?? meRes.pCode ?? pCode;

          if (internalCode) sessionStorage.setItem('internalCode', String(internalCode));
          if (pCode) {
            setPairCode(pCode);
            sessionStorage.setItem('p_code', pCode);
          }
        }
      } catch (err) {
        console.warn('getPatientMe() 조회 실패:', err);
      }

      
      syncStorageState();

      
      const targetPatientId = internalCode || pCode;
      if (targetPatientId) {
        try {
          const today = getTodayIsoString();
          const dailyData: DailyStatusResponse = await getDailyStatus(targetPatientId, today);

          if (dailyData && dailyData.health_condition) {
            const formatted = formatHealthStatus(dailyData.health_condition);
            setHealthStatusValue(formatted);
            
            if (pCode) {
              sessionStorage.setItem(`todayHealthCondition_${pCode}`, dailyData.health_condition);
            }
          }
        } catch (err) {
          setHealthStatusValue('-');
        }
      }
    };

    fetchInitialData();
  }, [syncStorageState]);

  
  const handleStartActivity = () => {
    const quizListStr = sessionStorage.getItem('quizList');

    if (quizListStr) {
      try {
        const quizList = JSON.parse(quizListStr);
        
        if (Array.isArray(quizList) && quizList.length > 0) {
          let currentIndex = Number(sessionStorage.getItem('currentQuizIndex') || '0');
          
          if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= quizList.length) {
            currentIndex = 0;
            sessionStorage.setItem('currentQuizIndex', '0');
          }

          const currentQuiz = quizList[currentIndex];

         
          const rawCategory = 
            currentQuiz?.quizCategory || 
            currentQuiz?.quiz_category || 
            currentQuiz?.category || 
            currentQuiz?.type || 
            'choice';

          const category = String(rawCategory).toLowerCase().trim();

          
          let targetRoute = '/patient-voicechat'; 

          if (category.includes('photo') || category.includes('picture') || category.includes('image')) {
            targetRoute = '/patient-photo';
          } else if (category.includes('text') || category.includes('voice') || category.includes('subjective')) {
            targetRoute = '/patient-voicequiz';
          } else if (category.includes('choice') || category.includes('multiple')) {
            targetRoute = '/patient-voicechat';
          }

          navigate(targetRoute);
          return;
        }
      } catch (e) {
        console.error('퀴즈 데이터 파싱 실패:', e);
      }
    }

    
    const keysToRemove = [
      'totalHintCount',
      'completedActivityCount',
      'currentQuizIndex',
      'retryCount',
      'speakRetryCount',
      'todayActivityCompleted',
      'todayActivityQuit',
      'correctQuizCount',
    ];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));

    navigate('/patient-check');
  };

  const handleReset = () => {
    const currentPCode = sessionStorage.getItem('p_code') || sessionStorage.getItem('pCode');

    const generalKeys = [
      'conditionStatus',
      'sleepStatus',
      'moodStatus',
      'quizList',
      'recallScore',
      'musicScore',
      'drawingScore',
      'totalHintCount',
      'completedActivityCount',
      'retryCount',
      'speakRetryCount',
      'currentQuizIndex',
      'correctQuizCount',
      'currentQuizElapsedTime',
      'todayActivityCompleted',
      'todayActivityQuit',
    ];
    generalKeys.forEach((key) => sessionStorage.removeItem(key));

    if (currentPCode) {
      sessionStorage.removeItem(`todayActivityCompleted_${currentPCode}`);
      sessionStorage.removeItem(`completedActivityCount_${currentPCode}`);
      sessionStorage.removeItem(`todayHealthCondition_${currentPCode}`);
    }

    setIsCompleted(false);
    setCompletedCount(0);
    setHealthStatusValue('-');

    alert('오늘 활동 기록이 초기화되었습니다.');
  };

  const successRate = completedCount > 0 
    ? `${Math.round((completedCount / 7) * 100)}%` 
    : '0%';

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
          marginTop: '30px',
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
          <p
            style={{
              ...F,
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: '1.3',
              color: '#0d0d0d',
              whiteSpace: 'nowrap',
            }}
          >
            안녕하세요, {patientName}님!🖐️
          </p>
          <p
            style={{
              ...F,
              margin: '8px 0 0',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '1.4',
              color: '#4188ed',
              whiteSpace: 'nowrap',
            }}
          >
            오늘도 천천히 듣고 말하면서 기억을 떠올려볼까요?
          </p>
          <p
            style={{
              ...F,
              margin: '8px 0 0',
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: '1.4',
              color: '#797980',
              whiteSpace: 'nowrap',
            }}
          >
            {todayStr()}
          </p>
        </section>

        <h2
          style={{
            ...F,
            margin: '0 0 14px 0',
            fontSize: '27px',
            fontWeight: 700,
            lineHeight: '1.3',
            color: '#0d0d0d',
          }}
        >
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
            background:
              'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
            marginBottom: '50px',
          }}
        >
          <p
            style={{
              ...F,
              margin: 0,
              fontSize: '23px',
              fontWeight: 700,
              lineHeight: '1.3',
              color: '#0d0d0d',
            }}
          >
            오늘의 인지 자극 활동 시작하기
          </p>
          <p
            style={{
              ...F,
              margin: '8px 0 0',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '1.3',
              color: '#797980',
            }}
          >
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
              border: isCompleted
                ? '1.5px solid #0F66E2'
                : '1.2px dashed #8E8E98',
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
            onClick={handleStartActivity}
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
              boxShadow: isCompleted
                ? '0px 0px 4px 0px #0D0D0D'
                : '0px 0px 4px 0px #4188ED',
              background: isCompleted ? '#0D0D0D' : '#0f66e2',
            }}
          >
            <span
              style={{
                ...F,
                fontSize: '17px',
                fontWeight: 500,
                lineHeight: '1.3',
                color: '#f8f9fa',
              }}
            >
              {isCompleted ? '오늘 활동 완료' : '활동 시작하기'}
            </span>
          </button>
        </div>

        <h2
          style={{
            ...F,
            margin: '0 0 16px 0',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '1.3',
            color: '#0d0d0d',
          }}
        >
          오늘 이만큼 했어요
        </h2>

        <div
          style={{
            display: 'flex',
            width: '100%',
            gap: '16px',
            marginBottom: '30px',
          }}
        >
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
                background: completedCount > 0 || isCompleted
                  ? '#4188ED0D'
                  : 'rgba(217, 217, 217, 0.2)',
                border: completedCount > 0 || isCompleted ? '1px solid #4188ED' : '1px solid #8E8E98',
                boxShadow: completedCount > 0 || isCompleted
                  ? '0px 0px 4px 0px #4188ED'
                  : '0px 0px 4px 0px #797980',
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
              <p
                style={{
                  ...F,
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  color: completedCount > 0 || isCompleted ? '#0D0D0D' : '#797980',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  ...F,
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: '1.2',
                  color: completedCount > 0 || isCompleted ? '#0D0D0D' : '#797980',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/patient-result')}
            style={{
              ...F,
              flex: 1,
              height: '50px',
              background: '#ffffff',
              border: '1px solid #797980',
              boxShadow: '0px 0px 4px 0px #797980',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                ...F,
                fontSize: '17px',
                fontWeight: 700,
                lineHeight: '1.3',
                color: '#0d0d0d',
              }}
            >
              이전 결과 보기
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCodeClicked(!isCodeClicked)}
            style={{
              ...F,
              flex: 1,
              height: '50px',
              background: isCodeClicked ? '#4188ED0D' : '#0D0D0D',
              border: isCodeClicked ? '1px solid #8E8E98' : 'none',
              boxShadow: '0px 0px 4px 0px #4188ED',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                ...F,
                fontSize: isCodeClicked ? '19px' : '17px',
                fontWeight: 700,
                lineHeight: '1.3',
                letterSpacing: isCodeClicked ? '2px' : 'normal',
                color: isCodeClicked ? '#0D0D0D' : '#f8f9fa',
              }}
            >
              {isCodeClicked ? pairCode : '내 연동 코드 보기'}
            </span>
          </button>
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              ...F,
              padding: '10px 20px',
              backgroundColor: '#DC3545',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            오늘 기록 초기화 (테스트용)
          </button>
        </div>
      </main>
    </div>
  );
}