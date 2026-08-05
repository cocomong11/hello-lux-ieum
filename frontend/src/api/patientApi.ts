import { api } from './client'; 

const USE_MOCK = false; // 백엔드 실제 통신 시 false 유지

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface PatientInfo {
  p_code: string;
  name: string;
  diagnosis: string;
  personality: string;
}

export interface PatientCodeResponse {
  p_code: string;
}

export interface QuizItem {
  set_id: number;
  quiz_num: number;
  p_code: string;
  level: number;
  quiz_category: 'choice' | 'photo' | 'text';
  quiz_comment: string;
  quiz_photo: string | null;
  answer: string;
  options: string[];
  hints: string[];
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
  pCode: string;
  totalCount: number;
  correctCount: number;
  hint: number;
  calculate: string;
  feedbackContent: string;
}

export interface QuizResultResponse {
  result_id?: number;
  message?: string;
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
  status_id: number;
  p_code: string;
  record_date: string;
  health_condition: string;
  sleep_status: string;
  meal_status: string;
  pain_status: string;
  mood_status: string;
  cognitive_changes: string[];
}

// ---------------------------------------------------------------------------
// API Functions (백엔드 QuizController 매핑 반영)
// ---------------------------------------------------------------------------

/**
 * 환자 코드 조회 (필요 시 유지)
 */
export const getPatientCode = async (pCode: string): Promise<PatientCodeResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ p_code: pCode });
      }, 200);
    });
  }
  return api.get<PatientCodeResponse>(`/patient/${pCode}/code`);
};

/**
 * 환자 정보 조회
 */
export const getPatientInfo = async (pCode: string): Promise<PatientInfo> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          p_code: pCode,
          name: "이지혜",
          diagnosis: "경도인지장애",
          personality: "온화함"
        });
      }, 300);
    });
  }
  return api.get<PatientInfo>(`/patient/${pCode}`);
};

/**
 * 오늘의 퀴즈 조회
 * 백엔드: GET /api/quiz/{p_code}/today
 */
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
            quiz_category: "choice",
            quiz_comment: "어르신이 가장 좋아하시는 음식은 무엇인가요?",
            quiz_photo: null,
            answer: "돈까스",
            options: ["돈까스", "김치찌개", "비빔밥", "국밥"],
            hints: []
          }
        ]);
      }, 400);
    });
  }
  return api.get<QuizItem[]>(`/quiz/${pCode}/today`);
};

/**
 * 퀴즈 문항별 정답 제출
 * 백엔드: POST /api/quiz/{p_code}/{set_id}/{quiz_num}/answer
 */
export const submitQuizAnswer = async ({
  pCode,
  setId,
  quizNum,
  userAnswer
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
      answer: userAnswer,
    }
  );
};

/**
 * 퀴즈 결과 최종 제출
 * 백엔드: POST /api/quiz/result/submit
 */
export const submitQuizResult = async (
  payload: QuizResultPayload
): Promise<QuizResultResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          result_id: 1,
          message: "성공적으로 저장되었습니다."
        });
      }, 300);
    });
  }

  return api.post<QuizResultResponse>('/quiz/result/submit', payload);
};

/**
 * 퀴즈 결과 상세 조회
 * 백엔드: GET /api/patients/{p_code}/results/{date} 또는 /api/patients/{p_code}/results
 */
export const getQuizResults = async (
  pCode: string,
  date: string,
  queryDate?: string
): Promise<QuizResultDetailResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          date: queryDate || date,
          total_count: 5,
          correct_count: 4,
          hint: 1,
          calculate: "최근 7일간 정답률이 안정적이며 학습 상태가 우수합니다."
        });
      }, 300);
    });
  }

  const query = queryDate ? `?date=${encodeURIComponent(queryDate)}` : '';
  return api.get<QuizResultDetailResponse>(`/patients/${pCode}/results/${date}${query}`);
};

/**
 * 퀴즈 피드백 조회
 * 백엔드: GET /api/patients/{p_code}/quizSet/{set_id}/feedbacks
 */
export const getQuizFeedbacks = async (
  pCode: string,
  setId: number,
  _quizId?: number
): Promise<QuizFeedbackItem[]> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            feedback_id: 1,
            set_id: setId,
            feedback_content: "오늘도 잘 하셨어요!",
            created_at: "2026-05-29"
          }
        ]);
      }, 300);
    });
  }

  return api.get<QuizFeedbackItem[]>(`/patients/${pCode}/quizSet/${setId}/feedbacks`);
};

/**
 * 환자 일일 상태 작성
 */
export const postDailyStatus = async (
  pCode: string,
  payload: DailyStatusPayload
): Promise<DailyStatusResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status_id: 5,
          p_code: pCode,
          record_date: "2026-08-02",
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