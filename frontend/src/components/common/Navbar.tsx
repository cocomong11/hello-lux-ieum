import { useLocation, useNavigate } from 'react-router-dom';
import logoSrc from '../../assets/logo.png';

const HEADER_HEIGHT = 68;

// 이 경로들에서만 '로그인'을 표시, 그 외 모든 페이지는 '마이페이지'를 표시
const AUTH_PATHS = ['/', '/login', '/register'];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const showLogin = AUTH_PATHS.includes(location.pathname);

  const linkStyle = (active: boolean): React.CSSProperties => ({
    background: 'transparent',
    border: 'none',
    color: active ? '#2073e8' : '#797980',
    cursor: 'pointer',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    padding: '10px 0',
  });

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
          <button
            type='button'
            onClick={() => navigate('/')}
            style={linkStyle(location.pathname === '/')}
          >
            홈
          </button>
          {showLogin ? (
            <button
              type='button'
              onClick={() => navigate('/login')}
              style={linkStyle(location.pathname === '/login')}
            >
              로그인
            </button>
          ) : (
            <button
              type='button'
              onClick={() => navigate('/mypage')}
              style={linkStyle(location.pathname === '/mypage')}
            >
              마이페이지
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
