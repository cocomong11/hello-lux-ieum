import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { saveRole } from '../utils/role';
import type { UserRole } from '../utils/role';

import imgIconPatient from '../assets/patient.png';
import imgIconCaregiver from '../assets/caregiver.png';
import imgIconDoctor from '../assets/doctor.png';

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
  next: string;
}[] = [
  {
    id: 'patient',
    label: '환자',
    desc: [
      '음성으로 안내를 듣고, 말로 답하며',
      '매일 인지 자극 활동을 수행해요',
    ],
    icon: imgIconPatient,
    iconW: 125,
    iconH: 125,
    next: '/patient-info',
  },
  {
    id: 'guardian',
    label: '보호자',
    desc: ['가족의 활동 수행을 돕고', '건강 상태와 감정변화를 기록해요'],
    icon: imgIconCaregiver,
    iconW: 118,
    iconH: 125,
    next: '/code-link',
  },
  {
    id: 'doctor',
    label: '의료진',
    desc: [
      'K-MMSE 결과와 일일 활동 데이터를',
      '함께 확인해 진료 참고 자료로 활용해요',
    ],
    icon: imgIconDoctor,
    iconW: 85,
    iconH: 125,
    next: '/code-link',
  },
];

export default function S04_RoleSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role>('patient');

  const handleNext = () => {
    saveRole(selected);
    const role = ROLES.find((r) => r.id === selected);
    if (!role) return;
    navigate(role.next);
  };

  return (
    <PageLayout scrollable>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
        }}
      >
        <p
          style={{
            ...F,
            margin: '0 0 16px 0',
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#0d0d0d',
            textAlign: 'center',
          }}
        >
          이음을 어떤 역할로 이용하시나요?
        </p>
        <p
          style={{
            ...F,
            margin: '0 0 60px 0',
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            textAlign: 'center',
          }}
        >
          역할에 맞는 화면으로 안내해드려요
        </p>

        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            marginBottom: 70,
          }}
        >
          {ROLES.map((role) => {
            const sel = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                style={{
                  ...F,
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
                      objectFit: 'contain',
                      filter: sel ? 'none' : 'grayscale(1)',
                      opacity: sel ? 1 : 0.62,
                    }}
                  />
                </div>
                <div
                  style={{ width: '100%', textAlign: 'center', flexShrink: 0 }}
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
                  <div style={{ marginTop: 16 }}>
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
        </div>

        <button
          onClick={handleNext}
          style={{
            ...F,
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
    </PageLayout>
  );
}
