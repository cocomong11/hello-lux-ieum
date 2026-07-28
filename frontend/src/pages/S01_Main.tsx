import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1920,
          margin: '0 auto',
        }}
      >
        <img
          alt='메인 화면'
          src={imgHeroMain}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '66.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 42,
            zIndex: 10,
          }}
        >
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
