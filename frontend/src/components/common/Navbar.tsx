import { useNavigate } from 'react-router-dom';
import logoSrc from '../../assets/images/S-01/Group 15.png';

const HEADER_HEIGHT = 68;

export default function Navbar() {
  const navigate = useNavigate();

  const linkStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#797980',
    cursor: 'pointer',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    padding: '10px 0',
  };

  return (
    <header
      style={{
        background:
          'linear-gradient(90deg, #f6fbf5 0%, #fbfdfb 42%, #f5faff 68%, #fbfdf9 100%)',
        borderBottom: '1px solid rgba(191, 216, 244, 0.56)',
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 1200,
          maxWidth: 'calc(100% - 48px)',
          height: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type='button'
          aria-label='홈으로 이동'
          onClick={() => navigate('/')}
          style={{
            width: 72,
            height: 29,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'block',
          }}
        >
          <span
            aria-hidden='true'
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              backgroundColor: '#2073e8',
              WebkitMask: `url("${logoSrc}") center / contain no-repeat`,
              mask: `url("${logoSrc}") center / contain no-repeat`,
            }}
          />
        </button>

        <nav
          aria-label='주요 메뉴'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 30,
          }}
        >
          <button type='button' onClick={() => navigate('/')} style={linkStyle}>
            홈
          </button>
          <button type='button' onClick={() => navigate('/login')} style={linkStyle}>
            로그인
          </button>
        </nav>
      </div>
    </header>
  );
}
