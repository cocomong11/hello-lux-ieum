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
