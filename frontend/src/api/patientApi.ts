import axios from 'axios';

const USE_MOCK = false; 

const API_BASE_URL = 'http://localhost:8080';

export interface PatientInfo {
  p_code: number;
  name: string;
  diagnosis: string;
  personality: string;
}

export interface QuizItem {
  set_id: number;
  quiz_num: number;
  p_code: number;
  level: number;
  quiz_category: 'choice' | 'photo' | 'text';
  quiz_comment: string;
  quiz_photo: string | null;
  answer: string;
  options: string[];
  hints: string[];
}

export interface PatientCodeResponse {
  p_code: number;
}

export interface QuizAnswerPayload {
  pCode: number;
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
  pCode: number;
  totalCount: number;
  correctCount: number;
  hint: number;
  caculate: string;
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
  p_code: number;
  record_date: string;
  health_condition: string;
  sleep_status: string;
  meal_status: string;
  pain_status: string;
  mood_status: string;
  cognitive_changes: string[];
}



export const getPatientInfo = async (pCode: number): Promise<PatientInfo> => {
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
  const response = await axios.get(`${API_BASE_URL}/api/patient/${pCode}`);
  return response.data;
};


export const getPatientCode = async (pCode: number): Promise<PatientCodeResponse> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ p_code: pCode });
      }, 200);
    });
  }
  const response = await axios.get(`${API_BASE_URL}/api/patient/${pCode}/codepatient`);
  return response.data;
};


export const getTodayQuizzes = async (pCode: number): Promise<QuizItem[]> => {
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
          },
          {
            set_id: 1,
            quiz_num: 2,
            p_code: pCode,
            level: 2,
            quiz_category: "photo",
            quiz_comment: "사진 속 장소는 어디인가요?",
            quiz_photo: "https://via.placeholder.com/300x200?text=Jeonju",
            answer: "전주",
            options: [],
            hints: ["전라북도에 위치한 도시입니다."]
          },
          {
            set_id: 1,
            quiz_num: 3,
            p_code: pCode,
            level: 3,
            quiz_category: "text",
            quiz_comment: "첫 직장에서 몇 년 동안 근무하셨나요?",
            quiz_photo: null,
            answer: "15년",
            options: [],
            hints: ["30대에 가장 오래 다니신 회사입니다.", "10년 이상 근무하셨어요."]
          },
          {
            set_id: 1,
            quiz_num: 4,
            p_code: pCode,
            level: 1,
            quiz_category: "choice",
            quiz_comment: "어르신이 가장 싫어하시는 음식은 무엇인가요?",
            quiz_photo: null,
            answer: "피자",
            options: ["국밥", "햄버거", "라면", "피자"],
            hints: []
          },
          {
            set_id: 1,
            quiz_num: 5,
            p_code: pCode,
            level: 3,
            quiz_category: "text",
            quiz_comment: "햄버거 브랜드 중 어디를 가장 좋아하시나요?",
            quiz_photo: null,
            answer: "15년",
            options: [],
            hints: ["수제버거 브랜드입니다.", "앞 글자가 ㅍ으로 시작합니다."]
          },
          {
            set_id: 1,
            quiz_num: 6,
            p_code: pCode,
            level: 3,
            quiz_category: "text",
            quiz_comment: "가장 좋아하는 도시는 어디신가요?",
            quiz_photo: null,
            answer: "부산",
            options: [],
            hints: ["바닷가입니다.","경상남도에 위치한 도시입니다."]
          },
          {
            set_id: 1,
            quiz_num: 7,
            p_code: pCode,
            level: 2,
            quiz_category: "photo",
            quiz_comment: "사진 속 인물은 누구인가요?",
            quiz_photo: "https://via.placeholder.com/300x200?text=Jeonju",
            answer: "딸",
            options: [],
            hints: ["가족 구성원 중 여자입니다."]
          },
        ]);
      }, 400);
    });
  }
  const response = await axios.get(`${API_BASE_URL}/api/quiz/${pCode}/todaypatient`);
  return response.data;
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

  const response = await axios.post<QuizAnswerResponse>(
    `${API_BASE_URL}/api/quiz/${pCode}/${setId}/${quizNum}/answer`,
    {
      quiz_num: quizNum,
      answer: userAnswer, 
    }
  );
  return response.data;
};


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

  const response = await axios.post<QuizResultResponse>(
    `${API_BASE_URL}/api/quiz/result`,
    payload
  );
  return response.data;
};


export const getQuizResults = async (
  pCode: number,
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

  const response = await axios.get<QuizResultDetailResponse>(
    `${API_BASE_URL}/api/patients/${pCode}/results/${date}`,
    {
      params: queryDate ? { date: queryDate } : undefined
    }
  );
  return response.data;
};


export const getQuizFeedbacks = async (
  pCode: number,
  setId: number,
  quizId?: number
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

  const response = await axios.get<QuizFeedbackItem[]>(
    `${API_BASE_URL}/api/patients/${pCode}/quizSet/${setId}/feedbacks`,
    {
      params: quizId ? { quiz_id: quizId } : undefined
    }
  );
  return response.data;
};


export const postDailyStatus = async (
  pCode: number,
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

  const response = await axios.post<DailyStatusResponse>(
    `${API_BASE_URL}/api/patient/${pCode}/daily-status`,
    payload
  );
  return response.data;
};