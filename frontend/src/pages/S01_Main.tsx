import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';

// ── 로컬 에셋 (frontend/src/assets/) ─────────────────────
import imgHeroBg from '../assets/mainbar.png';
import imgLogoWhite from '../assets/logoWhite.png';
import imgHeroLeft from '../assets/mainleft.png';
import imgHeroRight from '../assets/mainright.png';
import imgFeatureCognitive from '../assets/mainf.png';
import imgFeatureCare from '../assets/maint.png';
import imgFeatureMemory from '../assets/mains.png';
import imgIconPatient from '../assets/patient.png';
import imgIconCaregiver from '../assets/caregiver.png';
import imgIconDoctor from '../assets/doctor.png';
import imgBtnLogin from '../assets/mainarrow1.png';
import imgBtnStart from '../assets/mainarrow2.png';

const DESIGN_W = 1920;

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

// 재사용 가능한 카드 스타일
const cardStyle: CSSProperties = {
  width: 392,
  height: 356,
  background: '#ffffff',
  borderRadius: 24,
  boxShadow: '0 4px 30px rgba(32, 115, 232, 0.08)',
  border: '1px solid rgba(65, 136, 237, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '45px 20px',
  boxSizing: 'border-box',
  gap: 20,
};

// 재사용 가능한 뱃지(라벨) 스타일
const badgeStyle: CSSProperties = {
  background: '#eef2a5',
  borderRadius: 30,
  padding: '8px 20px',
  fontSize: 18,
  fontWeight: 700,
  color: '#0d0d0d',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function S01_Main() {
  const navigate = useNavigate();

  return (
    <PageLayout scrollable>
      <div
        style={{
          ...F,
          position: 'relative',
          width: '100%',
          maxWidth: DESIGN_W,
          minHeight: '100vh',
          margin: '0 auto',
          background: '#fcfcfd',
          overflow: 'hidden',
        }}
      >
        {/* ════ Hero 전체 배경 영역 (피그마 원본 좌표 완벽 복구!) ════ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: DESIGN_W,
            height: 1200,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* 기본 배경 (mainbar.png) */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              alt=''
              src={imgHeroBg}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          {/* 좌측 뇌 배경 사진 */}
          <div
            style={{
              position: 'absolute',
              left: -990,
              top: -408,
              width: 1838,
              height: 1575,
              opacity: 0.32,
              WebkitMaskImage:
                'linear-gradient(90deg, black 0%, black 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
              maskImage:
                'linear-gradient(90deg, black 0%, black 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <img
                alt=''
                src={imgHeroLeft}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '116.7%',
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
            </div>
            {/* 파란색 Hue 블렌드 효과 복구 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #2073e8 0%, #124082 100%)',
                mixBlendMode: 'hue',
              }}
            />
          </div>

          {/* 우측 뇌 배경 사진 */}
          <div
            style={{
              position: 'absolute',
              left: 690,
              top: -408,
              width: 1900,
              height: 1575,
              opacity: 0.32,
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 14%, black 30%, black 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 14%, black 30%, black 100%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <img
                alt=''
                src={imgHeroRight}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '116.7%',
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
            </div>
            {/* 파란색 Hue 블렌드 효과 복구 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #2073e8 0%, #124082 100%)',
                mixBlendMode: 'hue',
              }}
            />
          </div>

          {/* 전체 톤 보정 (피그마 원본) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.16)',
            }}
          />

          {/* 하단 자연스러운 페이드 아웃 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 250,
              background: 'linear-gradient(to bottom, transparent, #fcfcfd)',
            }}
          />
        </div>

        {/* ════ 메인 콘텐츠 (Flexbox 유지) ════ */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* ── 로고 및 타이틀 ── */}
          <div
            style={{
              marginTop: 120,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={imgLogoWhite}
              alt='이음 로고'
              style={{ width: 400, objectFit: 'contain' }}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 700,
                color: '#111',
              }}
            >
              경증 치매 환자를 위한 디지털 케어 플랫폼
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                color: '#333',
              }}
            >
              인지 기능 유지 · 보호자 기록 · 의료진 리포트
            </p>
          </div>

          {/* ── 역할 카드 3종 세트 ── */}
          <div style={{ display: 'flex', gap: 24, marginTop: 70 }}>
            <div style={cardStyle}>
              <div
                style={{ height: 130, display: 'flex', alignItems: 'center' }}
              >
                <img
                  src={imgIconPatient}
                  alt='환자 아이콘'
                  style={{ height: 110 }}
                />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#0f66e2',
                  }}
                >
                  환자
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  TTS로 듣고 말로 답하는
                  <br />
                  매일 인지 자극 활동
                </p>
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{ height: 130, display: 'flex', alignItems: 'center' }}
              >
                <img
                  src={imgIconCaregiver}
                  alt='보호자 아이콘'
                  style={{ height: 110 }}
                />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#0f66e2',
                  }}
                >
                  보호자
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  활동 지원 건강 기록
                  <br />
                  삶의 기억 DB 업데이트
                </p>
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{ height: 130, display: 'flex', alignItems: 'center' }}
              >
                <img
                  src={imgIconDoctor}
                  alt='의료진 아이콘'
                  style={{ height: 100 }}
                />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#0f66e2',
                  }}
                >
                  의료진
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  K-MMSE + 일일 데이터
                  <br />
                  진료 참고 리포트 확인
                </p>
              </div>
            </div>
          </div>

          {/* ── 시작하기 & 로그인 버튼 ── */}
          <div style={{ display: 'flex', gap: 24, marginTop: 60 }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <img
                src={imgBtnStart}
                alt='시작하기'
                style={{ height: 60, objectFit: 'contain' }}
              />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <img
                src={imgBtnLogin}
                alt='로그인'
                style={{ height: 60, objectFit: 'contain' }}
              />
            </button>
          </div>

          {/* ════ 주요 서비스 안내 피처 섹션 ════ */}
          <div
            style={{
              marginTop: 180,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: '#111',
                marginBottom: 100,
              }}
            >
              주요 서비스 안내
            </h2>

            <div
              style={{
                display: 'flex',
                width: 1224,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 140,
              }}
            >
              <img
                src={imgFeatureCognitive}
                alt='인지 활동'
                style={{
                  width: 560,
                  height: 315,
                  borderRadius: 24,
                  objectFit: 'cover',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
              />
              <div
                style={{
                  width: 560,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  alignItems: 'flex-start',
                }}
              >
                <div style={badgeStyle}>환자</div>
                <h3
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: '#111',
                    margin: 0,
                  }}
                >
                  매일 인지 자극 활동
                </h3>
                <p
                  style={{
                    fontSize: 22,
                    color: '#555',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  짧고 쉬운 문장과 음성 안내 및 단계별 힌트 제공
                  <br />
                  퀴즈, 미술, 음악 등 다채로운 활동 연계
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                width: 1224,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 140,
              }}
            >
              <div
                style={{
                  width: 560,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={badgeStyle}>보호자</div>
                  <div style={badgeStyle}>의료진</div>
                </div>
                <h3
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: '#111',
                    margin: 0,
                  }}
                >
                  보호자·의료진 연계
                </h3>
                <p
                  style={{
                    fontSize: 22,
                    color: '#555',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  일일 건강 데이터 기록 및 건강 변화 추이 분석
                  <br />
                  월별 K-MMSE 검사 리포트 통합 조회 기능 제공
                </p>
              </div>
              <img
                src={imgFeatureCare}
                alt='보호자 연계'
                style={{
                  width: 560,
                  height: 315,
                  borderRadius: 24,
                  objectFit: 'cover',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                width: 1224,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 160,
              }}
            >
              <img
                src={imgFeatureMemory}
                alt='기억 DB'
                style={{
                  width: 560,
                  height: 315,
                  borderRadius: 24,
                  objectFit: 'cover',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
              />
              <div
                style={{
                  width: 560,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  alignItems: 'flex-start',
                }}
              >
                <div style={badgeStyle}>환자</div>
                <h3
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: '#111',
                    margin: 0,
                  }}
                >
                  개인 기억 DB 활용
                </h3>
                <p
                  style={{
                    fontSize: 22,
                    color: '#555',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  가족 사진, 지인, 장소 정보를 활용한 개인 맞춤형
                  <br />
                  회상 질문 생성 기능
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              height: 120,
              background: 'linear-gradient(90deg, #f7f9ce 0%, #d3e4fe 100%)',
            }}
          />
        </div>
      </div>
    </PageLayout>
  );
}
