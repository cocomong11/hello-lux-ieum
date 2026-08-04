/**
 * 액세스 토큰 저장소
 * 배치 위치: frontend/src/utils/auth.ts
 *
 * '자동 로그인' 체크 시 localStorage, 아니면 sessionStorage에 저장합니다.
 * (sessionStorage는 탭을 닫으면 사라집니다)
 */

const TOKEN_KEY = 'ieum_access_token';

export function setToken(token: string, persist: boolean) {
  clearToken();
  const store = persist ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}
