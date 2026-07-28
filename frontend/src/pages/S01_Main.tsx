import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

// ── 로컬 에셋 (frontend/src/assets/) ─────────────────────
import imgHeroMain from '../assets/main.png';
import imgBtnLogin from '../assets/mainarrow1.png';
import imgBtnStart from '../assets/mainarrow2.png';

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

export default function S01_Main() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        ...F,
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#ffffff',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* ════ 메인 통이미지 및 버튼 배치 영역 ════ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1920,
          margin: '0 auto',
        }}
      >
        {/* 통이미지 배경 */}
        <img
          alt='메인 화면'
          src={imgHeroMain}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />

        {/* 통이미지 내 버튼 위치에 정확히 얹어주는 영역 
            (💡 만약 위치를 미세조정하고 싶으시다면 bottom이나 left 수치를 살짝 바꿔보세요!) */}
        <div
          style={{
            position: 'absolute',
            bottom: '66.2%', // 이미지 하단에서의 거리
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 42,
            zIndex: 10,
          }}
        >
          {/* 시작하기 버튼 */}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={imgBtnStart}
              alt='시작하기'
              style={{ height: 50, objectFit: 'contain', display: 'block' }}
            />
          </button>

          {/* 로그인 버튼 */}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={imgBtnLogin}
              alt='로그인'
              style={{ height: 50, objectFit: 'contain', display: 'block' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
