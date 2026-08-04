interface QuizResultCardProps {
  duration: string;
  hintCount?: number;
  resultDescription: string;
  feedback?: string;
  showHintCount?: boolean; 
}

export default function QuizResultCard({ 
  duration, 
  hintCount = 0, 
  resultDescription, 
  feedback, 
  showHintCount = true 
}: QuizResultCardProps) {
  return (
    <div style={{ 
      height: '170px', width: '648px', borderRadius: '10px', 
      border: '1px solid #4188ED', boxShadow: '0px 0px 4px 0px #4188ED', 
      background: 'linear-gradient(0deg, rgba(65, 136, 237, 0.05), rgba(65, 136, 237, 0.05)), linear-gradient(180deg, rgba(32, 115, 232, 0.2) 0%, rgba(223, 223, 135, 0.2) 100%)', 
      boxSizing: 'border-box', padding: '24px 29px', display: 'flex', 
      flexDirection: 'column', alignItems: 'flex-start', marginBottom: '50px' 
    }}>
      
      <h3 style={{ 
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif", 
        fontWeight: 700, 
        fontSize: '30px', 
        lineHeight: '140%', 
        color: '#0D0D0D', 
        margin: '0 0 6px 0' 
      }}>
        {feedback || '수고하셨습니다!'}
      </h3>

      <p style={{ 
        fontWeight: 780, 
        fontSize: '20px', 
        lineHeight: '145%', 
        color: '#0F66E2', 
        margin: '0 0 12px 0' 
      }}>
        {resultDescription}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: 700, color: '#797980' }}>
        <span>답변 소요 시간 : {duration}초</span>
        {showHintCount && <span>힌트 사용 : {hintCount}회</span>}
      </div>
    </div>
  );
}