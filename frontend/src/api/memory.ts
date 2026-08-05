/**
 * 기억 DB(삶의 DB) API
 * 배치 위치: frontend/src/api/memory.ts
 *
 * 백엔드 실제 컨트롤러 기준(controller/LifeDbController, dto/LifeDbRequestDto).
 *
 * 주의:
 * - family는 배열이 아니라 문자열 하나입니다. 화면의 가족 구성원 리스트는
 *   "이름(나이, 호칭)" 형태로 사람마다 만든 뒤 ", "로 이어붙여 저장합니다.
 * - photo_url은 문자열(이미 업로드된 URL)만 받습니다. 파일을 직접 업로드하는
 *   API가 없어서 사진 첨부 기능은 TODO로 남겨둡니다.
 */

import { api } from './client';

export interface LifeDbRequest {
  title?: string;
  record_date?: string;
  family?: string;
  hometown?: string;
  job?: string;
  place?: string;
  like?: string;
  event?: string;
  // TODO: 업로드 API 대기 - 실제 파일 업로드 불가, URL 문자열만 가능
  photo_url?: string;
  category?: string;
}

export interface LifeDbCreateResponse {
  p_code: number;
  memory_id: number;
  message: string;
}

export const createLifeDb = (pCode: number, data: LifeDbRequest) =>
  api.post<LifeDbCreateResponse>(`/patients/${pCode}/memories`, data);

/** 화면의 가족 구성원 목록(이름/나이/호칭)을 백엔드 family(문자열) 필드로 직렬화 */
export function serializeFamilyMembers(
  members: { name: string; age: string; relation: string }[],
): string {
  return members
    .filter((m) => m.name.trim())
    .map((m) => {
      const parts = [m.age.trim(), m.relation.trim()].filter(Boolean);
      return parts.length > 0 ? `${m.name.trim()}(${parts.join(', ')})` : m.name.trim();
    })
    .join(', ');
}
