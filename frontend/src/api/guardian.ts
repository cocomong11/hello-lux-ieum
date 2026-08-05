/**
 * 보호자(Guardian) 관련 API
 * 배치 위치: frontend/src/api/guardian.ts
 *
 * S18 보호자 홈, S19 변화 추이, S20 메모 작성에서 사용
 * 모든 함수는 client.ts의 api 래퍼를 통해 호출됩니다.
 */
import { api } from './client';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 연동된 환자 목록 조회
// GET /api/guardian/patients
// 사용처: S18 보호자 홈 (연동된 환자 정보 표시)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface GuardianPatient {
  p_code: number;
  name: string;
  last_score: number;
}

export const getGuardianPatients = () =>
  api.get<GuardianPatient[]>('/guardian/patients');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 요약 대시보드
// GET /api/guardian/{p_code}/dashboard
// 사용처: S18 보호자 홈 (오늘 현황, 평균 점수, 트렌드)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface GuardianDashboard {
  avg_score: number;   // 평균 점수
  trend: string;       // "상승" | "하락" | "유지"
  last_quiz_date: string; // 마지막 퀴즈 날짜 "2026-05-29"
}

export const getGuardianDashboard = (p_code: number) =>
  api.get<GuardianDashboard>(`/guardian/${p_code}/dashboard`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 변화 추이 조회
// GET /api/guardian/{pCode}/trend?period=week
// 사용처: S19 변화 추이 (라인 차트 데이터)
// period: "week" | "month" | "3month"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface TrendResponse {
  labels: string[];   // X축 날짜 라벨 ["5/1", "5/8", ...]
  scores: number[];   // Y축 점수 [75, 80, 85, ...]
}

export const getGuardianTrend = (pCode: number, period: string = 'week') =>
  api.get<TrendResponse>(`/guardian/${pCode}/trend?period=${period}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상태 메모 목록 조회
// GET /api/guardian/{p_code}/memo
// 사용처: S20 메모 작성 (이전 메모 목록)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface MemoItem {
  memo_id: number;
  record_date: string;      // "2026-08-01"
  health_status: string;    // "좋음" | "보통" | "좋지 않음"
  sleep_status: string;     // "잘잠" | "보통" | "못 잠"
  meal_status: string;      // "식사함" | "식사 못 함"
  pain_status: string;      // "없음" | "있음"
  mood_status: string;      // "안정" | "불안" | "우울" | "화남" | "부기력"
  behaviors: string[];      // ["반복 발화", "망상 또는 불안", ...]
  need_referral: boolean;   // 전문기관 연계 필요 여부
  content: string;          // 특이 행동 메모 내용
  created_at: string;       // 생성일
}

export const getGuardianMemos = (p_code: number) =>
  api.get<MemoItem[]>(`/guardian/${p_code}/memo`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상태 메모 작성 (새 메모 저장)
// POST /api/guardian/{p_code}/memo
// 사용처: S20 메모 작성 → "저장" 버튼
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface MemoRequest {
  record_date: string;
  health_status: string;
  sleep_status: string;
  meal_status: string;
  pain_status: string;
  mood_status: string;
  behaviors: string[];
  need_referral: boolean;
  content: string;
}

export interface MemoCreateResponse {
  memo_id: number;
  created_at: string;
}

export const createGuardianMemo = (p_code: number, data: MemoRequest) =>
  api.post<MemoCreateResponse>(`/guardian/${p_code}/memo`, data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상태 메모 수정
// PUT /api/guardian/{pCode}/memo/{memoId}
// 사용처: S20 이전 메모 → "수정" 후 "저장"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updateGuardianMemo = (pCode: number, memoId: number, data: MemoRequest) =>
  api.put<MemoItem>(`/guardian/${pCode}/memo/${memoId}`, data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상태 메모 삭제
// DELETE /api/guardian/{pCode}/memo/{memoId}
// 사용처: S20 메모 → "삭제" 버튼
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const deleteGuardianMemo = (pCode: number, memoId: number) =>
  api.delete<{ message: string }>(`/guardian/${pCode}/memo/${memoId}`);
