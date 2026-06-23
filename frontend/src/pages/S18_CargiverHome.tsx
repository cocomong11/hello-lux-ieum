import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import CaregiverSidebar from '../components/CaregiverSidebar';
const DESIGN_W = 1920;
const DESIGN_H = 1246;

// 더미 환자 정보
const DUMMY_PATIENT = {
  name: '홍길동',
  age: 80,
  level: '경도인지장애',
};


export default function S18_CargiverHome() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [patient, setPatient] = useState<typeof DUMMY_PATIENT | null>(DUMMY_PATIENT);

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

  return (
    <div
        style={{
            minHeight: '100vh',
            background: 'var(--color-neutral-100)',
        }}
    > 
    
        {/* 사이드 바 */}
        <CaregiverSidebar patient={patient} />

        {/*오른쪽 전체*/}
        <div 
            style={{
                marginLeft:348,
            }}
        >
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
                        style={{
                            color: 'var(--color-primary-dark)'
                        }}>
                        홈
                    </button>

                    <button onClick={() => navigate('/cargiver-mypage')}>
                        마이페이지
                    </button>
                </div>

        
            {/* 메인 */}
            <div>
                메인 내용
            </div>
        </div>
    </div>
        
    );
}
