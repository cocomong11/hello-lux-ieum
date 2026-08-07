import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/* ────────────────────────────────────────────────────────────────
   S01_Main — main.png(1920 × 3120) 픽셀 좌표 그대로 재현한 화면.
   모든 수치는 1920 폭 기준 절대 좌표이며,
   화면 폭에 맞춰 전체를 비율 그대로 scale 합니다.

   frontend/src/assets/ 에 필요한 파일
   ── 기존: mainbar.png / navbar.png / logo.png / mainf.png / maint.png / mains.png
   ── 신규: mainleft-cut.png / mainright-cut.png / mainlogo.png
            icon-patient.png / icon-caregiver.png / icon-doctor.png
            btn-start.png / btn-login.png
   ──────────────────────────────────────────────────────────────── */

import imgBg from '../assets/mainbar.png';
import imgBrainL from '../assets/mainleft-cut.png';
import imgBrainR from '../assets/mainright-cut.png';
import imgNavbar from '../assets/navbar.png';
import imgLogo from '../assets/logo.png';
import imgHeroLogo from '../assets/mainlogo.png';
import iconPatient from '../assets/patient.png';
import iconCaregiver from '../assets/caregiver.png';
import iconDoctor from '../assets/doctor.png';
import btnStart from '../assets/btn-start.png';
import btnLogin from '../assets/btn-login.png';
import imgFeature1 from '../assets/mainf.png';
import imgFeature2 from '../assets/maint.png';
import imgFeature3 from '../assets/mains.png';

/* ── 디자인 캔버스 ───────────────────────────────────────────── */
const CW = 1920; // 캔버스 폭
const CH = 3120; // 캔버스 높이

/* ── 색상 / 폰트 ─────────────────────────────────────────────── */
const FONT =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif";
const DARK = '#0D0D0D';
const GRAY = '#797980';
const BLUE = '#0F66E2';
const SURFACE = '#F8F9FA';
const TAG_BG = '#DFDF87';

/* ── 카드 / 행 좌표 ──────────────────────────────────────────── */
const CARD_LEFT = [347, 763, 1179];
const CARD_TOP = 565;
const CARD_W = 394;
const CARD_H = 358;

const ICONS = [
  { src: iconPatient, left: 482, w: 125 },
  { src: iconCaregiver, left: 901, w: 118 },
  { src: iconDoctor, left: 1333, w: 86 },
];

const CARD_TEXT = [
  { title: '환자', desc: ['TTS로 듣고 말로 답하는', '매일 인지 자극 활동'] },
  { title: '보호자', desc: ['활동 지원 건강 기록', '삶의 기억 DB 업데이트'] },
  { title: '의료진', desc: ['K-MMSE + 일일 데이터', '진료 참고 리포트 확인'] },
];

const ROWS = [
  {
    top: 1510,
    image: imgFeature1,
    imageLeft: 348,
    textLeft: 1161,
    tags: [{ label: '환자', left: 1161, w: 79 }],
    title: '매일 인지 자극 활동',
    desc: [
      '짧고 쉬운 문장과 음성 안내 및 단계별 힌트 제공',
      '퀴즈, 미술, 음악 등 다채로운 활동 연계',
    ],
  },
  {
    top: 1985,
    image: imgFeature2,
    imageLeft: 840,
    textLeft: 348,
    tags: [
      { label: '보호자', left: 348, w: 98 },
      { label: '의료진', left: 462, w: 98 },
    ],
    title: '보호자·의료진 연계',
    desc: [
      '일일 건강 데이터 기록 및 건강 변화 추이 분석',
      '월별 K-MMSE 검사 리포트 통합 조회 기능 제공',
    ],
  },
  {
    top: 2460,
    image: imgFeature3,
    imageLeft: 348,
    textLeft: 1161,
    tags: [{ label: '환자', left: 1161, w: 79 }],
    title: '개인 기억 DB 활용',
    desc: [
      '가족 사진, 지인, 장소 정보를 활용한 개인 맞춤형',
      '회상 질문 생성 기능',
    ],
  },
];

/* 행 상단(=사진 상단) 기준 오프셋 */
const TAG_DY = 45;
const TITLE_DY = 121.22;
const DESC_DY = 212.13;

/* ── 유틸 ────────────────────────────────────────────────────── */
const at = (
  left: number,
  top: number,
  extra: CSSProperties = {},
): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  margin: 0,
  ...extra,
});

const Img = ({
  src,
  alt,
  left,
  top,
  width,
  height,
}: {
  src: string;
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
}) => (
  <img
    src={src}
    alt={alt}
    draggable={false}
    style={{
      ...at(left, top),
      width,
      height,
      display: 'block',
      pointerEvents: 'none',
    }}
  />
);

const Text = ({
  left,
  top,
  width,
  size,
  lineHeight,
  weight,
  color,
  align = 'left',
  children,
}: {
  left: number;
  top: number;
  width?: number;
  size: number;
  lineHeight: number;
  weight: number;
  color: string;
  align?: 'left' | 'center';
  children: ReactNode;
}) => (
  <div
    style={{
      ...at(left, top),
      width,
      fontFamily: FONT,
      fontSize: size,
      lineHeight: `${lineHeight}px`,
      fontWeight: weight,
      color,
      textAlign: align,
      whiteSpace: 'pre',
      letterSpacing: 0,
    }}
  >
    {children}
  </div>
);

/* ── 컴포넌트 ────────────────────────────────────────────────── */
export default function S01_Main() {
  const navigate = useNavigate();
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const apply = () => setScale(el.clientWidth / CW);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const plain: CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'block',
  };

  return (
    <div
      ref={hostRef}
      style={{
        position: 'relative',
        width: '100%',
        height: CH * scale,
        overflow: 'hidden',
        background: SURFACE,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: CW,
          height: CH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: FONT,
        }}
      >
        {/* ══ 배경: 상단 그라데이션 + 하단 띠 (가운데는 투명) ══ */}
        <Img src={imgBg} alt='' left={0} top={0} width={CW} height={CH} />
        <Img
          src={imgBrainL}
          alt=''
          left={0}
          top={0}
          width={876}
          height={1167}
        />
        <Img
          src={imgBrainR}
          alt=''
          left={853}
          top={0}
          width={1067}
          height={1167}
        />

        {/* ══ 네비게이션 바 ══ */}
        <Img src={imgNavbar} alt='' left={0} top={0} width={CW} height={75} />
        <button
          style={{ ...plain, ...at(358, 19) }}
          onClick={() => navigate('/')}
          aria-label='이음 홈'
        >
          <img
            src={imgLogo}
            alt='이음'
            draggable={false}
            style={{ width: 72, height: 29, display: 'block' }}
          />
        </button>
        <button
          style={{
            ...plain,
            ...at(1468, 25.05),
            fontFamily: FONT,
            fontSize: 16,
            lineHeight: '16px',
            fontWeight: 700,
            color: GRAY,
          }}
          onClick={() => navigate('/')}
        >
          홈
        </button>
        <button
          style={{
            ...plain,
            ...at(1514, 25.05),
            fontFamily: FONT,
            fontSize: 16,
            lineHeight: '16px',
            fontWeight: 700,
            color: GRAY,
          }}
          onClick={() => navigate('/login')}
        >
          로그인
        </button>

        {/* ══ 히어로 ══ */}
        <Img
          src={imgHeroLogo}
          alt='이음'
          left={491}
          top={157}
          width={745}
          height={219}
        />

        <Text
          left={0}
          top={436.8}
          width={CW}
          size={30}
          lineHeight={30}
          weight={400}
          color={DARK}
          align='center'
        >
          <span style={{ fontSize: 32, fontWeight: 700 }}>경증 치매 환자</span>
          를 위한 디지털 케어 플랫폼
        </Text>
        <Text
          left={0}
          top={477.9}
          width={CW}
          size={30}
          lineHeight={30}
          weight={400}
          color={DARK}
          align='center'
        >
          인지 기능 유지 · 보호자 기록 · 의료진 리포트
        </Text>

        {/* 카드 3종 */}
        {CARD_LEFT.map((left) => (
          <div
            key={left}
            style={{
              ...at(left, CARD_TOP),
              width: CARD_W,
              height: CARD_H,
              borderRadius: 16,
              background: SURFACE,
              boxShadow: '0 0 6.5px rgba(8, 100, 232, 0.9)',
            }}
          />
        ))}
        {ICONS.map((ic) => (
          <Img
            key={ic.left}
            src={ic.src}
            alt=''
            left={ic.left}
            top={609}
            width={ic.w}
            height={125}
          />
        ))}
        {CARD_TEXT.map((c, i) => (
          <div key={c.title}>
            <Text
              left={CARD_LEFT[i]}
              top={763.48}
              width={CARD_W}
              size={36}
              lineHeight={36}
              weight={700}
              color={BLUE}
              align='center'
            >
              {c.title}
            </Text>
            <Text
              left={CARD_LEFT[i]}
              top={812.63}
              width={CARD_W}
              size={22}
              lineHeight={34}
              weight={400}
              color={GRAY}
              align='center'
            >
              {c.desc[0]}
              <br />
              {c.desc[1]}
            </Text>
          </div>
        ))}

        {/* 버튼 */}
        <button
          style={{ ...plain, ...at(716, 990) }}
          onClick={() => navigate('/register')}
        >
          <img
            src={btnStart}
            alt='시작하기(신규 가입)'
            draggable={false}
            style={{ width: 276, height: 65, display: 'block' }}
          />
        </button>
        <button
          style={{ ...plain, ...at(1045, 990) }}
          onClick={() => navigate('/login')}
        >
          <img
            src={btnLogin}
            alt='로그인'
            draggable={false}
            style={{ width: 159, height: 65, display: 'block' }}
          />
        </button>

        {/* ══ 주요 서비스 안내 ══ */}
        <Text
          left={0}
          top={1311.22}
          width={CW}
          size={54}
          lineHeight={54}
          weight={700}
          color={DARK}
          align='center'
        >
          주요 서비스 안내
        </Text>

        {ROWS.map((row) => (
          <div key={row.top}>
            <Img
              src={row.image}
              alt=''
              left={row.imageLeft}
              top={row.top}
              width={725}
              height={339}
            />

            {row.tags.map((tag) => (
              <div
                key={tag.label}
                style={{
                  ...at(tag.left, row.top + TAG_DY),
                  width: tag.w,
                  height: 42,
                  borderRadius: 21,
                  background: TAG_BG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT,
                  fontSize: 22,
                  lineHeight: '22px',
                  fontWeight: 700,
                  color: DARK,
                }}
              >
                {tag.label}
              </div>
            ))}

            <Text
              left={row.textLeft}
              top={row.top + TITLE_DY}
              size={54}
              lineHeight={54}
              weight={700}
              color={DARK}
            >
              {row.title}
            </Text>
            <Text
              left={row.textLeft}
              top={row.top + DESC_DY}
              size={22}
              lineHeight={34}
              weight={400}
              color={GRAY}
            >
              {row.desc[0]}
              <br />
              {row.desc[1]}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
