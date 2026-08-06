import { api } from './client';

const USE_MOCK = false;

// -------------------------------------------------------------------
// 타입 정의 (Interfaces)
// -------------------------------------------------------------------

// 백엔드 /api/patient/me 응답 타입 정의
export interface PatientMeResponse {
  internal_code: number;
  p_code: string;
  name?: string;
  gender?: string;
  diagnosis?: string;
  personality?: string | null;
  speech_style?: string | null;
  cognitive_support_level?: string;
  guardian_companion?: boolean;
  patient_status?: string | null;
  // 백엔드가 혹시 camelCase로 줄 때를 대비한 선택적 필드
  internalCode?: number;
  pCode?: string;
}

export interface PatientCodeResponse {
  p_code: string;
}

export interface QuizItem {
  set_id?: number;
  quiz_id?: number;
  quiz_num?: number;
  p_code?: string; // 퀴즈용 환자 코드는 string으로 통일
  level?: number;
  quiz_category?: 'choice' | 'photo' | 'text' | string;
  quiz_comment?: string;
  question?: string;
  quiz_photo?: string | null;
  answer?: string;
  options?: string[];
  hints?: string[];
}

export interface QuizAnswerPayload {
  pCode: string;
  setId: number;
  quizNum: number;
  userAnswer: string;
}

export interface QuizAnswerResponse {
  feedback: string;
  isCorrect: boolean;
}

export interface QuizResultPayload {
  setId: number;
  pCode: string | number; // 퀴즈 결과 제출 시 string 연동코드 또는 필요시 숫자 PK 지원
  totalCount: number;
  correctCount: number;
  hint: number;
  caculate: string; // 백엔드 DTO 변수명 오타(caculate) 반영
  feedbackContent: string;
}

export interface QuizResultResponse {
  message: string;
  [key: string]: any;
}

export interface QuizResultDetailResponse {
  date: string;
  total_count: number;
  correct_count: number;
  hint: number;
  calculate: string;
}

export interface QuizFeedbackItem {
  feedback_id: number;
  set_id: number;
  feedback_content: string;
  created_at: string;
}

export interface DailyStatusPayload {
  health_condition: string;
  sleep_status: string;
  meal_status: string;
  pain_status: string;
  mood_status: string;
  cognitive_changes: string[];
  memo?: string;
}

export interface DailyStatusResponse {
  status_id?: number;
  p_code?: string;
  record_date?: string;
  health_condition?: string;
  sleep_status?: string;
  meal_status?: string;
  pain_status?: string;
  mood_status?: string;
  cognitive_changes?: string[];
  [key: string]: any;
}

// -------------------------------------------------------------------
// API 호출 함수들
// -------------------------------------------------------------------

/**
 * /api/patient/me 호출 (로그인된 환자/보호자 본인 정보 조회)
 */
export const getPatientMe = async (): Promise<PatientMeResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          internal_code: 1001,
          p_code: 'HH5N7S',
          name: '홍길동',
        });
      }, 200);
    });
  }
  // client.ts의 api.get은 데이터 본문을 바로 반환합니다.
  return api.get<PatientMeResponse>('/patient/me');
};

export const getPatientCode = async (pCode: string): Promise<PatientCodeResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ p_code: pCode }), 200);
    });
  }
  return api.get<PatientCodeResponse>(`/patient/${pCode}/code`);
};

export const getTodayQuizzes = async (pCode: string): Promise<QuizItem[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            set_id: 1,
            quiz_num: 1,
            p_code: pCode,
            level: 1,
            quiz_category: 'choice',
            quiz_comment: '어르신이 가장 좋아하시는 음식은 무엇인가요?',
            quiz_photo: null,
            answer: '돈까스',
            options: ['돈까스', '김치찌개', '비빔밥', '국밥'],
            hints: [],
          },
        ]);
      }, 400);
    });
  }
  return api.get<QuizItem[]>(`/quiz/${pCode}/today`);
};

export const submitQuizAnswer = async ({
  pCode,
  setId,
  quizNum,
  userAnswer,
}: QuizAnswerPayload): Promise<QuizAnswerResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isCorrect: userAnswer.trim() !== '',
          feedback: `잘 하셨어요!`,
        });
      }, 200);
    });
  }

  return api.post<QuizAnswerResponse>(
    `/quiz/${pCode}/${setId}/${quizNum}/answer`,
    {
      quiz_num: quizNum,
      answer: userAnswer,
    }
  );
};

export const submitQuizResult = async (
  payload: QuizResultPayload
): Promise<QuizResultResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: '퀴즈 결과가 성공적으로 저장되었습니다.',
        });
      }, 300);
    });
  }

  return api.post<QuizResultResponse>('/quiz/result/submit', payload);
};

export const getQuizResults = async (
  pCode: string,
  date: string
): Promise<QuizResultDetailResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          date: date,
          total_count: 5,
          correct_count: 4,
          hint: 1,
          calculate: '최근 7일간 정답률이 안정적이며 학습 상태가 우수합니다.',
        });
      }, 300);
    });
  }

  return api.get<QuizResultDetailResponse>(`/patients/${pCode}/results/${date}`);
};

export const getQuizFeedbacks = async (
  patientCode: string,
  setId: string
): Promise<QuizFeedbackItem[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            feedback_id: 1,
            set_id: Number(setId),
            feedback_content: '오늘도 집중해서 활동을 잘 완료하셨습니다!',
            created_at: new Date().toISOString(),
          },
        ]);
      }, 300);
    });
  }

  return api.get<QuizFeedbackItem[]>(
    `/patients/${patientCode}/quizSet/${setId}/feedbacks`
  );
};

/**
 * 일일 상태 저장 API (POST)
 */
export const postDailyStatus = async (
  pCode: string | number,
  payload: DailyStatusPayload
): Promise<DailyStatusResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status_id: 5,
          p_code: String(pCode),
          record_date: new Date().toISOString().split('T')[0],
          health_condition: payload.health_condition,
          sleep_status: payload.sleep_status,
          meal_status: payload.meal_status,
          pain_status: payload.pain_status,
          mood_status: payload.mood_status,
          cognitive_changes: payload.cognitive_changes,
        });
      }, 300);
    });
  }

  return api.post<DailyStatusResponse>(
    `/patient/${pCode}/daily-status`,
    payload
  );
};

/**
 * 특정 날짜의 일일 상태 조회 API (GET)
 * GET /patient/{pCode}/daily-status?date=YYYY-MM-DD
 */
export const getDailyStatus = async (
  pCode: string | number,
  date: string
): Promise<DailyStatusResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status_id: 1,
          p_code: String(pCode),
          record_date: date,
          health_condition: '양호',
          sleep_status: '6-8시간',
          meal_status: '보통',
          pain_status: '없음',
          mood_status: '평온함',
          cognitive_changes: [],
        });
      }, 200);
    });
  }

  return api.get<DailyStatusResponse>(
    `/patient/${pCode}/daily-status?date=${date}`
  );
};