import React from 'react';

interface HintPopupProps {
  onClose: () => void;                    
}

export default function S16_HintPopup({ onClose }: HintPopupProps) {
  return (
    <div style={styles.overlay}>
      <div style={styles.popupBox}>
        
        {/* 헤더 영역 */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>힌트</span>
          <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
        </div>

        {/* 상단 숫자 배지 탭 영역 (유지) */}
        <div style={styles.tabContainer}>
          {([1] as const).map((step) => {
            let badgeStyle: React.CSSProperties = { ...styles.tabBadge, ...styles.activeTab };

            return (
              <button
                key={step}
                style={badgeStyle}
              >
                {step}
              </button>
            );
          })}
        </div>

        {/* 힌트 본문 박스 */}
        <div style={styles.hintContentBox}>
          <div style={styles.hintStepTitle}>1단계 힌트</div>
          <p style={styles.hintText}>첫 번째 단계입니다. 문제를 다시 한번 천천히 읽어보세요.</p>
          
          <button style={styles.listenHintBtn} onClick={() => alert("힌트 음성을 재생합니다.")}>
            ▶ 힌트 듣기
          </button>
        </div>

        {/* 하단 정답 입력하러 가기 버튼 */}
        <div style={styles.footerContainer}>
          <button style={styles.submitBtn} onClick={onClose}>
            정답 입력하러 가기
          </button>
        </div>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  popupBox: {
    width: '752px', height: '503px', padding: '29px', boxSizing: 'border-box',
    backgroundColor: '#F8F9FA', border: '1px solid #0F66E2', borderRadius: '10px',
    boxShadow: '0px 0px 25px 0px rgba(65, 136, 237, 0.5)',
    display: 'flex', flexDirection: 'column'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerTitle: { fontWeight: 700, fontSize: '22px', color: '#0D0D0D', fontFamily: "'Pretendard Variable', Pretendard, sans-serif" },
  closeBtn: {
    padding: '5px 16px', borderRadius: '41.3px', border: '0.83px solid #0D0D0D',
    backgroundColor: '#F8F9FA', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 3.3px 0px #797980'
  },
  tabContainer: { display: 'flex', gap: '16px', marginBottom: '24px' },
  tabBadge: {
    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #797980',
    fontWeight: 700, fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    outline: 'none', cursor: 'default'
  },
  activeTab: { 
    backgroundColor: '#0F66E2', color: '#FFF', border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #0F66E2' 
  },
  hintContentBox: {
    width: '694px',
    height: '197px',
    borderRadius: '10px',
    background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(223, 223, 135, 0.2) 0%, rgba(248, 249, 250, 0.2) 100%)',
    border: '1px solid #4188ED',
    boxShadow: '0px 0px 4px 0px #4188ED',
    boxSizing: 'border-box',
    marginBottom: 'auto',
    position: 'relative' 
  },
  hintStepTitle: {
    position: 'absolute', width: '120px', height: '34px', top: '28px', left: '29px',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '20px',
    lineHeight: '155%', color: '#0F66E2', textAlign: 'left', margin: 0, padding: 0
  },
  hintText: {
    position: 'absolute', width: '550px', height: '34px', top: '68px', left: '29px',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '19px',
    lineHeight: '155%', color: '#0D0D0D', textAlign: 'left', margin: 0, padding: 0
  },
  listenHintBtn: {
    position: 'absolute', width: '154px', height: '46px', top: '123px', left: '29px',
    borderRadius: '10px', border: '1px solid #0F66E2', backgroundColor: '#F8F9FA',
    color: '#0F66E2', fontWeight: 700, cursor: 'pointer', padding: '6px 19px 6px 19px',
    boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
  },
  footerContainer: { display: 'flex', justifyContent: 'center', marginTop: '24px' },
  submitBtn: {
    width: '694px', height: '59px', borderRadius: '50px', border: 'none',
    backgroundColor: '#0F66E2', color: '#FFF', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 4px 0px #4188ED'
  }
};