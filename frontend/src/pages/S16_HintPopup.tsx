import React, { useState } from 'react';

interface HintItem {
  title: string;
  content: string;
}

interface HintDataType {
  [key: number]: HintItem;
}

interface HintPopupProps {
  onClose: () => void;                      
  onStepChange?: (maxStep: number) => void; 
}

const HINT_DATA: HintDataType = {
  1: { 
    title: "1단계 힌트", 
    content: "첫 번째 단계입니다. 문제를 다시 한번 천천히 읽어보세요." 
  },
  2: { 
    title: "2단계 힌트", 
    content: "5월에 접어들었고, 오늘이 그 달의 마지막 무렵이에요." 
  },
  3: { 
    title: "3단계 힌트", 
    content: "마지막 결정적 대형 힌트! 달력을 유심히 살펴보세요." 
  }
};

export default function S16_HintPopup({ onClose, onStepChange }: HintPopupProps) {
  const [currentStep, setCurrentStep] = useState<number>(1); 
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1); 

  // 다음 힌트 보기 버튼 클릭 시
  const handleNextStep = (): void => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // 새로 열린 힌트 단계가 기존 최대 단계보다 높다면 업데이트
      if (nextStep > maxUnlockedStep) {
        setMaxUnlockedStep(nextStep);
        //퀴즈 페이지의 힌트 카운트 상태를 실시간으로 동기화
        if (onStepChange) {
          onStepChange(nextStep);
        }
      }
    }
  };

  // 상단 숫자 탭 클릭 시
  const handleTabClick = (step: number): void => {
    if (step <= maxUnlockedStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popupBox}>
        
        {/* 헤더 영역 */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>힌트</span>
          {/* 닫기 버튼 누르면 부모가 이 컴포넌트를 안 보이게 처리함 */}
          <button style={styles.closeBtn} onClick={onClose}>✕ 닫기</button>
        </div>

        {/* 상단 숫자 배지 탭 */}
        <div style={styles.tabContainer}>
          {([1, 2, 3] as const).map((step) => {
            const isUnlocked = step <= maxUnlockedStep;
            let badgeStyle: React.CSSProperties = { ...styles.tabBadge };
            
            if (isUnlocked) {
              badgeStyle = { ...badgeStyle, ...styles.activeTab };
            } else {
              badgeStyle = { ...badgeStyle, ...styles.lockedTab };
            }

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

        {/* 힌트 본문 박스 */}
        <div style={styles.hintContentBox}>
          <div style={styles.hintStepTitle}>{HINT_DATA[currentStep]?.title}</div>
          <p style={styles.hintText}>{HINT_DATA[currentStep]?.content}</p>
          
          <button style={styles.listenHintBtn} onClick={() => alert("힌트 음성을 재생합니다.")}>
            ▶ 힌트 듣기
          </button>
        </div>

        {/* 하단 버튼 영역 */}
        <div style={styles.footerBtnContainer}>
          {currentStep < 3 ? (
            <button style={styles.nextBtn} onClick={handleNextStep}>
              다음 힌트 보기 ({currentStep + 1}단계)
            </button>
          ) : (
            <div style={{ width: '339px' }} />
          )}

          {/* 정답 입력하러 가기 버튼 클릭 시에도 안전하게 팝업만 닫음 */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 💡 뒤에 깔린 퀴즈 화면이 살짝 보이게 반투명 처리하면 더 자연스러워!
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
  headerTitle: { fontWeight: 700, fontSize: '22px', color: '#0D0D0D', fontFamily: 'sans-serif' },
  closeBtn: {
    padding: '5px 16px', borderRadius: '41.3px', border: '0.83px solid #0D0D0D',
    backgroundColor: '#F8F9FA', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 3.3px 0px #797980'
  },
  tabContainer: { display: 'flex', gap: '16px', marginBottom: '24px' },
  tabBadge: {
    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #797980',
    fontWeight: 700, fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    outline: 'none', cursor: 'pointer'
  },
  activeTab: { 
    backgroundColor: '#0F66E2', color: '#FFF', border: '1px solid #0F66E2', boxShadow: '0px 0px 4px 0px #0F66E2' 
  },
  lockedTab: { backgroundColor: '#F8F9FA', color: '#797980', border: '1px solid #797980', cursor: 'not-allowed', opacity: 0.5 },
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
    position: 'absolute', width: '95px', height: '34px', top: '28px', left: '29px',
    fontFamily: 'Pretendard Variable, sans-serif', fontWeight: 400, fontSize: '20px',
    lineHeight: '155%', color: '#0F66E2', textAlign: 'left', margin: 0, padding: 0
  },
  hintText: {
    position: 'absolute', width: '456px', height: '34px', top: '68px', left: '29px',
    fontFamily: 'Pretendard Variable, sans-serif', fontWeight: 700, fontSize: '19px',
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
    backgroundColor: '#F8F9FA', color: '#0F66E2', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 4px 0px #0F66E2'
  },
  submitBtn: {
    width: '339px', height: '59px', borderRadius: '50px', border: 'none',
    backgroundColor: '#0F66E2', color: '#FFF', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    boxShadow: '0px 0px 4px 0px #4188ED'
  }
};