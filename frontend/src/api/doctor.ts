/**
 * 의사(Doctor) 관련 API
 * 배치 위치: frontend/src/api/doctor.ts
 *
 * S23 의사 홈, S24 의사 대시보드, S26 난이도 설정에서 사용
 * 모든 함수는 client.ts의 api 래퍼를 통해 호출됩니다.
 */
import { api } from './client';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 담당 환자 목록 조회
// GET /api/doctor/patients
// 사용처: S23 의사 홈 (환자 카드 목록)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface DoctorPatient {
  p_code: number;
  name: string;
  diagnosis: string;  // "경도인지장애", "초기 치매" 등
}

export const getDoctorPatients = () =>
  api.get<DoctorPatient[]>('/doctor/patients');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 진료 참고 리포트 조회
// GET /api/doctor/{p_code}/report
// 사용처: S24 의사 대시보드 (의사 코멘트 불러오기)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface DoctorReport {
  avg_score: number;      // 평균 점수
  trend: string;          // "상승" | "하락" | "유지"
  feedback_list: string[]; // 피드백 목록
}

export const getDoctorReport = (p_code: number) =>
  api.get<DoctorReport>(`/doctor/${p_code}/report`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 진료 리포트 작성/수정
// PUT /api/doctor/{p_code}/report
// 사용처: S24 의사 대시보드 → "저장" 버튼 (의사 코멘트)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updateDoctorReport = (p_code: number, report: string) =>
  api.put<{ message: string }>(`/doctor/${p_code}/report`, { report });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 난이도 조절
// PUT /api/doctor/{pCode}/level
// 사용처: S26 난이도 설정 → "저장" 버튼
// 백엔드 미구현 상태 — paitient_status API로 대체 사용 중
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface LevelRequest {
  quiz_type: string;  // "multiple" | "text" | "photo"
  level: number;      // 1~3 (쉬움/보통/어려움)
}

export const updateDoctorLevel = (pCode: number, data: LevelRequest) =>
  api.put<{ message: string }>(`/doctor/${pCode}/level`, data);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 환자 상태 변경 (난이도 변경 시 사용)
// PUT /api/doctor/{p_code}/paitient_status
// 사용처: S26 난이도 설정 → "저장" 시 서버에 상태 전송
// ※ 백엔드에 실제 구현되어 있는 엔드포인트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const updatePatientStatus = (p_code: number, paitient_status: string) =>
  api.put<{ message: string }>(`/doctor/${p_code}/patient-status`, { paitient_status });
