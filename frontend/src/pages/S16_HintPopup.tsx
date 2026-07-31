interface HintPopupProps {
  isOpen?: boolean;
  onClose: () => void;
  onPlayAudio?: () => void;
  hintText?: string; 
}

export default function HintPopup({
  isOpen = true,
  onClose,
  onPlayAudio,
  hintText = "첫 번째 단계입니다. 문제를 다시 한번 천천히 읽어보세요."
}: HintPopupProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        backgroundColor: '#F8F9FA',
        borderRadius: '24px',
        border: '1px solid #0F66E2',
        boxShadow: '0px 0px 25px 0px #4188ED80',
        padding: '40px 48px 48px 48px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: '#0D0D0D' }}>
            힌트
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #0D0D0D',
              borderRadius: '50px',
              padding: '10px 24px',
              fontSize: '20px',
              fontWeight: 700,
              color: '#0D0D0D',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ✕ 닫기
          </button>
        </div>

      
        <div style={{
          width: '100%',
          borderRadius: '16px',
          border: '1px solid #4188ED',
          background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(223, 223, 135, 0.2) 0%, rgba(248, 249, 250, 0.2) 100%)',
          padding: '36px 40px',
          boxSizing: 'border-box',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: '0px 0px 4px 0px #4188ED',
          gap: '20px'
        }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#0F66E2' }}>
            힌트
          </span>
          <p style={{ margin: 0, fontSize: '24px', fontWeight:700, color: '#0D0D0D', lineHeight: '1.4' }}>
            {hintText} 
          </p>

          {/* 힌트 듣기 버튼 */}
          <button
            onClick={onPlayAudio}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #0F66E2',
              borderRadius: '12px',
              padding: '12px 28px',
              fontSize: '20px',
              fontWeight: 700,
              color: '#0F66E2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            ▶ 힌트 듣기
          </button>
        </div>

        {/* 정답 입력하러 가기 */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '68px',
            backgroundColor: '#0F66E2',
            border: 'none',
            borderRadius: '50px',
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0px 0px 4px 0px #4188ED'
          }}
        >
          정답 입력하러 가기
        </button>

      </div>
    </div>
  );
}
