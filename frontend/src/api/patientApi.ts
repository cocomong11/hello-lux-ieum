import { api } from './client'; 

const USE_MOCK = false; 

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

export const getPatientCode = async (pCode: string): Promise<PatientCodeResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ p_code: pCode }), 200);
    });
  }
  return api.get<PatientCodeResponse>(`/patient/${pCode}/code`);
};

export const getPatientInfo = async (pCode: string): Promise<PatientInfo> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          p_code: pCode,
          name: "홍길동",
          diagnosis: "경도인지장애",
          personality: "온화함"
        });
      }, 300);
    });
  }
  return api.get<PatientInfo>(`/patient/${pCode}`);
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
      quiz_num: quizNum,
      answer: userAnswer,
    }
  );
};

// 💡 수정 완료: 백엔드 컨트롤러 주소와 일치하도록 `/quiz/result/submit`으로 변경
export const submitQuizResult = async (
  payload: QuizResultPayload
): Promise<QuizResultResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "퀴즈 결과가 성공적으로 저장되었습니다."
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
          calculate: "최근 7일간 정답률이 안정적이며 학습 상태가 우수합니다."
        });
      }, 300);
    });
  }

  return api.get<QuizResultDetailResponse>(`/patients/${pCode}/results/${date}`);
};

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