/**
 * 기억 DB(삶의 DB) API
 * 배치 위치: frontend/src/api/memory.ts
 *
 * 백엔드 실제 컨트롤러 기준(controller/LifeDbController, dto/LifeDbRequestDto).
 *
 * 주의:
 * - family는 배열이 아니라 문자열 하나입니다. 화면의 가족 구성원 리스트는
 *   "이름(나이, 호칭)" 형태로 사람마다 만든 뒤 ", "로 이어붙여 저장합니다.
 * - photo_url은 문자열(이미 업로드된 URL)만 받습니다. 파일 자체를 업로드하려면
 *   api/patient.ts의 uploadPatientImage()로 먼저 올려 URL을 받은 뒤 이 필드에 넣습니다.
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

/**
 * 삶의 DB 사건(이벤트) 추가.
 * 명세: POST /api/patients/{p_code}/memories/{memory_id}
 * body: {"event": "...", "photo_url": "...", "category": "..."}
 *
 * LifeDbRequest.photo_url은 최초 등록(createLifeDb) 시 한 장만 함께 실을 수 있어서,
 * 사진이 여러 장이면 나머지는 이 엔드포인트로 하나씩 추가해야 합니다.
 */
export interface LifeDbEventRequest {
  event: string;
  photo_url: string;
  category: string;
}

export interface LifeDbEventResponse {
  event_id: number;
  memory_id: number;
  message: string;
}

export const addLifeDbEvent = (
  pCode: number,
  memoryId: number,
  data: LifeDbEventRequest,
) =>
  api.post<LifeDbEventResponse>(
    `/patients/${pCode}/memories/${memoryId}`,
    data,
  );

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
