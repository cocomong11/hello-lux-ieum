import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';

const DESIGN_W = 1920;
const DESIGN_H = 1171;

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
  const [scale, setScale] = useState(1);

  // 완료 여부 확인
  useEffect(() => {
    const completedStatus = sessionStorage.getItem('todayActivityCompleted');
    if (completedStatus === 'true') {
      setIsCompleted(true);
      sessionStorage.removeItem('todayActivityCompleted');
    } 
  }, []);

  useEffect(() => {
    const update = () => {
      const nextScale = Math.min(
        window.innerWidth / DESIGN_W,
        window.innerHeight / DESIGN_H,
        1,
      );

      setScale(nextScale);
    };

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#f8f9fa',
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          position: 'absolute',
          top: 0,
          left: '50%',
          transformOrigin: 'top center',
          transform: `translateX(-50%) scale(${scale})`,
          background: '#f8f9fa',
          ...F,
        }}
      >
        <Header />
        
        {/* ─── 인사말 및 날짜 영역 (가운데 정렬) ─── */}
        <div
          style={{
            position: 'absolute',
            left: 636,         
            top: 135,          
            width: 648,        
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',    
            textAlign: 'center',     
          }}
        >
          {/* 첫 번째 줄: 인사말 */}
          <p
            style={{
              ...F,
              margin: 0,
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.35,
              color: '#0d0d0d',
              whiteSpace: 'nowrap',
            }}
          >
            안녕하세요, 홍길동님!🖐️
          </p>

          {/* 두 번째 줄: 안내 문구 */}
          <p
            style={{
              ...F,
              margin: '22px 0 0',
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#4188ed',
              whiteSpace: 'nowrap',
            }}
          >
            오늘도 천천히 듣고 말하면서 기억을 떠올려볼까요?
          </p>

          {/* 三 번째 줄: 오늘 날짜 */}
          <p
            style={{
              ...F,
              margin: '21px 0 0',
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#797980',
              whiteSpace: 'nowrap',
            }}
          >
            {todayStr()}
          </p>
        </div>

        {/* ─── 오늘의 두뇌 활동 ─── */}
        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 350,
            margin: 0,
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
          }}
        >
          오늘의 두뇌 활동
        </p>

        {/* ─── 활동 카드 ─── */}
        <div
          style={{
            position: 'absolute',
            left: 636,
            top: 419,
            width: 648,
            height: 241,
            border: '1px solid #4188ed', 
            borderRadius: 10,
            boxShadow:  '0px 0px 4px 0px #4188ED',
            padding: '28px 29px',
            boxSizing: 'border-box',
            background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
          }}
        >
          <p
            style={{
              ...F,
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
            오늘의 인지 자극 활동 시작하기
          </p>

          <p
            style={{
              ...F,
              margin: '8px 0 0',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#797980',
            }}
          >
            건강 체크 → 음성 퀴즈 → 회상 활동 → 그림/노래 활동
          </p>

          {/* 우측 작은 원형 뱃지 동적 변경 ─── */}
          <button
            onClick={() => navigate('/mypage')}
            style={{
              ...F,
              position: 'absolute',
              top: 31,
              right: 29,
              width: 72, 
              height: 72,
              borderRadius: '50%',
              background: isCompleted ? '#DFDF87' : '#D9D9D9',
              border: '1.2px solid #0F66E2',
              borderStyle: isCompleted ? 'solid' : 'dashed', 
              cursor: 'pointer',
              fontSize: 19,
              fontWeight: 700,
              color: isCompleted ? '#0F66E2' : '#0D0D0D',
              boxShadow: '0px 0px 2.4px 0px #0F66E2', 
            }}
          >
            {isCompleted ? '완료!' : '미완료'}
          </button>

          {/* 활동 시작하기 버튼 */}
          <button
            disabled={isCompleted} 
            onClick={() => !isCompleted && navigate('/patient-check')}
            style={{
              ...F,
              position: 'absolute',
              left: 29,
              bottom: 28,
              width: 590,
              height: 81,
              borderRadius: 50,
              cursor: isCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isCompleted ? '1px solid #0D0D0D' : 'none',
              boxShadow: isCompleted ? '0px 0px 4px 0px #0D0D0D' : '0px 0px 4px 0px #4188ED',
              background: isCompleted ? '#0D0D0D' : '#0f66e2',
            }}
          >
            <span
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.55,
                color: '#f8f9fa',
              }}
            >
              {isCompleted ? '오늘 활동 완료' : '활동 시작하기'}
            </span>
          </button>
        </div>

        {/* ─── 오늘 이만큼 했어요 ─── */}
        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 720,
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
          }}
        >
          오늘 이만큼 했어요
        </p>

        {/* ─── 통계 카드 3개 (라벨 위 / 내용 아래 변경 적용) ─── */}
        {[
          {
            label: isCompleted ? '오늘의 건강 상태' : '건강 상태',
            left: 636,
            value: '-', 
          },
          {
            label: '진행한 활동',
            left: 856,
            value: isCompleted ? '5 / 5' : '0 / 5', 
          },
          {
            label: '성공률',
            left: 1076,
            value: isCompleted ? '100%' : '-', 
          },
        ].map((stat) => (
          <div
            key={stat.left}
            style={{
              position: 'absolute',
              left: stat.left,
              top: 782,
              width: 208,
              height: 124,
              background: '#D9D9D933',
              border: '1px solid #797980',
              boxShadow: '0px 0px 4px 0px #797980',
              borderRadius: 10,
              boxSizing: 'border-box',
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', 
            }}
          >
            {/* 라벨이 위로 이동 */}
            <p
              style={{
                ...F,
                margin: 0,
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
              }}
            >
              {stat.label}
            </p>

            {/* 내용(값)이 아래로 이동 */}
            <p
              style={{
                ...F,
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.35,
                color: isCompleted ? '#0d0d0d' : '#797980'
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}

        {/* ─── 하단 버튼: 이전 결과 보기 ─── */}
        <button
          onClick={() => navigate('/patient-result')}
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 966,
            width: 315,
            height: 70,
            background: '#f8f9fa',
            border: '1px solid #797980',
            boxShadow: '0px 0px 4px 0px #4188ED',
            borderRadius: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
             이전 결과 보기
          </span>
        </button>

        {/* ─── 하단 버튼: 내 연동 코드 보기 ─── */}
        <button
          onClick={() => navigate('/patient-journey')}
          style={{
            ...F,
            position: 'absolute',
            left: 969,
            top: 966,
            width: 315,
            height: 70,
            background: '#0D0D0D',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 4px #4188ed)',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#f8f9fa',
            }}
          >
            내 연동 코드 보기
          </span>
        </button>
      </div>
    </div>
  );
}