/**
 * 인증 API
 * 배치 위치: frontend/src/api/auth.ts
 *
 * 백엔드 실제 DTO(domain/member/dto) 기준으로 맞춤.
 * - RegisterRequest에는 role이 없습니다. 역할은 가입 후 PATCH /api/auth/role로 별도 설정합니다.
 * - GET /auth/check-id, GET /auth/me 모두 실제로 매핑되어 있습니다.
 */

import { api } from './client';
import type { UserRole } from '../utils/role';

/* ── 회원가입 ─────────────────────────────────────────────
   명세: POST /api/auth/register (요청에 role 필드 없음)
   응답에는 token이 실제로 포함됩니다(가입 시점엔 role 클레임이 비어있음).
   S04는 역할 설정(PATCH /auth/role) 후 role 클레임이 반영된 토큰을 다시
   받기 위해 로그인을 별도로 호출합니다. */

export interface RegisterRequest {
  user_id: string;
  user_pw: string;
  name: string;
  birth_date: string; // YYYY-MM-DD
}

export interface RegisterResponse {
  token: string;
  user_id: string;
  role: UserRole | null;
  name: string;
}

export const register = (data: RegisterRequest) =>
  api.post<RegisterResponse>('/auth/register', data, { skipAuth: true });

/* ── 아이디 중복 확인 ─────────────────────────────────────
   명세: GET /api/auth/check-id?user_id=...                  */

export interface CheckIdResponse {
  available: boolean;
}

export const checkUserId = (userId: string) =>
  api.get<CheckIdResponse>(
    `/auth/check-id?user_id=${encodeURIComponent(userId)}`,
    { skipAuth: true },
  );

/* ── 로그인 ───────────────────────────────────────────────
   명세: POST /api/auth/login -> { token, role, user_id, name }
   role은 역할 선택 전이면 null                                */

export interface LoginRequest {
  user_id: string;
  user_pw: string;
}

export interface LoginResponse {
  token: string;
  role: UserRole | null;
  user_id: string;
  name: string;
}

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', data, { skipAuth: true });

/* ── 역할 설정 ────────────────────────────────────────────
   명세: PATCH /api/auth/role (회원가입 → 역할선택에서 호출)
   인증 필요 (로그인 후 받은 토큰으로 호출)                     */

export interface UpdateRoleRequest {
  role: UserRole;
}

export const updateRole = (data: UpdateRoleRequest) =>
  api.patch<{ message: string }>('/auth/role', data);

/* ── 개인정보 수정 ────────────────────────────────────────
   명세: PUT /api/auth/profile
   current_pw(현재 비밀번호)는 본인 확인을 위해 필수입니다.     */

export interface UpdateProfileRequest {
  name?: string;
  birth_date?: string;
  current_pw: string;
  user_pw?: string;
}

export const updateProfile = (data: UpdateProfileRequest) =>
  api.put<{ message: string }>('/auth/profile', data);

/* ── 회원 탈퇴 ────────────────────────────────────────────
   명세: DELETE /api/auth/withdraw                            */

export const withdraw = () => api.delete<{ message: string }>('/auth/withdraw');

/* ── 내 정보 조회 ─────────────────────────────────────────
   명세: GET /api/auth/me
   p_code는 환자로 등록되지 않았으면 null이며, 등록되어 있어도
   6자리 문자열 코드입니다 (숫자 아님).                        */

export interface MeResponse {
  user_id: string;
  name: string;
  birth_date: string;
  phone: string;
  role: UserRole | null;
  p_code: string | null;
}

export const getMe = () => api.get<MeResponse>('/auth/me');
