/**
 * 환자 코드 연동 API
 * 배치 위치: frontend/src/api/link.ts
 *
 * 보호자/의사가 6자리 환자 코드를 입력해 계정을 연결합니다.
 * p_code는 필드명과 달리 실제로는 6자리 문자열 코드입니다 (예: "AB37X2").
 *
 * ⚠️ 의사 연동 응답에는 아직 patient_name이 없을 수 있습니다
 *    (백엔드에서 추가 예정 — optional로 처리해뒀습니다)
 */

import { api } from './client';
import { getDoctorPatients } from './doctor';
import type { UserRole } from '../utils/role';

export interface LinkRequest {
  p_code: string; // 6자리 코드
}

export interface LinkResponse {
  message: string;
  patient_name?: string; // 의사 연동은 아직 없을 수 있음
}

export const linkGuardian = (code: string) =>
  api.post<LinkResponse>('/guardian/link', { p_code: code });

export const linkDoctor = (code: string) =>
  api.post<LinkResponse>('/doctor/link', { p_code: code });

/* ── 연동된 환자 목록 ─────────────────────────────────────
   명세: GET /api/guardian/patients
   여기서 내려오는 p_code는 연동 입력용 6자리 코드가 아니라
   내부 식별자(Integer)입니다. 삶의 DB(S07) 등 /patients/{p_code}/... 경로에
   그대로 넣어 쓰는 값입니다.                                 */

export interface LinkedPatient {
  p_code: number;
  name: string;
  last_score: number | null;
}

export const getLinkedPatients = () =>
  api.get<LinkedPatient[]>('/guardian/patients');

/**
 * 로그인한 사용자가 연동해 둔 환자가 있는지 확인합니다.
 * 보호자·의사는 환자를 연동해야 화면에 보여줄 데이터가 생기므로,
 * 연동 전에는 코드 연동 화면(S08)으로 보내기 위해 사용합니다.
 * 환자 본인은 연동 대상이 아니므로 항상 true 입니다.
 */
export const hasLinkedPatient = async (role: UserRole): Promise<boolean> => {
  if (role === 'guardian') return (await getLinkedPatients()).length > 0;
  if (role === 'doctor') return (await getDoctorPatients()).length > 0;
  return true;
};
