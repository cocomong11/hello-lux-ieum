/**
 * 인증 API
 * 배치 위치: frontend/src/api/auth.ts
 *
 * 백엔드 확정 명세 기준 + 아이디 기반 전환 반영.
 *
 * 백엔드에 아직 요청이 필요한 항목:
 *   - user_email -> user_id 로 변경
 *   - 아이디 중복확인 엔드포인트 추가 (checkUserId)
 *   - 내 정보 조회 엔드포인트 추가 (getMe)
 */

import { api } from './client';
import type { UserRole } from '../utils/role';

/* ── 회원가입 ─────────────────────────────────────────────
   명세: POST /api/auth/register
   응답에 token이 없습니다. 가입 후 자동 로그인하려면
   이어서 login()을 호출해야 합니다 (S04에서 처리).            */

export interface RegisterRequest {
  user_id: string;
  user_pw: string;
  role: UserRole;
  name: string;
  birth_date: string; // YYYY-MM-DD
}

export interface RegisterResponse {
  user_id: string;
  role: UserRole;
  name: string;
  token?: string; // 백엔드가 나중에 넣어주면 자동 활용됨
}

export const register = (data: RegisterRequest) =>
  api.post<RegisterResponse>('/auth/register', data, { skipAuth: true });

/* ── 아이디 중복 확인 ─────────────────────────────────────
   아직 백엔드에 없는 엔드포인트입니다.
   추가되기 전까지 checkUserId는 404를 던집니다.               */

export interface CheckIdResponse {
  available: boolean;
}

export const checkUserId = (userId: string) =>
  api.get<CheckIdResponse>(
    `/auth/check-id?user_id=${encodeURIComponent(userId)}`,
    { skipAuth: true },
  );

/* ── 로그인 ───────────────────────────────────────────────
   명세: POST /api/auth/login -> { token, role, user_email }   */

export interface LoginRequest {
  user_id: string;
  user_pw: string;
}

export interface LoginResponse {
  token: string;
  role: UserRole;
  user_id: string;
}

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', data, { skipAuth: true });

/* ── 개인정보 수정 ────────────────────────────────────────
   명세: PUT /api/auth/profile                                */

export interface UpdateProfileRequest {
  name?: string;
  birth_date?: string;
  user_pw?: string;
}

export const updateProfile = (data: UpdateProfileRequest) =>
  api.put<{ message: string }>('/auth/profile', data);

/* ── 회원 탈퇴 ────────────────────────────────────────────
   명세: DELETE /api/auth/withdraw                            */

export const withdraw = () => api.delete<{ message: string }>('/auth/withdraw');

/* ── 내 정보 조회 ─────────────────────────────────────────
   명세에 없는 엔드포인트입니다. 추가 요청 중.
   S27 마이페이지가 이걸 필요로 합니다.                        */

export interface MeResponse {
  user_id: string;
  name: string;
  role: UserRole;
  p_code: number | null;
}

export const getMe = () => api.get<MeResponse>('/auth/me');
