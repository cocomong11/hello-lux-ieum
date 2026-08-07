import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logoWhite.png';
import pprofile from '../assets/pprofile.png';
import setting from '../assets/settings.png';

type Props = {
  patient: {
    name: string;
    birth_date: string;
    dignosis: string;
    support_level: string;
    recentKMMSE?: string;
    kmmseScore?: string;    // "22/30"
    kmmseRange?: string;    // "경도인지장애 범위"
    stats?: {
      activity: string;     // "완료 (5/5)"
      rate: string;         // "60%"
      hint: string;         // "2회"
    };
    memo?: string;
  } | null;
};

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
}

export default function DoctorSidebar({ patient }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
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
        boxShadow: '0 0 10px 0 var(--color-primary)',
        padding: '0 0 40px 0',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* 로고 */}
      <img
        src={logo}
        alt="로고"
        style={{ width: 71.36, height: 29, position: 'absolute', left: 267, top: 19 }}
      />

      {/* 담당 환자 레이블 */}
      <p style={{ position: 'absolute', left: 49, top: 95, fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-100)', margin: 0 }}>
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
        <div style={{ position: 'absolute', left: 31, top: 27, width: 75, height: 75 }}>
          <img src={pprofile} alt="환자프로필" style={{ width: '100%', height: '100%' }} />
          <p style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 31, fontWeight: 600, lineHeight: '135%',
            margin: 0, color: 'var(--color-primary-dark)',
          }}>
            {patient.name?.[0]}
          </p>
        </div>

        <p style={{ position: 'absolute', left: 123, top: 27, fontSize: 36, fontWeight: 700, lineHeight: '135%', color: 'var(--color-neutral-10)', margin: 0 }}>
          {patient.name}
        </p>
        <p style={{ position: 'absolute', left: 123, top: 81, fontSize: 16, fontWeight: 700, lineHeight: '165%', color: 'var(--color-neutral-gray)', margin: 0 }}>
          {calcAge(patient.birth_date) !== null ? `${calcAge(patient.birth_date)}세 · ` : ''}{patient.dignosis}
        </p>
        <p style={{ position: 'absolute', left: 123, top: 109, fontSize: 16, fontWeight: 700, lineHeight: '165%', color: 'var(--color-neutral-gray)', margin: 0 }}>
          지원 수준 : {patient.support_level}
        </p>

        <button
          onClick={() => {
            const params = new URLSearchParams(location.search);
            const pCode = params.get('p_code') || '1001';
            navigate(`/doctor-level?p_code=${pCode}`);
          }}
          style={{
            position: 'absolute', left: 55, top: 154,
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 22, fontWeight: isLevel ? 700 : 400, lineHeight: '155%',
            color: 'var(--color-neutral-10)', background: 'none', border: 'none', cursor: 'pointer', margin: 0,
          }}
        >
          활동 난이도 설정
          <img src={setting} alt="설정" style={{ width: 26, height: 26 }} />
        </button>
      </div>

      {/* ── > 최근 K-MMSE ── */}
      {patient.recentKMMSE && (
        <div style={{ position: 'absolute', left: 49, top: 404}}>
          <p style={{ fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)', margin: 0 }}>
            {'>'} 최근 한달 기록
          </p>
          {patient.kmmseScore && (
            <p style={{ margin: '10px 0 0', fontSize: 36, fontWeight: 700, lineHeight: '135%', color: 'var(--color-neutral-100)' }}>
              {patient.kmmseScore.split('/')[0]}
              <span style={{ fontSize: 22, fontWeight: 700, lineHeight: '155%' }}>/ {patient.kmmseScore.split('/')[1]}</span>
            </p>
          )}
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: '165%', color: 'var(--color-neutral-100)' }}>
            {patient.recentKMMSE}
          </p>
          {patient.kmmseRange && (
            <div style={{
              marginTop: 10,
              display: 'inline-flex', padding: '6px 19px',
              alignItems: 'center', gap: 10,
              borderRadius: 10,
              border: '1px solid var(--color-primaty-dark)',
              background: 'var(--color-secondary)',
              boxShadow: '0 0 4px 0 #4188ED',
            }}>
              <span style={{fontSize: 22, fontWeight: 700, lineHeight:'155%',color: 'var(--color-neutral-10)' }}>{patient.kmmseRange}</span>
            </div>
          )}
        </div>
      )}

      {/* ── > 오늘 상태 ── */}
      {patient.stats && (
        <div style={{ position: 'absolute', left: 49, top: 639 }}>
          <p style={{ fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)', margin: 0 }}>
            {'>'} 오늘 상태
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)' }}>
            활동 : {patient.stats.activity}
          </p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)' }}>
            성공률 : {patient.stats.rate}
          </p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)' }}>
            힌트 사용 : {patient.stats.hint}
          </p>
        </div>
      )}

      {/* ── > 진료 요약 메모 ── */}
      {patient.memo && (
        <div style={{ position: 'absolute', left: 49, top: 845 }}>
          <p style={{ fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-100)', margin: 0 }}>
            {'>'} 진료 요약 메모
          </p>
          <div style={{
            marginTop: 10,
            width: 287,
            padding: '12px 22px',
            borderRadius: 10,
            border: '1px solid var(--color-neutral-100)',
            boxSizing: 'border-box',
          }}>
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: '165%', color: 'var(--color-neutral-100)', margin: 0 }}>
              {patient.memo}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
