import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/DoctorSidebar';

const DESIGN_W = 1920;
const DESIGN_H = 1773;

const DUMMY_PATIENT = {
  name: '홍길동',
  birth_date: '1950-01-01',
  dignosis: '경도인지장애',
  support_level: '보통',

};

const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

export default function S26_DoctorLevel() {
  const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || '가족';
    const [scale, setScale] = useState(1);
    const patient = DUMMY_PATIENT;

    useEffect(() => {
        const update = () => setScale(window.innerWidth / DESIGN_W);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    
    return (
        <div
              style={{
                position: 'relative',
                width: '100vw',
                height: DESIGN_H * scale,
                overflowX: 'hidden',
                background: 'var(--color-neutral-100)',
              }}
            >
              <div
                style={{
                  width: DESIGN_W,
                  height: DESIGN_H,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transformOrigin: 'top left',
                  transform: `scale(${scale})`,
                  background: 'var(--color-neutral-100)',
                }}
              >
                {/* 사이드 바 */}
                <Sidebar patient={patient} />
        
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
                      onClick={() => navigate('/doctor-home')}
                      style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
                    >
                      홈
                    </button>
                    <button
                      onClick={() => navigate('/mypage')}
                      style={{ ...F, color: 'var(--color-neutral-gray)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
                    >
                      마이페이지
                    </button>
                  </div>
        
                  {/* 메인 */}
                  <div style={{ position: 'absolute', left: 636, top: 144 }}>
                    <p style={{ fontSize: 30, fontWeight: 700, color: '#0D0D0D', margin: 0, lineHeight:'140%' }}>
                      지원수준 설정
                    </p>
                    
                  </div>
                </div>
              </div>
            </div>
  );
}
