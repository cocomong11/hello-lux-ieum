// 백엔드 PatientRegisterRequest(domain/patient/dto) 기준으로 연동.
// cognitive_support_level(인지 지원 수준), guardian_companion(보호자 동행 여부)
// 필드가 실제로 존재해서 연동합니다.
// name/birthdate는 회원가입(S03)에서 이미 Member에 저장되어 있고
// PatientRegisterRequest에는 해당 필드가 없어 전송하지 않습니다(화면 표시만).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { registerPatient } from '../api/patient';
import { savePCode } from '../utils/pcode';
import { ApiError } from '../api/client';

const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

// 컴포넌트 함수 안에서 정의하면 렌더될 때마다 새로 생성되어 매 키 입력마다
// input이 remount되고(포커스·한글 조합 상태 소실) 커서가 밖으로 튕겨나갑니다.
// 그래서 전부 바깥(모듈 스코프)으로 뺐습니다. 스타일 객체는 그대로입니다.
const SectionTitle = ({ children }: { children: string }) => (
  <p
    style={{
      ...F,
      margin: '0 0 24px 0',
      fontSize: 30,
      fontWeight: 700,
      lineHeight: '1.4',
      color: '#0d0d0d',
    }}
  >
    {children}
  </p>
);

const Label = ({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) => (
  <p
    style={{
      ...F,
      margin: '0 0 12px 0',
      fontSize: 22,
      fontWeight: 400,
      lineHeight: '1.55',
      color: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}
  >
    {children}
    {required && (
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#4188ed',
        }}
      />
    )}
  </p>
);

const TextInput = ({
  width = '100%',
  placeholder,
  value,
  onChange,
}: {
  width?: number | string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div
    style={{
      width,
      height: 81,
      border: '1px solid #8e8e98',
      borderRadius: 10,
      background: '#f8f9fa',
      boxShadow: '0 0 4px rgba(65,136,237,0.35)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 29px',
      boxSizing: 'border-box',
    }}
  >
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        ...F,
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 22,
        fontWeight: 400,
        lineHeight: '1.55',
        color: value ? '#0d0d0d' : '#797980',
      }}
    />
  </div>
);

const ChipBtn = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      ...F,
      padding: '6px 19px',
      border: selected ? '1px solid #dfdf87' : '1px solid #8e8e98',
      borderRadius: 10,
      background: selected ? '#0f66e2' : '#f8f9fa',
      filter: selected
        ? 'drop-shadow(0 0 2px #4188ed)'
        : 'drop-shadow(0 0 2px #797980)',
      cursor: 'pointer',
      fontSize: 22,
      fontWeight: selected ? 700 : 400,
      lineHeight: '1.55',
      color: selected ? '#f8f9fa' : '#797980',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
);

const LevelCard = ({
  value,
  description,
  selected,
  onSelect,
}: {
  value: '낮음' | '보통' | '높음';
  description: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    style={{
      width: '100%',
      height: 107,
      border: selected ? '1px solid #dfdf87' : '1px solid #8e8e98',
      borderRadius: 10,
      background: selected ? '#0f66e2' : '#f8f9fa',
      filter: selected
        ? 'drop-shadow(0 0 2px #2073e8)'
        : 'drop-shadow(0 0 2px #797980)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 29,
      boxSizing: 'border-box',
      marginBottom: 20,
    }}
  >
    <p
      style={{
        ...F,
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        lineHeight: '1.55',
        color: selected ? '#f8f9fa' : '#0d0d0d',
      }}
    >
      {value}
    </p>
    <p
      style={{
        ...F,
        margin: '4px 0 0 0',
        fontSize: 22,
        fontWeight: 400,
        lineHeight: '1.55',
        color: selected ? 'rgba(248,249,250,0.8)' : '#797980',
      }}
    >
      {description}
    </p>
  </button>
);

export default function S05_PatientInfo() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | '선택 안 함'>('남성');
  const [diagnosis, setDiagnosis] = useState('');
  const [level, setLevel] = useState<'낮음' | '보통' | '높음'>('낮음');
  const [companion, setCompanion] = useState<'동행' | '혼자'>('동행');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = async () => {
    if (!diagnosis.trim()) {
      setErrorMessage('* 주요 진단 상태를 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const res = await registerPatient({
        diagnosis,
        gender,
        cognitive_support_level: level,
        guardian_companion: companion === '동행',
      });
      savePCode(res.internal_code);
      navigate('/voice-setting');
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? `* ${err.message}`
          : '* 환자 정보 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout scrollable>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '120px 0',
        }}
      >
        <div
          style={{
            width: 648,
            display: 'flex',
            flexDirection: 'column',
            gap: 60,
          }}
        >
          <div>
            <SectionTitle>환자 기본 정보</SectionTitle>

            <div style={{ marginBottom: 30 }}>
              <Label required>이름 (실명)</Label>
              <TextInput
                placeholder='이름 (실명)'
                value={name}
                onChange={setName}
              />
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
              <div style={{ flex: 2 }}>
                <Label required>생년월일</Label>
                <TextInput
                  placeholder='생년월일 (8자리)'
                  value={birthdate}
                  onChange={setBirthdate}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Label>나이 (자동)</Label>
                <TextInput
                  placeholder='나이 (자동)'
                  value=''
                  onChange={() => {}}
                />
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <Label>성별</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                <ChipBtn
                  label='남성'
                  selected={gender === '남성'}
                  onClick={() => setGender('남성')}
                />
                <ChipBtn
                  label='여성'
                  selected={gender === '여성'}
                  onClick={() => setGender('여성')}
                />
                <ChipBtn
                  label='선택 안 함'
                  selected={gender === '선택 안 함'}
                  onClick={() => setGender('선택 안 함')}
                />
              </div>
            </div>

            <div>
              <Label required>주요 진단 상태</Label>
              <TextInput
                placeholder='ex. 경도인지장애, 초기 치매 등'
                value={diagnosis}
                onChange={setDiagnosis}
              />
            </div>
          </div>

          <div>
            <SectionTitle>인지 지원 수준</SectionTitle>
            <Label required>수준 선택</Label>
            <LevelCard
              value='낮음'
              description='간단한 안내만 있어도 활동을 수행할 수 있어요'
              selected={level === '낮음'}
              onSelect={() => setLevel('낮음')}
            />
            <LevelCard
              value='보통'
              description='힌트와 반복 안내가 있으면 더 편하게 수행할 수 있어요'
              selected={level === '보통'}
              onSelect={() => setLevel('보통')}
            />
            <LevelCard
              value='높음'
              description='짧은 문장, 충분한 음성 안내, 단계별 힌트가 필요해요'
              selected={level === '높음'}
              onSelect={() => setLevel('높음')}
            />
          </div>

          <div>
            <SectionTitle>보호자 동행 여부</SectionTitle>
            <div style={{ display: 'flex', gap: 12 }}>
              <ChipBtn
                label='활동 시 보호자 동행'
                selected={companion === '동행'}
                onClick={() => setCompanion('동행')}
              />
              <ChipBtn
                label='혼자 수행'
                selected={companion === '혼자'}
                onClick={() => setCompanion('혼자')}
              />
            </div>
          </div>

          {errorMessage && (
            <p
              style={{
                ...F,
                color: '#ff4d4f',
                fontSize: 20,
                fontWeight: 500,
                margin: '-20px 0 0 0',
                textAlign: 'left',
              }}
            >
              {errorMessage}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 40,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                ...F,
                height: 59,
                padding: '0 24px',
                background: '#0d0d0d',
                borderRadius: 50,
                border: 'none',
                filter: 'drop-shadow(0 0 2px #4188ed)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa' }}>
                ← 이전
              </span>
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                ...F,
                height: 59,
                padding: '0 24px',
                background: loading ? '#8e8e98' : '#4188ed',
                borderRadius: 50,
                border: 'none',
                filter: 'drop-shadow(0 0 2px #4188ed)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f8f9fa' }}>
                {loading ? '등록 중...' : '다음 →'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}