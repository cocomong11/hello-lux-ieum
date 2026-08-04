/**
 * 회원가입 폼 임시 보관소
 * 배치 위치: frontend/src/utils/pendingSignup.ts
 *
 * 화면 흐름은 S03(정보 입력) → S04(역할 선택) 순서지만,
 * 실제 회원가입 API(POST /auth/register) 호출은 S04에서 이뤄집니다.
 * 그래서 S03의 입력값을 잠시 들고 있다가 S04에서 한 번에 가입 요청을 보냅니다.
 *
 * sessionStorage를 쓰므로 탭을 닫으면 사라집니다.
 *
 * TODO: 백엔드 RegisterRequest는 phone을 필수로 요구하지만 S03 화면에는
 * 전화번호 입력란이 없습니다. UI에 필드가 추가되기 전까지는 더미 값으로 채웁니다.
 */

export interface PendingSignup {
  user_id: string;
  user_pw: string;
  name: string;
  birth_date: string;
  phone: string;
}

const KEY = 'ieum_pending_signup';

export function savePendingSignup(data: PendingSignup) {
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function getPendingSignup(): PendingSignup | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingSignup;
  } catch {
    return null;
  }
}

export function clearPendingSignup() {
  sessionStorage.removeItem(KEY);
}
