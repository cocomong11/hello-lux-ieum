import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [scale, setScale] = useState(1);

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
        {/* ─── 인사말 ─── */}
        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 135,
            margin: 0,
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
          }}
        >
          안녕하세요, 홍길동님
        </p>

        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 193,
            margin: 0,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#4188ed',
            whiteSpace: 'nowrap',
          }}
        >
          오늘도 천천히 듣고 말하면서 기억을 떠올려볼까요?
        </p>

        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 236,
            margin: 0,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            whiteSpace: 'nowrap',
          }}
        >
          {todayStr()}
        </p>

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
            background: 'rgba(65,136,237,0.05)',
            border: '1px solid #4188ed',
            borderRadius: 10,
            boxShadow: '0 0 4px rgba(65,136,237,0.45)',
            padding: '28px 29px',
            boxSizing: 'border-box',
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

          {/* 우측 작은 원형 버튼 */}
          <button
            onClick={() => navigate('/mypage')}
            style={{
              ...F,
              position: 'absolute',
              top: 31,
              right: 29,
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: '#f8f9fa',
              border: '1px solid #4188ed',
              color: '#797980',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 4px rgba(65,136,237,0.35)',
            }}
          >
            마이룸
          </button>

          {/* 활동 시작하기 버튼 */}
          <button
            onClick={() => navigate('/patient-check')}
            style={{
              ...F,
              position: 'absolute',
              left: 29,
              bottom: 28,
              width: 590,
              height: 81,
              background: '#0f66e2',
              border: 'none',
              borderRadius: 50,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 4px rgba(65,136,237,0.45)',
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
              활동 시작하기
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

        {/* ─── 통계 카드 3개 ─── */}
        {[
          {
            left: 636,
            value: '-',
            label: '오늘 크기',
          },
          {
            left: 856,
            value: '0 / 5',
            label: '완료',
          },
          {
            left: 1076,
            value: '-',
            label: '설명',
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
              background: '#f8f9fa',
              border: '1px solid #797980',
              borderRadius: 10,
              boxSizing: 'border-box',
              padding: '20px 22px',
            }}
          >
            <p
              style={{
                ...F,
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#0d0d0d',
              }}
            >
              {stat.value}
            </p>

            <p
              style={{
                ...F,
                margin: '14px 0 0',
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}

        {/* ─── 하단 버튼: 이전 결과 보기 ─── */}
        <button
          onClick={() => navigate('/patient-results')}
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 966,
            width: 315,
            height: 70,
            background: '#f8f9fa',
            border: '1px solid #797980',
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

        {/* ─── 하단 버튼: 내 여정 보러가기 ─── */}
        <button
          onClick={() => navigate('/patient-journey')}
          style={{
            ...F,
            position: 'absolute',
            left: 969,
            top: 966,
            width: 315,
            height: 70,
            background: '#0f66e2',
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
            내 여정 보러가기
          </span>
        </button>
      </div>
    </div>
  );
}
