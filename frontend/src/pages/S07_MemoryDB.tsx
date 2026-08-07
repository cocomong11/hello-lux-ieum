// 삶의 DB 입력 화면. 보호자 흐름에 속합니다
// (보호자: 회원가입 → 역할선택 → 코드연동(S08) → 보호자홈 → 삶의DB(S07)).
// 대상 환자는 로그인한 보호자가 연동해 둔 환자이며, GET /api/guardian/patients 로 받아옵니다.
//
// 백엔드 LifeDbController/LifeDbRequestDto 기준으로 연동.
// family는 문자열 하나라서 가족 구성원 리스트를 "이름(나이, 호칭)" 형태로
// 이어붙여 저장합니다 (serializeFamilyMembers, 사용자 확인 완료).
// 사진 업로드는 POST /api/patients/{pCode}/images (multipart)를 사용합니다
// (api/patient.ts의 uploadPatientImage). LifeDbRequest에는 photo_url 필드가
// 하나뿐이라, 가족/지인/장소 중 먼저 업로드된 사진 하나만 memories 저장 요청에
// 함께 실리고 나머지는 사건 추가(addLifeDbEvent)로 등록합니다.
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imgUpload from '../assets/up-loading.png';
import imgPolygon from '../assets/Polygon 2.svg';
import MemoryDBSidebar, {
  type MemoryCategory,
} from '../components/MemoryDBSidebar';
import { createLifeDb, addLifeDbEvent, serializeFamilyMembers } from '../api/memory';
import { uploadPatientImage } from '../api/patient';
import { getLinkedPatients } from '../api/link';
import { ApiError } from '../api/client';

const CANVAS_H = 1660;
const DESIGN_W = 1920;
const SIDEBAR_W = 348;
const F: React.CSSProperties = {
  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
};

// 컴포넌트 함수 안에서 정의하면 렌더될 때마다 새로 생성되어 매 키 입력마다
// input이 remount되고(포커스·한글 조합 상태 소실) 커서가 밖으로 튕겨나갑니다.
// 그래서 전부 바깥(모듈 스코프)으로 뺐습니다. 스타일 객체는 그대로입니다.
const InputBox = ({
  left,
  top,
  width,
  placeholder,
  value,
  onChange,
  filled = false,
}: {
  left: number;
  top: number;
  width: number;
  placeholder: string;
  value: string;
  onChange?: (v: string) => void;
  filled?: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: 81,
      boxSizing: 'border-box',
      border: '1px solid #8e8e98',
      borderRadius: 10,
      background: filled ? 'rgba(65,136,237,0.05)' : '#f8f9fa',
      filter: 'drop-shadow(0 0 2px #4188ed)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 29,
      paddingRight: 29,
    }}
  >
    {onChange ? (
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
    ) : (
      <p
        style={{
          ...F,
          margin: 0,
          fontSize: 22,
          fontWeight: 400,
          lineHeight: '1.55',
          color: '#0d0d0d',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </p>
    )}
  </div>
);

const ColLabel = ({
  left,
  top,
  children,
}: {
  left: number;
  top: number;
  children: string;
}) => (
  <p
    style={{
      ...F,
      position: 'absolute',
      left,
      top,
      margin: 0,
      fontSize: 22,
      fontWeight: 400,
      lineHeight: '1.55',
      color: '#0d0d0d',
    }}
  >
    {children}
  </p>
);

const PhotoBox = ({
  left,
  top,
  label,
  photoUrl,
  uploading,
  errorMessage,
  onSelect,
}: {
  left: number;
  top: number;
  label: string;
  photoUrl?: string;
  uploading?: boolean;
  errorMessage?: string;
  onSelect: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          position: 'absolute',
          left,
          top,
          width: 296,
          height: 168,
          border: '1px solid #8e8e98',
          borderRadius: 10,
          background: 'rgba(217,217,217,0.2)',
          boxShadow: '0 0 4px #4188ed',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 21,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png'
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) onSelect(file);
          }}
        />
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={label}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <>
            <p
              style={{
                ...F,
                margin: 0,
                fontSize: 22,
                fontWeight: 400,
                lineHeight: '1.55',
                color: '#797980',
                textAlign: 'center',
              }}
            >
              {uploading ? '업로드 중...' : label}
              {!uploading && (
                <>
                  <br />
                  (JPG/PNG 최대 5MB)
                </>
              )}
            </p>
            <img
              src={imgUpload}
              alt=''
              style={{
                position: 'absolute',
                bottom: 20,
                width: 40,
                height: 40,
                opacity: 0.5,
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <p
          style={{
            ...F,
            position: 'absolute',
            left,
            top: top + 168 + 8,
            width: 296,
            margin: 0,
            fontSize: 16,
            fontWeight: 500,
            color: '#ff4d4f',
          }}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default function S07_MemoryDB() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  const [activeCategory, setActiveCategory] =
    useState<MemoryCategory>('가족 정보');
  const [members, setMembers] = useState([
    { name: '', age: '', relation: '' },
    { name: '', age: '', relation: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 삶의 DB는 보호자가 입력하는 화면입니다. 대상 환자는 로그인한 보호자가
  // S08에서 연동해 둔 환자이며, 그 내부 코드를 GET /api/guardian/patients 로 받아옵니다.
  // (여기서 오는 p_code는 6자리 연동 코드가 아니라 /patients/{p_code}/... 경로에 쓰는 Integer입니다)
  const [targetPCode, setTargetPCode] = useState<number | null>(null);
  const [targetName, setTargetName] = useState('');
  const [loadingPatient, setLoadingPatient] = useState(true);

  useEffect(() => {
    getLinkedPatients()
      .then((patients) => {
        if (patients.length === 0) {
          setErrorMessage('* 연동된 환자가 없습니다. 환자 코드를 먼저 연동해 주세요.');
          return;
        }
        setTargetPCode(patients[0].p_code);
        setTargetName(patients[0].name);
      })
      .catch((err) => {
        setErrorMessage(
          err instanceof ApiError
            ? `* ${err.message}`
            : '* 연동된 환자 정보를 불러오지 못했습니다.',
        );
      })
      .finally(() => setLoadingPatient(false));
  }, []);

  type PhotoKey = 'family' | 'acquaintance' | 'place';
  const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
  const [photoUploads, setPhotoUploads] = useState<
    Record<PhotoKey, { url?: string; uploading: boolean; error?: string }>
  >({
    family: { uploading: false },
    acquaintance: { uploading: false },
    place: { uploading: false },
  });

  const handlePhotoSelect = async (key: PhotoKey, file: File) => {
    const pCode = targetPCode;
    if (!pCode) {
      setPhotoUploads((prev) => ({
        ...prev,
        [key]: { ...prev[key], error: '* 연동된 환자가 없습니다.' },
      }));
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoUploads((prev) => ({
        ...prev,
        [key]: { ...prev[key], error: '* JPG/PNG 파일만 업로드할 수 있어요.' },
      }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoUploads((prev) => ({
        ...prev,
        [key]: { ...prev[key], error: '* 파일 크기는 5MB 이하여야 해요.' },
      }));
      return;
    }

    setPhotoUploads((prev) => ({
      ...prev,
      [key]: { ...prev[key], uploading: true, error: undefined },
    }));

    try {
      const res = await uploadPatientImage(pCode, file);
      setPhotoUploads((prev) => ({
        ...prev,
        [key]: { url: res.photo_url, uploading: false },
      }));
    } catch {
      setPhotoUploads((prev) => ({
        ...prev,
        [key]: { ...prev[key], uploading: false, error: '* 사진 업로드에 실패했어요.' },
      }));
    }
  };

  const PHOTO_LABELS: Record<PhotoKey, string> = {
    family: '가족 사진',
    acquaintance: '지인 사진',
    place: '장소 사진',
  };

  const handleComplete = async () => {
    const pCode = targetPCode;
    if (!pCode) {
      setErrorMessage('* 연동된 환자가 없습니다. 환자 코드를 먼저 연동해 주세요.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      // 백엔드(LifeDbService.saveLifeDb)는 event가 비어있으면 photo_url을 그냥
      // 버립니다(사진을 DetailEvent로만 저장하기 때문). 최초 등록(createLifeDb)엔
      // photo_url 슬롯이 하나뿐이라 첫 번째 사진만 함께 싣고, 나머지는 사건 추가
      // (addLifeDbEvent)로 하나씩 등록합니다.
      const uploadedPhotos = (['family', 'acquaintance', 'place'] as const)
        .filter((key) => photoUploads[key].url)
        .map((key) => ({
          label: PHOTO_LABELS[key],
          url: photoUploads[key].url as string,
        }));
      const [firstPhoto, ...restPhotos] = uploadedPhotos;

      const { memory_id } = await createLifeDb(pCode, {
        title: '가족 정보',
        family: serializeFamilyMembers(members),
        category: firstPhoto ? firstPhoto.label : '가족',
        ...(firstPhoto && {
          photo_url: firstPhoto.url,
          event: `${firstPhoto.label} 등록`,
        }),
      });

      const failedLabels: string[] = [];
      for (const photo of restPhotos) {
        try {
          await addLifeDbEvent(pCode, memory_id, {
            event: `${photo.label} 등록`,
            photo_url: photo.url,
            category: photo.label,
          });
        } catch {
          failedLabels.push(photo.label);
        }
      }

      if (failedLabels.length > 0) {
        setErrorMessage(
          `* 다음 사진은 저장하지 못했습니다: ${failedLabels.join(', ')}. 다시 시도해 주세요.`,
        );
        return;
      }

      navigate('/caregiver-home');
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? `* ${err.message}`
          : '* 기억 DB 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_W);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const updateMember = (
    idx: number,
    field: 'name' | 'age' | 'relation',
    value: string,
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { name: '', age: '', relation: '' }]);
  };

  const PREVIEW_QUESTIONS = [
    { text: '배우자 분 성함이 어떻게 되세요?', width: 338 },
    { text: '아드님 이름이 기억나시나요?', width: 309 },
    { text: '이 사진 속에 있는 사람은 누구인가요?', width: 381 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: CANVAS_H * scale,
        overflowX: 'hidden',
        background: 'var(--color-neutral-100)',
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: CANVAS_H,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          background: 'var(--color-neutral-100)',
        }}
      >
        <MemoryDBSidebar active={activeCategory} onChange={setActiveCategory} />

        <div style={{ marginLeft: SIDEBAR_W }}>
          <div
            style={{
              height: 67,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 24,
              paddingRight: SIDEBAR_W,
            }}
          >
            <button
              onClick={() => navigate('/caregiver-home')}
              style={{
                ...F,
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-neutral-gray)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              홈
            </button>
            <button
              onClick={() => navigate('/mypage')}
              style={{
                ...F,
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-neutral-gray)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              마이페이지
            </button>
          </div>
        </div>

        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 135,
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: '1.4',
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
          }}
        >
          가족 정보
          {targetName && (
            <span
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                color: '#797980',
                marginLeft: 12,
              }}
            >
              {targetName} 님
            </span>
          )}
        </p>

        <ColLabel left={636} top={203}>
          이름
        </ColLabel>
        <ColLabel left={917} top={203}>
          나이
        </ColLabel>
        <ColLabel left={1122} top={203}>
          호칭 / 유사표현
        </ColLabel>

        <InputBox
          left={636}
          top={251}
          width={263}
          placeholder='이름'
          value={members[0].name}
          onChange={(v) => updateMember(0, 'name', v)}
          filled
        />
        <InputBox
          left={917}
          top={251}
          width={187}
          placeholder='나이'
          value={members[0].age}
          onChange={(v) => updateMember(0, 'age', v)}
          filled
        />
        <InputBox
          left={1122}
          top={251}
          width={450}
          placeholder='호칭 / 유사표현'
          value={members[0].relation}
          onChange={(v) => updateMember(0, 'relation', v)}
          filled
        />

        <ColLabel left={636} top={358}>
          이름
        </ColLabel>
        <ColLabel left={917} top={358}>
          나이
        </ColLabel>
        <ColLabel left={1122} top={358}>
          호칭 / 유사표현
        </ColLabel>

        <InputBox
          left={636}
          top={406}
          width={263}
          placeholder='이름'
          value={members[1].name}
          onChange={(v) => updateMember(1, 'name', v)}
        />
        <InputBox
          left={917}
          top={406}
          width={187}
          placeholder='나이'
          value={members[1].age}
          onChange={(v) => updateMember(1, 'age', v)}
        />
        <InputBox
          left={1122}
          top={406}
          width={450}
          placeholder='호칭 / 유사표현'
          value={members[1].relation}
          onChange={(v) => updateMember(1, 'relation', v)}
        />

        {/* 가족 구성원 추가 버튼 */}
        <button
          onClick={addMember}
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 517,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 19,
            paddingRight: 19,
            paddingTop: 6,
            paddingBottom: 6,
            background: '#f8f9fa',
            border: '1px solid #8e8e98',
            borderRadius: 10,
            filter: 'drop-shadow(0 0 2px #797980)',
            cursor: 'pointer',
          }}
        >
          <svg
            width='22'
            height='23'
            viewBox='0 0 22 23'
            fill='none'
            stroke='#797980'
            strokeWidth='2'
            strokeLinecap='round'
          >
            <line x1='11' y1='5' x2='11' y2='18' />
            <line x1='4' y1='11.5' x2='18' y2='11.5' />
          </svg>
          <span
            style={{
              ...F,
              fontSize: 22,
              fontWeight: 700,
              color: '#797980',
              whiteSpace: 'nowrap',
            }}
          >
            가족 구성원 추가
          </span>
        </button>

        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 643,
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: '1.4',
            color: '#0d0d0d',
            whiteSpace: 'nowrap',
          }}
        >
          사진 업로드
        </p>
        <p
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 711,
            margin: 0,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: '1.55',
            color: '#797980',
            whiteSpace: 'nowrap',
          }}
        >
          *업로드된 사진은 개인화 회상 활동에 사용됩니다
        </p>

        <PhotoBox
          left={636}
          top={771}
          label='가족 사진 업로드'
          photoUrl={photoUploads.family.url}
          uploading={photoUploads.family.uploading}
          errorMessage={photoUploads.family.error}
          onSelect={(file) => handlePhotoSelect('family', file)}
        />
        <PhotoBox
          left={950}
          top={771}
          label='지인 사진 업로드'
          photoUrl={photoUploads.acquaintance.url}
          uploading={photoUploads.acquaintance.uploading}
          errorMessage={photoUploads.acquaintance.error}
          onSelect={(file) => handlePhotoSelect('acquaintance', file)}
        />
        <PhotoBox
          left={1264}
          top={771}
          label='장소 사진 업로드'
          photoUrl={photoUploads.place.url}
          uploading={photoUploads.place.uploading}
          errorMessage={photoUploads.place.error}
          onSelect={(file) => handlePhotoSelect('place', file)}
        />

        <div
          style={{
            position: 'absolute',
            left: 637,
            top: 965,
            width: 935,
            height: 421,
            border: '1px solid #4188ed',
            borderRadius: 10,
            background: 'rgba(65,136,237,0.05)',
            boxShadow: '0 0 4px #4188ed',
          }}
        >
          <p
            style={{
              ...F,
              position: 'absolute',
              left: 29,
              top: 24,
              margin: 0,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: '1.65',
              color: '#0d0d0d',
            }}
          >
            예상 생성 질문 미리보기
          </p>

          {PREVIEW_QUESTIONS.map((q, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 29,
                top: 70 + i * 90,
                width: q.width,
                height: 65,
                border: '1px solid #8e8e98',
                borderRadius: '20px 20px 20px 0',
                boxShadow: '0 0 4px #4188ed',
                background:
                  'linear-gradient(180deg, rgba(32,115,232,0.2) 0%, rgba(223,223,135,0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 29,
                boxSizing: 'border-box',
              }}
            >
              <p
                style={{
                  ...F,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: '1.55',
                  color: '#0d0d0d',
                  whiteSpace: 'nowrap',
                }}
              >
                {q.text}
              </p>
            </div>
          ))}

          <button
            style={{
              ...F,
              position: 'absolute',
              left: 29,
              top: 340,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 6,
              paddingBottom: 6,
              background: '#f8f9fa',
              border: '1px solid #8e8e98',
              borderRadius: 10,
              filter: 'drop-shadow(0 0 2px #797980)',
              cursor: 'pointer',
            }}
          >
            <img
              src={imgPolygon}
              alt=''
              style={{ width: 22, height: 24, transform: 'rotate(90deg)' }}
            />
            <span
              style={{
                ...F,
                fontSize: 22,
                fontWeight: 400,
                color: '#797980',
                whiteSpace: 'nowrap',
              }}
            >
              TTS 음성 읽어주기
            </span>
          </button>
        </div>

        <button
          onClick={() => navigate('/caregiver-home')}
          style={{
            ...F,
            position: 'absolute',
            left: 636,
            top: 1466,
            height: 59,
            paddingLeft: 24,
            paddingRight: 24,
            background: '#0d0d0d',
            borderRadius: 50,
            border: 'none',
            filter: 'drop-shadow(0 0 2px #4188ed)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#f8f9fa',
              whiteSpace: 'nowrap',
            }}
          >
            ← 이전
          </span>
        </button>

        {/* 임시저장 */}
        <button
          style={{
            ...F,
            position: 'absolute',
            left: 1299,
            top: 1466,
            height: 59,
            paddingLeft: 30,
            paddingRight: 30,
            background: '#f8f9fa',
            borderRadius: 50,
            border: 'none',
            filter: 'drop-shadow(0 0 2px #0d0d0d)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#0d0d0d',
              whiteSpace: 'nowrap',
            }}
          >
            임시저장
          </span>
        </button>

        {errorMessage && (
          <p
            style={{
              ...F,
              position: 'absolute',
              left: 636,
              top: 1428,
              margin: 0,
              color: '#ff4d4f',
              fontSize: 20,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* 완료 → */}
        <button
          onClick={handleComplete}
          disabled={loading || loadingPatient}
          style={{
            ...F,
            position: 'absolute',
            left: 1460,
            top: 1466,
            height: 59,
            paddingLeft: 24,
            paddingRight: 24,
            background: loading || loadingPatient ? '#8e8e98' : '#4188ed',
            borderRadius: 50,
            border: 'none',
            filter: 'drop-shadow(0 0 2px #4188ed)',
            cursor: loading || loadingPatient ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#f8f9fa',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '저장 중...' : loadingPatient ? '불러오는 중...' : '완료 →'}
          </span>
        </button>
      </div>
    </div>
  );
}
