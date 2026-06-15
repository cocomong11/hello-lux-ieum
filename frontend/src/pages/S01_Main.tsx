import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Figma 에셋 ───────────────────────────────────────────
const imgImage3 =
  'https://www.figma.com/api/mcp/asset/91123542-8818-4dcd-be22-be6f6a2e31d9'; // 히어로 사이드 포토
const imgGroup15 =
  'https://www.figma.com/api/mcp/asset/d5690299-979c-4ced-b722-1d421058e8ed'; // 이음 로고
const imgImage11 =
  'https://www.figma.com/api/mcp/asset/46d14432-9ac4-43c8-b8f1-62cccb2869b1'; // 환자 아이콘
const imgImage9 =
  'https://www.figma.com/api/mcp/asset/6a8db2b4-4805-40cc-8a90-99192f1def91'; // 보호자 아이콘
const imgImage8 =
  'https://www.figma.com/api/mcp/asset/17482c18-1e7a-434b-9b4e-f10ac0ca4dc1'; // 의료진 아이콘
const imgGroup6 =
  'https://www.figma.com/api/mcp/asset/a94bccde-4a1a-41c4-9be7-2a630a0fb90f'; // 시작하기 화살표
const imgGroup7 =
  'https://www.figma.com/api/mcp/asset/c68f45c0-6d17-40d2-853c-4e63a96e699c'; // 로그인 화살표
const imgImage5 =
  'https://www.figma.com/api/mcp/asset/e12fba34-bb68-4e3d-b686-eb348812a7ca'; // 피처 마스크 형태
const imgImage6 =
  'https://www.figma.com/api/mcp/asset/3939e7f5-e60c-41dd-952a-0fbda24d2367'; // 인지활동 사진
const imgImage7 =
  'https://www.figma.com/api/mcp/asset/6e4eaec9-460d-4c95-8b36-224d5963682e'; // 보호자·의료진 사진
const imgImage10 =
  'https://www.figma.com/api/mcp/asset/641dfd11-75e8-46a9-a5dd-d44f74ede2a1'; // 기억DB 사진

const DESIGN_W = 1920;
const DESIGN_H = 3120;

const F: CSSProperties = {
  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
};

export default function S01_Main() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

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
        background: '#f8f9fa',
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
          background: '#f8f9fa',
          ...F,
        }}
      >
        {/* ════ Hero 전체 배경 영역 ════ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: DESIGN_W,
            height: 1200,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* 기본 그라데이션 배경 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, #f5fbfd 0%, #dcecf9 36%, #bfd8f4 66%, #98c3f2 100%)',
            }}
          />

          {/* 좌측 배경 사진 */}
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
                src={imgImage3}
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

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #2073e8 0%, #124082 100%)',
                mixBlendMode: 'hue',
              }}
            />
          </div>

          {/* 우측 배경 사진 */}
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
                src={imgImage3}
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

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #2073e8 0%, #124082 100%)',
                mixBlendMode: 'hue',
              }}
            />
          </div>

          {/* 전체 톤 보정 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.16)',
            }}
          />
        </div>

        {/* ── 이음 로고 ── */}
        <div
          style={{
            position: 'absolute',
            left: DESIGN_W / 2 - 549 / 2 + 0.73,
            top: 132,
            width: 549,
            height: 219,
          }}
        >
          <img
            alt='이음'
            src={imgGroup15}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
        </div>

        {/* ── 서브타이틀 ── */}
        <div
          style={{
            position: 'absolute',
            top: 399,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              ...F,
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1.35,
              color: '#0d0d0d',
              margin: 0,
            }}
          >
            경증 치매 환자를 위한 디지털 케어 플랫폼
          </p>
          <p
            style={{
              ...F,
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1.35,
              color: '#0d0d0d',
              margin: 0,
            }}
          >
            인지 기능 유지 · 보호자 기록 · 의료진 리포트
          </p>
        </div>

        {/* ── 역할 카드: 환자 ── */}
        <div
          style={{
            position: 'absolute',
            left: 348,
            top: 566,
            width: 392,
            height: 356,
            background: '#f8f9fa',
            borderRadius: 15,
            filter: 'drop-shadow(0px 0px 4px #2073e8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 43,
            paddingBottom: 42,
            paddingLeft: 92,
            paddingRight: 91,
            gap: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 125,
              height: 125,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              alt='환자'
              src={imgImage11}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                ...F,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#0f66e2',
                margin: 0,
              }}
            >
              환자
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              TTS로 듣고 말로 답하는
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              매일 인지 자극 활동
            </p>
          </div>
        </div>

        {/* ── 역할 카드: 보호자 ── */}
        <div
          style={{
            position: 'absolute',
            left: 764,
            top: 566,
            width: 392,
            height: 356,
            background: '#f8f9fa',
            borderRadius: 15,
            filter: 'drop-shadow(0px 0px 4px #2073e8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 43,
            paddingBottom: 42,
            paddingLeft: 97,
            paddingRight: 97,
            gap: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 118,
              height: 125,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              alt='보호자'
              src={imgImage9}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                ...F,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#0f66e2',
                margin: 0,
              }}
            >
              보호자
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              활동 지원 건강 기록
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              삶의 기억 DB 업데이트
            </p>
          </div>
        </div>

        {/* ── 역할 카드: 의료진 ── */}
        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 566,
            width: 392,
            height: 356,
            background: '#f8f9fa',
            borderRadius: 15,
            filter: 'drop-shadow(0px 0px 4px #2073e8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 43,
            paddingBottom: 42,
            paddingLeft: 91,
            paddingRight: 91,
            gap: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 85,
              height: 125,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              alt='의료진'
              src={imgImage8}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                ...F,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#0f66e2',
                margin: 0,
              }}
            >
              의료진
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              K-MMSE + 일일 데이터
            </p>
            <p
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#797980',
                margin: 0,
              }}
            >
              진료 참고 리포트 확인
            </p>
          </div>
        </div>

        {/* ── CTA: 시작하기 ── */}
        <button
          onClick={() => navigate('/register')}
          style={{
            ...F,
            position: 'absolute',
            top: 991,
            left: 717,
            width: 274,
            height: 63,
            background: '#0d0d0d',
            borderRadius: 50,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingLeft: 30,
            paddingRight: 10,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 800,
              color: '#f8f9fa',
              whiteSpace: 'nowrap',
            }}
          >
            시작하기(신규 가입)
          </span>

          <div
            style={{
              width: 50,
              height: 50,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              alt=''
              src={imgGroup6}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </button>

        {/* ── CTA: 로그인 ── */}
        <button
          onClick={() => navigate('/login')}
          style={{
            ...F,
            position: 'absolute',
            top: 991,
            left: 1046,
            width: 157,
            height: 63,
            background: '#0f66e2',
            borderRadius: 50,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingLeft: 30,
            paddingRight: 10,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 800,
              color: '#f8f9fa',
              whiteSpace: 'nowrap',
            }}
          >
            로그인
          </span>

          <div
            style={{
              width: 50,
              height: 50,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              alt=''
              src={imgGroup7}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </button>

        {/* ════ 피처 섹션 ════ */}

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 1304,
            left: 0,
            right: 0,
            margin: 0,
            textAlign: 'center',
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#0d0d0d',
          }}
        >
          주요 서비스 안내
        </p>

        {/* ── Feature 1: 매일 인지 자극 활동 ── */}
        <div
          style={{
            position: 'absolute',
            left: 183,
            top: 1216,
            width: 1184,
            height: 666,
            WebkitMaskImage: `url("${imgImage5}")`,
            WebkitMaskSize: '725px 339px',
            WebkitMaskPosition: '165px 294px',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url("${imgImage5}")`,
            maskSize: '725px 339px',
            maskPosition: '165px 294px',
            maskRepeat: 'no-repeat',
          }}
        >
          <img
            alt=''
            src={imgImage6}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 1161,
            top: 1555,
            background: '#dfdf87',
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            height: 42,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
            환자
          </span>
        </div>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 1624,
            left: 1161,
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#0d0d0d',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          매일 인지 자극 활동
        </p>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 1721,
            left: 1161,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            margin: 0,
          }}
        >
          짧고 쉬운 문장과 음성 안내 및 단계별 힌트 제공
          <br />
          퀴즈, 미술, 음악 등 다채로운 활동 연계
        </p>

        {/* ── Feature 2: 보호자·의료진 연계 ── */}
        <div
          style={{
            position: 'absolute',
            left: 348,
            top: 2030,
            background: '#dfdf87',
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            height: 42,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
            보호자
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 462,
            top: 2030,
            background: '#dfdf87',
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            height: 42,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
            의료진
          </span>
        </div>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 2099,
            left: 348,
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#0d0d0d',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          보호자·의료진 연계
        </p>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 2196,
            left: 348,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            margin: 0,
          }}
        >
          일일 건강 데이터 기록 및 건강 변화 추이 분석
          <br />
          월별 K-MMSE 검사 리포트 통합 조회 기능 제공
        </p>

        <div
          style={{
            position: 'absolute',
            left: 833,
            top: 1937,
            width: 784,
            height: 441,
            WebkitMaskImage: `url("${imgImage5}")`,
            WebkitMaskSize: '725px 339px',
            WebkitMaskPosition: '7px 48px',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url("${imgImage5}")`,
            maskSize: '725px 339px',
            maskPosition: '7px 48px',
            maskRepeat: 'no-repeat',
          }}
        >
          <img
            alt=''
            src={imgImage7}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* ── Feature 3: 개인 기억 DB 활용 ── */}
        <div
          style={{
            position: 'absolute',
            left: 304,
            top: 2433,
            width: 789,
            height: 366,
            WebkitMaskImage: `url("${imgImage5}")`,
            WebkitMaskSize: '725px 339px',
            WebkitMaskPosition: '44px 27px',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url("${imgImage5}")`,
            maskSize: '725px 339px',
            maskPosition: '44px 27px',
            maskRepeat: 'no-repeat',
          }}
        >
          <img
            alt=''
            src={imgImage10}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0f66e2',
              mixBlendMode: 'color',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 1161,
            top: 2505,
            background: '#dfdf87',
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            height: 42,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.55,
              color: '#0d0d0d',
            }}
          >
            환자
          </span>
        </div>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 2574,
            left: 1161,
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#0d0d0d',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          개인 기억 DB 활용
        </p>

        <p
          style={{
            ...F,
            position: 'absolute',
            top: 2671,
            left: 1161,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#797980',
            margin: 0,
          }}
        >
          가족 사진, 지인, 장소 정보를 활용한 개인 맞춤형
          <br />
          회상 질문 생성 기능
        </p>

        {/* ── 하단 푸터 바 ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: DESIGN_W,
            height: 118,
            background: '#e5dfc8',
          }}
        />
      </div>
    </div>
  );
}
