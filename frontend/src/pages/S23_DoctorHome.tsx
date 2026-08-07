import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/doctorHeader';
import pprofile from '../assets/pprofile.png';
import { getDoctorPatients, type DoctorPatient } from '../api/doctor';
import { getQuizResults } from '../api/patient';
import { ApiError } from '../api/client';

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const DESIGN_Left = 556;

const F: React.CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

const DUMMY_DOCTOR = {
  name: '-',
  locate: '-',
};

const DUMMY_PATIENTS: { p_code: number; name: string; birth_date: string; dignosis: string; recentKMMSE: string; recentQuize: string; rate: number }[] = [];

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

function calcDaysAgo(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '오늘';
  return `${diff}일전`;
}

function rateStyle(rate: number): { border: string; background: string; boxShadow: string; color: string } {
  if (rate > 60) {
    return {
      border: '1px solid #DFDF87',
      background: '#0F66E2',
      boxShadow: '0 0 4px 0 #4188ED',
      color: '#F8F9FA',
    };
  } else if (rate > 40) {
    return {
      border: '1px solid #0F66E2',
      background: '#DFDF87',
      boxShadow: '0 0 4px 0 #4188ED',
      color: '#0F66E2',
    };
  } else {
    return {
      border: '1px solid #E53134',
      background: 'rgba(229, 49, 52, 0.05)',
      boxShadow: '0 0 4px 0 #4188ED',
      color: '#E53134',
    };
  }
}

export default function S23_DoctorHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [scale, setScale] = useState(1);
  const [patients, setPatients] = useState(DUMMY_PATIENTS);
  const doctor = DUMMY_DOCTOR;

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // API: 담당 환자 목록 로드
  useEffect(() => {
    getDoctorPatients()
      .then(async (data: DoctorPatient[]) => {
        if (data.length > 0) {
          // 각 환자별 퀴즈 결과 병렬 호출
          const enriched = await Promise.all(data.map(async p => {
            try {
              const results = await getQuizResults(p.p_code);
              const last = results[results.length - 1];
              return {
                p_code: p.p_code,
                name: p.name,
                birth_date: '',
                dignosis: p.diagnosis,
                recentKMMSE: '',
                recentQuize: last?.date || '',
                rate: last ? Math.round((last.correct_count / last.total_count) * 100) : 0,
              };
            } catch {
              return {
                p_code: p.p_code,
                name: p.name,
                birth_date: '',
                dignosis: p.diagnosis,
                recentKMMSE: '',
                recentQuize: '',
                rate: 0,
              };
            }
          }));
          setPatients(enriched);
        }
      })
      .catch(err => console.log('의사 환자 목록 API 미연결:', err instanceof ApiError ? err.message : err));
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.includes(search)
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: DESIGN_H * scale, overflowX: 'hidden', background: '#F8F9FA' }}>
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          background: '#F8F9FA',
        }}
      >
        <Header />

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ position: 'relative', marginLeft: DESIGN_Left }}>

        {/* 의사 프로필 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 68 }}>
          {/* 이미지 + 이니셜 */}
          <div style={{ width: 95, height: 95, position: 'relative', flexShrink: 0 }}>
            <img src={pprofile} alt="프로필" style={{ width: '100%', height: '100%' }} />
            <p style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--color-primary-dark)',
              textAlign: 'center',
              fontSize: 40, fontWeight: 600, lineHeight: '135%',
              letterSpacing: 6, margin: 0,
            }}>
              {doctor.name?.[0]}
            </p>
          </div>

          {/* 이름 + 소속 */}
          <div style={{ marginLeft: 29 }}>
            <p style={{ ...F, margin: 0, fontSize: 36, fontWeight: 700, lineHeight: '135%', color: 'var(--color-neutral-10)' }}>
              {doctor.name} 의사
            </p>
            <p style={{ ...F, margin: '2px 0 0', fontSize: 22, fontWeight: 400, lineHeight: '155%', color: 'var(--color-primary-dark)' }}>
              {doctor.locate}
            </p>
          </div>
        </div>

        {/* 환자 검색 박스 */}
        <div style={{
          marginTop: 223 - 68 - 95, // DESIGN_Header+223 기준에서 프로필 영역 빼기
          display: 'flex',
          width: 808,
          padding: '19px 29px',
          alignItems: 'center',
          gap: 16,
          borderRadius: 10,
          border: '1px solid var(--color-neutral-60, #8E8E98)',
          background: 'var(--color-neutral-100, #F8F9FA)',
          boxShadow: '0 0 4px 0 #797980',
          boxSizing: 'border-box',
        }}>
          {/* 돋보기 아이콘 */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#797980" strokeWidth="2" />
            <line x1="14" y1="14" x2="20" y2="20" stroke="#797980" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="환자 이름으로 검색"
            style={{
              ...F, flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 22, fontWeight: 400, lineHeight: '155%', color: '#0D0D0D',
            }}
          />
        </div>

        {/* 연동 환자 목록 + 환자 추가 */}
        <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 531 }}>
          <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-10)' }}>
            연동 환자 목록
          </p>
          <button
            onClick={() => navigate('/code-link')}
            style={{
            ...F, display: 'inline-flex', padding: '6px 19px',
            justifyContent: 'center', alignItems: 'center', gap: 10,
            borderRadius: 10, border: '1px solid var(--color-neutral-60, #8E8E98)',
            background: 'var(--color-neutral-100, #F8F9FA)',
            boxShadow: '0 0 4px 0 #797980',
            cursor: 'pointer', fontSize: 22, fontWeight: 700, color: 'var(--color-neutral-gray)',
            textAlign: 'center',
          }}>
            + 환자 추가
          </button>
        </div>

        {/* 환자 목록 카드 */}
        {filteredPatients.map(patient => {
          const rs = rateStyle(patient.rate);
          return (
            <div
              key={patient.p_code}
              onClick={() => navigate(`/doctor-dashboard?p_code=${patient.p_code}`)}
              style={{
                marginTop: 20,
                padding: '23px 27px 20px 28px',
                width: 808,
                height: 107,
                borderRadius: 10,
                border: '1px solid #8E8E98',
                background: '#F8F9FA',
                boxShadow: '0 0 4px 0 #797980',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
                position: 'relative',
              }}
            >
              {/* 환자 이미지 + 이니셜 */}
              <div style={{ width: 62, height: 62, position: 'relative', flexShrink: 0 }}>
                <img src={pprofile} alt="환자" style={{ width: '100%', height: '100%' }} />
                <p style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--color-primary-dark)',
                  textAlign: 'center',
                  fontSize: 26, fontWeight: 600, lineHeight: '135%',
                  letterSpacing: 4, margin: 0,
                }}>
                  {patient.name?.[0]}
                </p>
              </div>

              {/* 환자 정보 */}
              <div style={{ marginLeft: 16 }}>
                <p style={{ ...F, margin: 0, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: 'var(--color-neutral-10)' }}>
                  {patient.name}
                </p>
                <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 400, lineHeight: '165%', color: 'var(--color-neutral-gray)' }}>
                  {calcAge(patient.birth_date)}세 · {patient.dignosis}
                  {patient.recentKMMSE && (
                    <span style={{ marginLeft: 16, color: 'var(--color-neutral-30, #797980)', fontWeight: 700 }}>
                      K-MMSE : {patient.recentKMMSE}
                    </span>
                  )}
                </p>
              </div>

              {/* 오른쪽: 최근 수행 + 성공률 */}
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <p style={{ ...F, margin: 0, fontSize: 16, fontWeight: 700, lineHeight: '165%', color: 'var(--color-neutral-gray)', textAlign: 'right' }}>
                  최근 수행 : {patient.recentQuize} ({calcDaysAgo(patient.recentQuize)})
                </p>
                <div style={{
                  display: 'inline-flex', padding: '6px 19px',
                  alignItems: 'center', gap: 10,
                  borderRadius: 10,
                  border: rs.border,
                  background: rs.background,
                  boxShadow: rs.boxShadow,
                }}>
                  <span style={{ ...F, fontSize: 22, fontWeight: 700, lineHeight: '155%', color: rs.color, textAlign: 'center' }}>
                    성공률 {patient.rate}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>
      </div>
    </div>
  );
}
