import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveRole } from '../utils/role';
import type { UserRole } from '../utils/role';

// ── Figma 에셋 ──────────────────────────────────────────
const imgImage9 =
  'https://www.figma.com/api/mcp/asset/36ff0b6c-9d88-48ef-97bf-898eddac596e'; // 환자 아이콘
const imgImage8 =
  'https://www.figma.com/api/mcp/asset/8de84289-b38d-446f-8649-167001a37c5c'; // 보호자 아이콘
const imgImage6 =
  'https://www.figma.com/api/mcp/asset/b7058ebc-af82-4101-a2d8-80a4545ecbe9'; // 의료진 아이콘

const DESIGN_W = 1920;
const DESIGN_H = 1080;

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

type Role = UserRole;

const ROLES: {
  id: Role;
  label: string;
  desc: [string, string];
  icon: string;
  iconW: number;
  iconH: number;
  cardLeft: number;
  next: string;
}[] = [
  {
    id: 'patient',
    label: '환자',
    desc: [
      '음성으로 안내를 듣고, 말로 답하며',
      '매일 인지 자극 활동을 수행해요',
    ],
    icon: imgImage9,
    iconW: 125,
    iconH: 125,
    cardLeft: 348,
    next: '/patient-info',
  },
  {
    id: 'guardian',
    label: '보호자',
    desc: ['가족의 활동 수행을 돕고', '건강 상태와 감정변화를 기록해요'],
    icon: imgImage8,
    iconW: 118,
    iconH: 125,
    cardLeft: 765,
    next: '/code-link',
  },
  {
    id: 'doctor',
    label: '의료진',
    desc: [
      'K-MMSE 결과와 일일 활동 데이터를',
      '함께 확인해 진료 참고 자료로 활용해요',
    ],
    icon: imgImage6,
    iconW: 85,
    iconH: 125,
    cardLeft: 1180,
    next: '/code-link',
  },
];

export default function S04_RoleSelect() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  // 오른쪽 Figma처럼 환자가 기본 선택된 상태
  const [selected, setSelected] = useState<Role>('patient');

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

  const handleNext = () => {
    saveRole(selected);

    const role = ROLES.find((r) => r.id === selected);
    if (!role) return;

    navigate(role.next);
  };

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
        {/* ── 타이틀 ── */}
        <p
          style={{
            ...F,
            position: 'absolute',
            left: '50%',
            top: 220,
            transform: 'translateX(-50%)',
            margin: 0,
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          이음을 어떤 역할로 이용하시나요?
        </p>

        {/* ── 서브타이틀 ── */}
        <p
          style={{
            ...F,
            position: 'absolute',
            left: '50%',
            top: 278,
            transform: 'translateX(-50%)',
            margin: 0,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          역할에 맞는 화면으로 안내해드려요
        </p>

        {/* ── 역할 카드 ── */}
        {ROLES.map((role) => {
          const sel = selected === role.id;

          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              style={{
                ...F,
                position: 'absolute',
                left: role.cardLeft,
                top: 410,
                width: 392,
                height: 356,
                borderRadius: 15,
                border: sel
                  ? '2px solid rgba(15, 102, 226, 0.32)'
                  : '1px solid rgba(121, 121, 128, 0.28)',
                background: sel ? 'rgba(65, 136, 237, 0.05)' : '#f8f9fa',
                boxShadow: sel
                  ? '0 0 7px rgba(32, 115, 232, 0.65)'
                  : '0 0 4px rgba(121, 121, 128, 0.45)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
                paddingTop: 43,
                paddingBottom: 42,
                paddingLeft: 32,
                paddingRight: 32,
                gap: 24,
                transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
              }}
            >
              {/* 아이콘 */}
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: role.iconW,
                  height: role.iconH,
                }}
              >
                <img
                  alt={role.label}
                  src={role.icon}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: sel ? 'none' : 'grayscale(1)',
                    opacity: sel ? 1 : 0.62,
                  }}
                />
              </div>

              {/* 역할명 + 설명 */}
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    ...F,
                    margin: 0,
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: sel ? '#0f66e2' : '#0d0d0d',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {role.label}
                </p>

                <div
                  style={{
                    marginTop: 16,
                  }}
                >
                  <p
                    style={{
                      ...F,
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: '#797980',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {role.desc[0]}
                  </p>

                  <p
                    style={{
                      ...F,
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: '#797980',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {role.desc[1]}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* ── 다음 버튼 ── */}
        <button
          onClick={handleNext}
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 840,
            width: 648,
            height: 81,
            background: '#0f66e2',
            borderRadius: 50,
            border: 'none',
            boxShadow: '0 0 4px #4188ed',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, box-shadow 0.2s',
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
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
