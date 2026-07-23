import { useState } from 'react';
import logo from '../assets/logo.png';

export type MemoryCategory =
  | '가족 정보'
  | '지인 정보'
  | '장소 정보'
  | '좋아하는 음식'
  | '인생 주요 사건'
  | '사진 자료';

const CATEGORIES: MemoryCategory[] = [
  '가족 정보',
  '지인 정보',
  '장소 정보',
  '좋아하는 음식',
  '인생 주요 사건',
  '사진 자료',
];

// 담당환자 카드가 빠진 만큼, 타이틀 바로 아래부터 시작
const TOPS = [150, 225, 300, 375, 450, 525];

type Props = {
  active: MemoryCategory;
  onChange: (cat: MemoryCategory) => void;
};

export default function MemoryDBSidebar({ active, onChange }: Props) {
  const [hovered, setHovered] = useState<MemoryCategory | null>(null);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 348,
        height: '100%',
        borderTopRightRadius: 20,
        background:
          'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)),' +
          'linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)',
        boxShadow: '0 0 10px 0 #4188ED',
      }}
    >
      {/* 로고 */}
      <img
        src={logo}
        alt='로고'
        style={{
          width: 71.36,
          height: 29,
          position: 'absolute',
          left: 267,
          top: 19,
        }}
      />

      {/* 카테고리 타이틀 (담당 환자 레이블 자리) */}
      <p
        style={{
          position: 'absolute',
          left: 49,
          top: 95,
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-neutral-10)',
        }}
      >
        카테고리
      </p>

      {/* 카테고리 메뉴 */}
      {CATEGORIES.map((cat, i) => {
        const isActive = active === cat;
        const isHovered = hovered === cat;

        return (
          <div
            key={cat}
            onMouseEnter={() => setHovered(cat)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(cat)}
            style={{
              position: 'absolute',
              top: TOPS[i],
              left: 47,
              width: 289,
              height: 59,
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              border: '2px solid rgba(65, 136, 237, 0.5)',
              background: isActive
                ? 'var(--color-primary-20, #0F66E2)'
                : isHovered
                  ? 'rgba(65, 136, 237, 0.1)'
                  : 'var(--color-neutral-100)',
              boxShadow: isActive
                ? '0 0 8px 0 var(--color-primary)'
                : isHovered
                  ? '0 0 6px 0 rgba(65, 136, 237, 0.3)'
                  : 'none',
              transition: 'background 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 29,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 400,
                lineHeight: '155%',
                color: isActive ? 'var(--color-neutral-100)' : 'inherit',
                pointerEvents: 'none',
              }}
            >
              {cat}
            </span>
          </div>
        );
      })}
    </div>
  );
}
