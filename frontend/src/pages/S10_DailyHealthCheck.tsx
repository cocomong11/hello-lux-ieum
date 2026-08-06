import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import loadingIcon from '../assets/loading.png';
import faceGood from '../assets/smileface.png';
import faceNormal from '../assets/normal.png';
import faceBad from '../assets/poorface.png';
import faceSleep from '../assets/sleepyface.png';
import faceTired from '../assets/tired.png';

import {
  getPatientMe,
  getTodayQuizzes,
  postDailyStatus,
  type QuizItem,
} from '../api/patientApi';

type ButtonStatus = 'READY' | 'LOADING' | 'MISSING' | 'FAIL';

export default function S10_DailyHealthCheck() {
  const navigate = useNavigate();
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>('READY');
  const [condition, setCondition] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [meal, setMeal] = useState<string | null>(null);
  const [pain, setPain] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [cognitiveChanges, setCognitiveChanges] = useState<string[]>([]);
  const [isMemoFocused, setIsMemoFocused] = useState<boolean>(false);
  const [memoText, setMemoText] = useState<string>('');

  // internalCode는 정수(number, 예: 1001) / pCodeStr은 6자리 문자열(string, 예: "HH5N7S")
  const [internalCode, setInternalCode] = useState<number | null>(null);
  const [pCodeStr, setPCodeStr] = useState<string>('');

  // 10번 페이지 진입 시 /api/patient/me 호출하여 내 식별자 정보 확보
  useEffect(() => {
    sessionStorage.removeItem('todayHealthCondition');
    sessionStorage.removeItem('conditionStatus');
    sessionStorage.removeItem('sleepStatus');
    sessionStorage.removeItem('moodStatus');

    const fetchMeInfo = async () => {
      try {
        const data = await getPatientMe();

        if (data) {
          // 1. internal_code (숫자값: 1001)
          const fetchedInternalCode = Number(data.internal_code || data.internalCode);
          if (!isNaN(fetchedInternalCode) && fetchedInternalCode > 0) {
            setInternalCode(fetchedInternalCode);
            sessionStorage.setItem('internal_code', String(fetchedInternalCode));
          }

          // 2. p_code (문자열: "HH5N7S")
          const fetchedPCode = data.p_code || data.pCode || '';
          if (fetchedPCode) {
            setPCodeStr(fetchedPCode);
            sessionStorage.setItem('p_code', fetchedPCode);
          }

          console.log('✅ 내 식별자 확보 성공:', {
            internalCode: fetchedInternalCode,
            pCode: fetchedPCode,
          });
        }
      } catch (error) {
        console.error('❌ /api/patient/me 호출 오류:', error);
      }
    };

    fetchMeInfo();
  }, []);

  const addCognitive = (value: string) => {
    if (cognitiveChanges.includes(value)) {
      setCognitiveChanges(cognitiveChanges.filter((item) => item !== value));
    } else {
      setCognitiveChanges([...cognitiveChanges, value]);
    }
    if (btnStatus === 'MISSING') setBtnStatus('READY');
  };

  const handleSaveAndNext = async () => {
    setBtnStatus('LOADING');

    try {
      // 1. internalCode (숫자) 가져오기
      const rawInternalCode =
        internalCode ||
        Number(sessionStorage.getItem('internal_code')) ||
        Number(sessionStorage.getItem('internalCode'));

      const targetInternalCode = Number(rawInternalCode);

      if (!targetInternalCode || isNaN(targetInternalCode)) {
        console.error('❌ 유효한 internalCode(숫자)를 찾을 수 없습니다.');
        setBtnStatus('FAIL');
        return;
      }

      // 2. pCode (문자열) 가져오기
      const targetPCode =
        pCodeStr ||
        sessionStorage.getItem('p_code') ||
        sessionStorage.getItem('pCode') ||
        '';

      const statusPayload = {
        health_condition: condition || '좋음',
        sleep_status: sleep || '잘 잤음',
        meal_status: meal || '식사함',
        pain_status: pain || '없음',
        mood_status: mood || '안정적',
        cognitive_changes: cognitiveChanges.length > 0 ? cognitiveChanges : ['없음'],
        memo: memoText,
      };

      // 3. Daily Status 저장 (정수형 internalCode 전달 -> /patient/1001/daily-status)
      console.log(`🚀 daily-status 요청 전송: /patient/${targetInternalCode}/daily-status`);
      const postResponse = await postDailyStatus(targetInternalCode, statusPayload as any);
      console.log('✅ 일일 상태 저장 성공:', postResponse);

      // 세션에 선택 상태 기록
      sessionStorage.setItem('todayHealthCondition', condition || '좋음');
      sessionStorage.setItem('conditionStatus', condition || '좋음');
      sessionStorage.setItem('sleepStatus', sleep || '잘 잤음');
      sessionStorage.setItem('moodStatus', mood || '안정적');

      // 4. Today Quizzes 조회 (문자열 pCode 전달 -> /quiz/HH5N7S/today)
      let quizzes: QuizItem[] = [];
      const quizCode = targetPCode || String(targetInternalCode);

      try {
        console.log(`🚀 퀴즈 요청 전송: /quiz/${quizCode}/today`);
        const res: any = await getTodayQuizzes(quizCode);

        if (Array.isArray(res)) {
          quizzes = res;
        } else if (res && Array.isArray(res.data)) {
          quizzes = res.data;
        } else if (res && Array.isArray(res.quizzes)) {
          quizzes = res.quizzes;
        }
      } catch (e) {
        console.warn('⚠️ 퀴즈 조회 실패, Fallback 데이터 적용:', e);
      }

      // Fallback 퀴즈
      if (!quizzes || quizzes.length === 0) {
        quizzes = [
          {
            set_id: 1,
            quiz_num: 1,
            p_code: quizCode,
            level: 1,
            quiz_category: 'choice',
            quiz_comment: '오늘 아침 식사로 무엇을 드셨나요?',
            answer: '밥과 국',
            options: ['밥과 국', '빵과 우유', '과일', '먹지 않음'],
            hints: [],
          },
        ];
      }

      sessionStorage.setItem('quizList', JSON.stringify(quizzes));
      sessionStorage.setItem('currentQuizIndex', '0');
      sessionStorage.setItem('completedActivityCount', '0');
      sessionStorage.setItem('totalHintCount', '0');

      const firstQuiz = quizzes[0];
      const rawCategory = firstQuiz?.quiz_category ?? (firstQuiz as any)?.category ?? 'choice';
      const category = String(rawCategory).toLowerCase().trim();

      // 카테고리별 라우팅
      if (category === 'choice' || category === '1') {
        navigate('/patient-voicechat');
      } else if (category === 'photo' || category === '2') {
        navigate('/patient-photo');
      } else if (category === 'text' || category === '3') {
        navigate('/patient-voicequiz');
      } else {
        navigate('/patient-voicechat');
      }
      // ---------------------------------------------------------
    } catch (error) {
      console.error('❌ 저장 중 오류 발생:', error);
      setBtnStatus('FAIL');
    }
  };

  const getSectionTitleStyle = (): CSSProperties => ({
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    fontWeight: 700,
    fontSize: '25px',
    lineHeight: '140%',
    color: '#0D0D0D',
    margin: '0 0 16px 0',
    textAlign: 'left',
    width: '100%',
  });

  const baseBoxStyle: CSSProperties = {
    backgroundColor: '#F8F9FA',
    border: '1px solid #8E8E98',
    boxShadow: '0px 0px 4px 0px #797980',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    fontSize: '17px',
    fontWeight: 500,
  };

  const blackTextDefaultStyle: CSSProperties = {
    ...baseBoxStyle,
    color: '#0D0D0D',
  };

  const grayTextDefaultStyle: CSSProperties = {
    ...baseBoxStyle,
    color: '#797980',
  };

  const activeBoxStyle: CSSProperties = {
    ...baseBoxStyle,
    backgroundColor: '#0F66E2',
    border: '1px solid #DFDF87',
    boxShadow: '0px 0px 4px 0px #4188ED',
    color: '#FFFFFF',
    fontWeight: 700,
  };

  const conditionOptions = [
    { label: '좋음', img: faceGood },
    { label: '보통', img: faceNormal },
    { label: '좋지 않음', img: faceBad },
  ];

  const sleepOptions = [
    { label: '잘 잤음', img: faceSleep },
    { label: '보통', img: faceNormal },
    { label: '거의 못 잠', img: faceTired },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        boxSizing: 'border-box',
        paddingBottom: '100px',
      }}
    >
      <Header />

      <div
        style={{
          width: '580px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: '60px auto 0 auto',
          transform: 'translateX(12px)',
          boxSizing: 'border-box',
        }}
      >
        {/* 오늘의 컨디션 */}
        <h2 style={getSectionTitleStyle()}>오늘의 컨디션</h2>
        <div style={{ display: 'flex', gap: '14px', width: '100%', marginBottom: '70px' }}>
          {conditionOptions.map((item) => (
            <div
              key={item.label}
              style={{
                ...(condition === item.label ? activeBoxStyle : blackTextDefaultStyle),
                width: '184px',
                height: '140px',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'center',
              }}
              onClick={() => {
                setCondition(item.label);
                if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
              }}
            >
              <img
                src={item.img}
                alt={item.label}
                style={{ width: '52px', height: '52px', objectFit: 'contain' }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 수면 상태 */}
        <h2 style={getSectionTitleStyle()}>수면 상태</h2>
        <div style={{ display: 'flex', gap: '14px', width: '100%', marginBottom: '70px' }}>
          {sleepOptions.map((item) => (
            <div
              key={item.label}
              style={{
                ...(sleep === item.label ? activeBoxStyle : blackTextDefaultStyle),
                width: '184px',
                height: '140px',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'center',
              }}
              onClick={() => {
                setSleep(item.label);
                if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
              }}
            >
              <img
                src={item.img}
                alt={item.label}
                style={{ width: '52px', height: '52px', objectFit: 'contain' }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 식사 여부 */}
        <h2 style={getSectionTitleStyle()}>식사 여부</h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '70px' }}>
          <div
            style={{
              ...(meal === '식사함' ? activeBoxStyle : grayTextDefaultStyle),
              width: '100px',
              height: '46px',
            }}
            onClick={() => {
              setMeal('식사함');
              if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
            }}
          >
            식사함
          </div>
          <div
            style={{
              ...(meal === '식사 못 함' ? activeBoxStyle : grayTextDefaultStyle),
              width: '120px',
              height: '46px',
            }}
            onClick={() => {
              setMeal('식사 못 함');
              if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
            }}
          >
            식사 못 함
          </div>
        </div>

        {/* 통증 / 불편감 */}
        <h2 style={getSectionTitleStyle()}>통증 / 불편감</h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '70px' }}>
          {['없음', '있음'].map((item) => (
            <div
              key={item}
              style={{
                ...(pain === item ? activeBoxStyle : grayTextDefaultStyle),
                width: '90px',
                height: '46px',
              }}
              onClick={() => {
                setPain(item);
                if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 오늘 기분 상태 */}
        <h2 style={getSectionTitleStyle()}>오늘 기분 상태</h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginBottom: '70px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { name: '안정적', w: '95px' },
            { name: '불안', w: '80px' },
            { name: '우울', w: '80px' },
            { name: '화남', w: '80px' },
            { name: '무기력', w: '95px' },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                ...(mood === item.name ? activeBoxStyle : grayTextDefaultStyle),
                width: item.w,
                height: '46px',
              }}
              onClick={() => {
                setMood(item.name);
                if (btnStatus === 'MISSING' || btnStatus === 'FAIL') setBtnStatus('READY');
              }}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* 오늘 행동 및 인지 변화 */}
        <h2 style={getSectionTitleStyle()}>
          오늘 행동 및 인지 변화 (중복 선택 가능)
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            width: '100%',
            marginBottom: '70px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <div
              style={{
                ...(cognitiveChanges.includes('반복 발화')
                  ? activeBoxStyle
                  : grayTextDefaultStyle),
                width: '125px',
                height: '46px',
              }}
              onClick={() => addCognitive('반복 발화')}
            >
              반복 발화
            </div>
            <div
              style={{
                ...(cognitiveChanges.includes('망상 또는 불안')
                  ? activeBoxStyle
                  : grayTextDefaultStyle),
                width: '145px',
                height: '46px',
              }}
              onClick={() => addCognitive('망상 또는 불안')}
            >
              망상 또는 불안
            </div>
            <div
              style={{
                ...(cognitiveChanges.includes('분노/우울 반응')
                  ? activeBoxStyle
                  : grayTextDefaultStyle),
                width: '145px',
                height: '46px',
              }}
              onClick={() => addCognitive('분노/우울 반응')}
            >
              분노/우울 반응
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div
              style={{
                ...(cognitiveChanges.includes('배회 (길을 헤맴)')
                  ? activeBoxStyle
                  : grayTextDefaultStyle),
                width: '145px',
                height: '46px',
              }}
              onClick={() => addCognitive('배회 (길을 헤맴)')}
            >
              배회 (길을 헤맴)
            </div>
            <div
              style={{
                ...(cognitiveChanges.includes('기타')
                  ? activeBoxStyle
                  : grayTextDefaultStyle),
                width: '85px',
                height: '46px',
              }}
              onClick={() => addCognitive('기타')}
            >
              기타
            </div>
          </div>
        </div>

        {/* 보호자 메모 (선택) */}
        <h2 style={getSectionTitleStyle()}>보호자 메모 (선택)</h2>
        <textarea
          placeholder="ex. 보호자가 자유롭게 적어 주세요."
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          onFocus={() => setIsMemoFocused(true)}
          onBlur={() => setIsMemoFocused(false)}
          style={{
            width: '100%',
            height: '120px',
            borderRadius: '10px',
            border: '1px solid #8E8E98',
            backgroundColor: isMemoFocused ? '#4188ED0D' : '#F8F9FA',
            boxShadow: isMemoFocused
              ? '0px 0px 8px 0px #4188ED'
              : '0px 0px 4px 0px #797980',
            padding: '16px',
            boxSizing: 'border-box',
            fontSize: '15px',
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            outline: 'none',
            resize: 'none',
            transition: 'background-color 300ms ease-out, box-shadow 300ms ease-out',
          }}
        />

        {/* 하단 버튼 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '50px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/patient-home')}
            style={{
              width: '170px',
              height: '50px',
              borderRadius: '50px',
              backgroundColor: '#0D0D0D',
              border: 'none',
              boxShadow: '0px 0px 4px 0px #4188ED',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ← 홈으로 돌아가기
          </button>

          {btnStatus === 'READY' && (
            <button
              type="button"
              onClick={handleSaveAndNext}
              style={{
                width: '170px',
                height: '50px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              저장 후 활동 시작 →
            </button>
          )}
          {btnStatus === 'LOADING' && (
            <button
              type="button"
              disabled
              style={{
                width: '142px',
                height: '50px',
                borderRadius: '50px',
                backgroundColor: '#4188ED',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              저장 중{' '}
              <img
                src={loadingIcon}
                alt="로딩 아이콘"
                style={{ width: '20px', height: '20px' }}
              />
            </button>
          )}
          {btnStatus === 'MISSING' && (
            <button
              type="button"
              onClick={handleSaveAndNext}
              style={{
                width: '126px',
                height: '50px',
                borderRadius: '50px',
                backgroundColor: '#DFDF87',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#0D0D0D',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              입력 누락
            </button>
          )}
          {btnStatus === 'FAIL' && (
            <button
              type="button"
              onClick={handleSaveAndNext}
              style={{
                width: '126px',
                height: '50px',
                borderRadius: '50px',
                backgroundColor: '#E53134',
                border: 'none',
                boxShadow: '0px 0px 4px 0px #4188ED',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              저장 실패 (재시도)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}