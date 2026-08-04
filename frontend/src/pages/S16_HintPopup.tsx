import React, { useState } from 'react';

interface HintPopupProps {
  hints?: string[];
  initialStep?: number;
  onClose: () => void;
  onStepChange?: (maxStep: number) => void;
}

export default function S16_HintPopup({ 
  hints = [], 
  initialStep = 1, 
  onClose, 
  onStepChange 
}: HintPopupProps) {
  
  const [currentStep, setCurrentStep] = useState<number>(initialStep); 
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(initialStep); 

 
  const totalHintsCount = hints.length > 0 ? hints.length : 1;

  const isMaxStep = currentStep >= 2 || currentStep >= totalHintsCount;

  
  const activeHintText = hints.length > 0 
    ? (hints[currentStep - 1] || hints[0]) 
    : '힌트 정보가 없습니다.';

 
  const handleNextStep = (): void => {
    if (!isMaxStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (nextStep > maxUnlockedStep) {
        setMaxUnlockedStep(nextStep);
        if (onStepChange) {
          onStepChange(nextStep);
        }
      }
    }
  };

  
  const handleTabClick = (step: number): void => {
    if (step <= maxUnlockedStep && step <= totalHintsCount) {
      setCurrentStep(step);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popupBox}>
        
       
        <div style={styles.header}>
          <span style={styles.headerTitle}>힌트</span>
          <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
        </div>

       
        <div style={styles.tabContainer}>
          {([1, 2] as const).map((step) => {
            const isUnlocked = step <= totalHintsCount && step <= maxUnlockedStep;
            
            const badgeStyle: React.CSSProperties = {
              ...styles.tabBadge,
              ...(currentStep === step ? styles.activeTab : styles.lockedTab),
              cursor: isUnlocked ? 'pointer' : 'not-allowed',
              pointerEvents: isUnlocked ? 'auto' : 'none',
              opacity: step <= totalHintsCount ? 1 : 0.4,
            };

            return (
              <button
                key={step}
                onClick={() => handleTabClick(step)}
                disabled={!isUnlocked} 
                style={badgeStyle}
              >
                {step}
              </button>
            );
          })}
        </div>

        <div style={styles.hintContentBox}>
          <div style={styles.hintStepTitle}>{currentStep}단계 힌트</div>
          <p style={styles.hintText}>{activeHintText}</p>
          
          <button style={styles.listenHintBtn} onClick={() => alert("힌트 음성을 재생합니다.")}>
            ▶ 힌트 듣기
          </button>
        </div>

       
        <div style={styles.footerBtnContainer}>
          <button 
            style={{
              ...styles.nextBtn,
              cursor: isMaxStep ? 'default' : 'pointer',
              pointerEvents: isMaxStep ? 'none' : 'auto',
              opacity: isMaxStep ? 0.5 : 1,
            }} 
            onClick={handleNextStep}
          >
            다음 힌트 보기 ({currentStep < 2 && totalHintsCount >= 2 ? 2 : currentStep}단계)
          </button>

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
    outline: 'none', transition: 'all 0.2s ease'
  },
  activeTab: { 
    backgroundColor: '#0F66E2', color: '#FFF', border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #0F66E2' 
  },
  lockedTab: { backgroundColor: '#F8F9FA', color: '#797980', border: '1px solid #797980', opacity: 0.5 },
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
    position: 'absolute', width: '456px', height: '34px', top: '68px', left: '29px',
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '19px',
    lineHeight: '155%', color: '#0D0D0D', textAlign: 'left', margin: 0, padding: 0
  },
  listenHintBtn: {
    position: 'absolute', width: '154px', height: '46px', top: '123px', left: '29px',
    borderRadius: '10px', border: '1px solid #0F66E2', backgroundColor: '#F8F9FA',
    color: '#0F66E2', fontWeight: 700, cursor: 'pointer', padding: '6px 19px 6px 19px',
    boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
  },
  footerBtnContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '24px' },
  nextBtn: {
    width: '339px', height: '59px', borderRadius: '50px', border: '1px solid #0F66E2',
    backgroundColor: '#F8F9FA', color: '#0F66E2', fontWeight: 700, fontSize: '16px',
    boxShadow: '0px 0px 4px 0px #0F66E2', transition: 'all 0.2s ease'
  },
  submitBtn: {
    width: '339px', height: '59px', borderRadius: '50px', border: 'none',
    backgroundColor: '#0F66E2', color: '#FFF', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 4px 0px #4188ED'
  }
};