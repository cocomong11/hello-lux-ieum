import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import pprofile from '../assets/pprofile.png';

type Props = {
  patient: {
    name: string;
    age: number;
    level: string;
  } | null;
};

const MENUS = [
  { title: '변화 추이',   path: '/cargiver-report' },
  { title: '메모 작성',   path: '/cargiver-memo'   },
  { title: '기억 DB 수정', path: '/cargiver-update' },
  { title: '연계 알림',   path: '/cargiver-alerm'  },
];

const MENU_TOPS = [361, 450, 539, 628];

export default function CaregiverSidebar({ patient }: Props) {
  const navigate  = useNavigate();
  const location  = useLocation();

  if (!patient) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 348,
        height: '100vh',
        borderTopRightRadius: 20,
        background:
          'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)),' +
          'linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
        boxShadow: '0 0 10px 0 #4188ED',
      }}
    >
      {/* 로고 */}
      <img
        src={logo}
        alt="로고"
        style={{ width: 71.36, height: 29, position: 'absolute', left: 267, top: 19 }}
      />

      {/* 담당 환자 레이블 */}
      <p
        style={{
          position: 'absolute',
          left: 49,
          top: 95,
          width: 82,
          height: 34,
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-neutral-10)',
          margin: 0,
        }}
      >
        담당 환자
      </p>

      {/* 담당 환자 정보 카드 */}
      <div
        style={{
          position: 'absolute',
          left: 49,
          top: 144,
          width: 289,
          height: 188,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          border: '1px solid rgba(65, 136, 237, 0.5)',
          boxShadow: '0px 0px 4px 0px var(--color-primary)',
          background: 'var(--color-neutral-100)',
        }}
      >
        {/* 프로필 이미지 + 이니셜 */}
        <div
          style={{ position: 'absolute', left: 30, top: 21, width: 95, height: 95 }}
        >
          <img
            src={pprofile}
            alt="환자프로필"
            style={{ width: '100%', height: '100%' }}
          />
          <p
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 40,
              margin: 0,
              color: 'var(--color-primary-dark)',
            }}
          >
            {patient.name?.[0]}
          </p>
        </div>

        <p
          style={{
            position: 'absolute',
            left: 145,
            top: 27,
            fontSize: 36,
            fontWeight: 700,
            lineHeight: '135%',
            color: 'var(--color-neutral-10)',
            margin: 0,
          }}
        >
          {patient.name}
        </p>
        <p
          style={{
            position: 'absolute',
            left: 147,
            top: 77,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: '155%',
            color: 'var(--color-neutral-gray)',
            margin: 0,
          }}
        >
          {patient.age}세
        </p>
        <p
          style={{
            position: 'absolute',
            left: 145,
            top: 126,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: '155%',
            color: 'var(--color-primary-dark)',
            margin: 0,
          }}
        >
          {patient.level}
        </p>
      </div>

      {/* 메뉴 항목 */}
      {MENUS.map((menu, i) => {
        const isActive = location.pathname === menu.path;
        return (
          <div
            key={menu.path}
            style={{
              position: 'absolute',
              top: MENU_TOPS[i],
              left: 47,
              width: 289,
              height: 59,
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              border: '2px solid rgba(65, 136, 237, 0.5)',
              background: isActive
                ? 'var(--color-primary-20, #0F66E2)'
                : 'var(--color-neutral-100)',
              boxShadow: isActive ? '0 0 8px 0 var(--color-primary)' : 'none',
            }}
          >
            <button
              onClick={() => navigate(menu.path)}
              style={{
                position: 'absolute',
                left: 29,
                top: 13,
                height: 34,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: '155%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: isActive ? 'var(--color-neutral-100)' : 'inherit',
              }}
            >
              {menu.title}
            </button>
          </div>
        );
      })}
    </div>
  );
}
