import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logoWhite.png';
import pprofile from '../assets/pprofile.png';
import setting from '../assets/settings.png';

type Props = {
  patient: {
    name: string;
    birth_date: string; // "YYYY-MM-DD"
    dignosis: string, //경도인지장애
    support_level: string, //낮음 보통 높음
  } | null;
};
//나이 계산 함수
function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
}

const MENUS = [
  { title: '변화 추이',   path: '/cargiver-report' },
  { title: '메모 작성',   path: '/cargiver-memo'   },
  { title: '기억 DB 수정', path: '/cargiver-update' },
  { title: '연계 알림',   path: '/cargiver-alerm'  },
];

const SUB_MENUS = ['가족', '지인', '장소', '음식', '인생 사건'];

const MENU_TOPS = [361, 450, 539, 628];

// S21(기억 DB 수정) active일 때 메뉴 tops
// 기억DB 박스 height 264 + gap 30 → 연계알림이 밀림
const MENU_TOPS_UPDATE = [361, 450, 539, 539 + 264 + 30]; // 833


export default function DoctorSidebar({ patient }: Props) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const isLevel = location.pathname === '/doctor-level';

  if (!patient) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 348,
        height: '100%',
        borderTopRightRadius: 20,
        background: 'var(--color-primary-dark)',
        boxShadow: 'var(--color-primary)',
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
          color: 'var(--color-neutral-100)',
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
          height: 209,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          border: '1px solid rgba(65, 136, 237, 0.5)',
          boxShadow: '0px 0px 4px 0px var(--color-primary)',
          background: 'var(--color-neutral-100)',
        }}
      >
        {/* 프로필 이미지 + 이니셜 */}
        <div
          style={{ position: 'absolute', left: 31, top: 27, width: 75, height: 75 }}
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
              fontSize: 31,
              fontWeight: 600,
              lineHeight: '135%',
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
            left: 123,
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
            left: 123,
            top: 81,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: '165%',
            color: 'var(--color-neutral-gray)',
            margin: 0,
          }}
        >
          {calcAge(patient.birth_date)}세·{patient.dignosis}
        </p>
        <p
          style={{
            position: 'absolute',
            left: 123,
            top: 109,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: '165%',
            color: 'var(--color-neutral-gray)',
            margin: 0,
          }}
        >
          지원수준:{patient.support_level}
        </p>
        
        <button
          onClick={() => navigate('/doctor-level')}
          style={{  position: 'absolute',
            left: 55,
            top: 154,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 22,
            fontWeight: isLevel ? 700 : 400,
            lineHeight: '155%',
            color: 'var(--color-neutral-10)',
            margin: 0,}}
          >
            활동 난이도 설정  
            <img src={setting} alt="설정" style={{width: 26, height: 26}}/>  
        </button>
      </div>

      {/* 메뉴 항목 */}
      {(() => {
        const isUpdatePage = location.pathname === '/cargiver-update';
        const tops = isUpdatePage ? MENU_TOPS_UPDATE : MENU_TOPS;

        return MENUS.map((menu, i) => {
        const isActive = location.pathname === menu.path;
        const isHovered = hoveredPath === menu.path;
        const isUpdateMenu = menu.path === '/cargiver-update';
        const isUpdateActive = isActive && isUpdateMenu;
        const currentCategory = new URLSearchParams(location.search).get('category') || '가족';

        return (
          <div key={menu.path}>
            {/* 일반 메뉴 버튼 (기억 DB 수정 active 상태 제외) */}
            {!isUpdateActive && (
            <div
              onMouseEnter={() => setHoveredPath(menu.path)}
              onMouseLeave={() => setHoveredPath(null)}
              onClick={() => navigate(isUpdateMenu ? `${menu.path}?category=가족` : menu.path)}
              style={{
                position: 'absolute',
                top: tops[i],
                left: 47,
                width: 289,
                height: 59,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: 50,
                border: '2px solid rgba(65, 136, 237, 0.5)',
                background: isActive
                  ? 'var(--color-primary-20, #0F66E2)'
                  : isHovered
                  ? 'rgba(65, 136, 237, 0.1)'
                  : 'var(--color-neutral-100)',
                boxShadow: isActive
                  ? '0 0 8px 0 var(--color-primary)'
                  : isHovered
                  ? '0 0 6px 0 rgba(65, 136, 237, 0.3)'
                  : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 29,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  lineHeight: '155%',
                  color: isActive ? 'var(--color-neutral-100)' : 'inherit',
                  pointerEvents: 'none',
                }}
              >
                {menu.title}
              </span>
            </div>
            )}

            {/* 기억 DB 수정 메뉴 - active 상태: 하나의 큰 박스 */}
            {isUpdateActive && (
              <div
                style={{
                  position: 'absolute',
                  top: tops[i],
                  left: 47,
                  width: 291,
                  height: 264,
                  borderRadius: '50px 0 0 50px',
                  border: '2px solid rgba(65, 136, 237, 0.50)',
                  background: '#0F66E2',
                  boxShadow: '0 0 8px 0 #4188ED',
                  boxSizing: 'border-box',
                  padding: '13px 28px 13px 29px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* 타이틀 */}
                <span style={{ fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)' }}>
                  기억 DB 수정
                </span>

                {/* 서브메뉴 - 오른쪽 정렬 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end',gap: 6 }}>
                  {SUB_MENUS.map(sub => (
                    <span
                      key={sub}
                      onClick={e => { e.stopPropagation(); navigate(`/cargiver-update?category=${sub}`); }}
                      style={{
                        fontFamily: 'Pretendard Variable',
                        fontSize: 22,
                        fontWeight: currentCategory === sub ? 700 : 400,
                        color: currentCategory === sub ? 'var(--color-neutral-100)' : 'var(--color-neutral-100)',
                        cursor: 'pointer',
                        lineHeight: '155%',
                      }}
                    >
                      {currentCategory === sub ? '· ' : ''}{sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })})()}
    </div>
  );
}
