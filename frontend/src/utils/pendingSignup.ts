/**
 * 회원가입 폼 임시 보관소
 * 배치 위치: frontend/src/utils/pendingSignup.ts
 *
 * 백엔드가 회원가입 요청에 role을 필수로 요구하는데,
 * 화면 흐름은 S03(정보 입력) → S04(역할 선택) 순서입니다.
 * 그래서 S03의 입력값을 잠시 들고 있다가 S04에서 한 번에 가입 요청을 보냅니다.
 *
 * sessionStorage를 쓰므로 탭을 닫으면 사라집니다.
 */

export interface PendingSignup {
  user_id: string;
  user_pw: string;
  name: string;
  birth_date: string;
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
