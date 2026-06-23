import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';

const DUMMY_PATIENT = {
  name: '홍길동',
  age: 80,
  level: '경도인지장애',
};

export default function S22_CargiverAlerm() {
  const navigate = useNavigate();
  const patient = DUMMY_PATIENT;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-100)' }}>
      {/* 사이드 바 */}
      <CaregiverSidebar patient={patient} />

      {/* 오른쪽 전체 */}
      <div style={{ marginLeft: 348 }}>
        {/* 헤더 */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            height: 67,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 24,
            paddingRight: 40,
          }}
        >
          <button
            onClick={() => navigate('/cargiver-home')}
            style={{ color: 'var(--color-neutral-gray)' }}
          >
            홈
          </button>
          <button 
            onClick={() => navigate('/cargiver-mypage')}
            style={{
              color:'var(--color-neutral-gray)'
            }}>마이페이지</button>
        </div>

        {/* 메인 */}
        <div>연계 알림 내용</div>
      </div>
    </div>
  );
}
