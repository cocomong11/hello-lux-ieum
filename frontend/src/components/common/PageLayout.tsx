import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Navbar from './Navbar';

const DESIGN_W = 1920;
const NAVBAR_H = 68;

interface PageLayoutProps {
  children: ReactNode;
  canvasHeight?: number;
  scrollable?: boolean;
  noCanvas?: boolean;
}

export default function PageLayout({
  children,
  canvasHeight = 1171,
  scrollable = false,
  noCanvas = false,
}: PageLayoutProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (noCanvas) return;
    const update = () => {
      const designHeight = NAVBAR_H + canvasHeight;
      const next = scrollable
        ? Math.min(window.innerWidth / DESIGN_W, 1)
        : Math.min(
            window.innerWidth / DESIGN_W,
            window.innerHeight / designHeight,
            1,
          );
      setScale(next);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [canvasHeight, scrollable, noCanvas]);

  if (noCanvas) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', background: '#f8f9fa' }}>
        <Navbar />
        {children}
      </div>
    );
  }

  const canvasStyle: React.CSSProperties = {
    width: DESIGN_W,
    height: canvasHeight,
    position: 'relative',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
  };

  const pageStyle: React.CSSProperties = {
    width: DESIGN_W,
    height: NAVBAR_H + canvasHeight,
    position: 'absolute',
    top: 0,
    left: '50%',
    transformOrigin: 'top center',
    transform: `translateX(-50%) scale(${scale})`,
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
  };

  if (scrollable) {
    return (
      <div style={{ width: '100vw', overflowX: 'hidden', background: '#f8f9fa' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: (NAVBAR_H + canvasHeight) * scale,
          }}
        >
          <div style={pageStyle}>
            <Navbar />
            <div style={canvasStyle}>{children}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#f8f9fa' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={pageStyle}>
          <Navbar />
          <div style={canvasStyle}>{children}</div>
        </div>
      </div>
    </div>
  );
}
