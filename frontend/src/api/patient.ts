/**
 * 환자(Patient) 관련 API
 * 배치 위치: frontend/src/api/patient.ts
 *
 * S21 기억DB 수정, S24 퀴즈 결과 조회 등에서 사용
 * 모든 함수는 client.ts의 api 래퍼를 통해 호출됩니다.
 */
import { api } from './client';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 정보 조회
// GET /api/patient/{p_code}
// 사용처: 사이드바 환자 정보 표시
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface PatientInfo {
  p_code: number;
  name: string;
  diagnosis: string;    // "경도인지장애"
  personality: string;  // "온화함"
}

export const getPatient = (p_code: number) =>
  api.get<PatientInfo>(`/patient/${p_code}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 기본 정보 등록
// POST /api/patient/register
// 사용처: S05 환자기본정보
//
// 주의: 여기서 쓰는 pCode는 6자리 연동 코드(String)가 아니라
// PatientRegisterResponse.internal_code (Integer) 입니다. utils/pcode.ts 에 저장.
// speechStyle 은 백엔드에 @JsonProperty가 없어 "speech_style"이 아니라
// "speechStyle" 그대로 보내야 합니다.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface PatientRegisterRequest {
  diagnosis: string;
  gender: string;
  cognitive_support_level?: string;
  guardian_companion?: boolean;
  personality?: string;
  speechStyle?: string;
}

export interface PatientRegisterResponse {
  internal_code: number;
  p_code: string;
  message: string;
}

export const registerPatient = (data: PatientRegisterRequest) =>
  api.post<PatientRegisterResponse>('/patient/register', data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 음성 설정 저장
// PUT /api/patient/{pCode}/voice-setting
// 사용처: S06 음성설정
//
// dto/VoiceSettingRequestDto 기준(camelCase, JsonProperty 없음).
// 조회(GET) API는 없어서 응답값을 그대로 최신 상태로 씁니다.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface VoiceSettingRequest {
  ttsSpeed?: number;
  sentenceLength?: string;
  isHonorific?: boolean;
  isAutoPlay?: boolean;
  isRepeatGuide?: boolean;
  isLowPressure?: boolean;
  isPositiveFeedback?: boolean;
  speechStyle?: string;
}

export interface VoiceSettingResponse {
  ttsSpeed: number;
  sentenceLength: string;
  isHonorific: boolean;
  isAutoPlay: boolean;
  isRepeatGuide: boolean;
  isLowPressure: boolean;
  isPositiveFeedback: boolean;
  speechStyle: string | null;
}

export const saveVoiceSetting = (pCode: number, data: VoiceSettingRequest) =>
  api.put<VoiceSettingResponse>(`/patient/${pCode}/voice-setting`, data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 퀴즈 기록 전체 조회
// GET /api/patients/{p_code}/quiz-results?from=...&to=...
// 사용처: S24 의사 대시보드 (일일 리포트, 달력 점수)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface QuizResult {
  date: string;         // "2026-06-21"
  total_count: number;  // 총 문제 수
  correct_count: number; // 맞은 수
  hint: number;         // 힌트 사용 횟수
  calculate: string;    // AI 분석 코멘트
}

export const getQuizResults = (p_code: number, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const query = params.toString() ? `?${params}` : '';
  return api.get<QuizResult[]>(`/patients/${p_code}/quiz-results${query}`);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 일일 상태 조회 (특정 날짜)
// GET /api/patient/{pCode}/daily-status?date=2026-08-01
// 사용처: S18 보호자 홈 (오늘 상태)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface DailyStatus {
  status_id: number;
  p_code: number;
  record_date: string;
  health_condition: string;  // "좋음"
  sleep_status: string;      // "잘 잤음"
  meal_status: string;       // "식사함"
  pain_status: string;       // "없음"
  mood_status: string;       // "편안함"
  cognitive_changes: string[]; // ["반복 발화", "망상 또는 불안"]
}

export const getDailyStatus = (pCode: number, date: string) =>
  api.get<DailyStatus>(`/patient/${pCode}/daily-status?date=${date}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 일일 상태 이력 (전체)
// GET /api/patient/{pCode}/daily-status/history
// 사용처: S19 변화 추이 (7일 데이터)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const getDailyStatusHistory = (pCode: number) =>
  api.get<DailyStatus[]>(`/patient/${pCode}/daily-status/history`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 삶의 DB 조회
// GET /api/patients/{p_code}/memories/{memory_id}
// 사용처: S21 기억DB 수정 (페이지 로드 시 기존 데이터 불러오기)
//
// 백엔드 응답 예시:
// { title, category, record_date, family, hometown, job, place, like, events[] }
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface LifeDbEvent {
  event: string;       // 사건 설명
  photo_url: string;   // 사진 URL
  category: string;    // "기쁨", "슬픔" 등
}

export interface LifeDbResponse {
  title: string;
  category: string;
  record_date: string;
  family: string;      // 가족 정보 (직렬화된 문자열)
  hometown: string;
  job: string;
  place: string;       // 장소 정보
  like: string;        // 좋아하는 음식/노래 등
  events: LifeDbEvent[];
}

export const getMemory = (p_code: number, memory_id: number) =>
  api.get<LifeDbResponse>(`/patients/${p_code}/memories/${memory_id}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 삶의 DB 수정
// PATCH /api/patients/{p_code}/memories
// 사용처: S21 기억DB 수정 → "저장" 버튼
//
// body에 memory_id + 변경할 필드만 넘기면 됨
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface LifeDbUpdateRequest {
  memory_id: number;
  family?: string;
  hometown?: string;
  job?: string;
  place?: string;
  like?: string;
}

export const patchMemory = (p_code: number, data: LifeDbUpdateRequest) =>
  api.patch<{ memory_id: number; message: string }>(`/patients/${p_code}/memories`, data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 삶의 DB 사건 추가
// POST /api/patients/{p_code}/memories/{memory_id}
// 사용처: S21 기억DB → "항목 추가" 후 저장
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface LifeDbEventRequest {
  event: string;       // 사건 설명
  photo_url: string;   // 업로드된 사진 URL
  category: string;    // "기쁨" 등
}

export const addMemoryEvent = (p_code: number, memory_id: number, data: LifeDbEventRequest) =>
  api.post<{ event_id: number; memory_id: number; message: string }>(
    `/patients/${p_code}/memories/${memory_id}`, data
  );

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 세분화 사건 이미지 등록
// POST /api/patients/{p_code}/images
// Content-Type: multipart/form-data
// 사용처: S21 기억DB 수정 → 사진 업로드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { getToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const uploadPatientImage = async (p_code: number, file: File): Promise<{ photo_url: string; message: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/patients/${p_code}/images`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    throw new Error('이미지 업로드 실패');
  }

  return res.json();
};
