import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader'; 
const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

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
  const [isCodeClicked, setIsCodeClicked] = useState(false);

  const healthStatusValue = '좋음';
  const pairCode = 'AB37X2';

  useEffect(() => {
    const completedStatus = sessionStorage.getItem('todayActivityCompleted');
    if (completedStatus === 'true') {
      setIsCompleted(true);
     
    }
  }, []);

  return (
    <div
      style={{
        ...F,
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        paddingBottom: '80px',
      }}
    >
      {/* ─── 1. 상단 슬림 Navbar (Header로 수정) ─── */}
      <Header />

      {/* ─── 2. 메인 콘텐츠 영역 (이미지 비율 중앙 700px) ─── */}
      <main
        style={{
          ...F,
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '60px',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단 인사말 */}
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
            안녕하세요, 홍길동님! 👋
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

        {/* 오늘의 두뇌 활동 */}
        <h2
          style={{
            ...F,
            margin: '0 0 14px 0',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '1.3',
            color: '#0d0d0d',
          }}
        >
          오늘의 두뇌 활동
        </h2>

        {/* 대형 카드 */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '190px',
            border: '1px solid #4188ed',
            borderRadius: '16px',
            boxShadow: '0px 0px 6px 0px #4188ED',
            padding: '24px 26px',
            boxSizing: 'border-box',
            background:
              'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
            marginBottom: '36px',
          }}
        >
          <p
            style={{
              ...F,
              margin: 0,
              fontSize: '19px',
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
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isCompleted ? '#DFDF87' : '#D9D9D9',
              border: '1.2px solid #0F66E2',
              borderStyle: isCompleted ? 'solid' : 'dashed',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: isCompleted ? '#0F66E2' : '#0D0D0D',
              boxShadow: '0px 0px 2.4px 0px #0F66E2',
            }}
          >
            {isCompleted ? '완료!' : '미완료'}
          </button>

          <button
            type="button"
            disabled={isCompleted}
            onClick={() => !isCompleted && navigate('/patient-check')}
            style={{
              ...F,
              position: 'absolute',
              left: '26px',
              bottom: '20px',
              width: 'calc(100% - 52px)',
              height: '50px',
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
                fontWeight: 700,
                lineHeight: '1.3',
                color: '#f8f9fa',
              }}
            >
              {isCompleted ? '오늘 활동 완료' : '활동 시작하기'}
            </span>
          </button>
        </div>

        {/* 오늘 이만큼 했어요 */}
        <h2
          style={{
            ...F,
            margin: '0 0 14px 0',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '1.3',
            color: '#0d0d0d',
          }}
        >
          오늘 이만큼 했어요
        </h2>

        {/* 통계 상자 */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          {[
            {
              label: isCompleted ? '오늘의 건강 상태' : '건강 상태',
              value: isCompleted ? healthStatusValue : '-',
            },
            {
              label: '진행한 활동',
              value: isCompleted ? '5 / 5' : '0 / 5',
            },
            {
              label: '성공률',
              value: isCompleted ? '100%' : '-',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '108px',
                background: isCompleted
                  ? '#4188ED0D'
                  : 'rgba(217, 217, 217, 0.2)',
                border: isCompleted ? '1px solid #4188ED' : '1px solid #8E8E98',
                boxShadow: isCompleted
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
                  color: isCompleted ? '#0D0D0D' : '#797980',
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
                  color: isCompleted ? '#0D0D0D' : '#797980',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* 하단 버튼 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: '16px',
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
      </main>
    </div>
  );
}