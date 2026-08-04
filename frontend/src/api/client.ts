/**
 * 공용 API 클라이언트
 * 모든 백엔드 호출은 이 파일을 거칩니다.
 * 컴포넌트에서 fetch를 직접 쓰지 마세요 — 주소·토큰 방식이 바뀌면 여기만 고치면 됩니다.
 *
 * 배치 위치: frontend/src/api/client.ts
 */

import { getToken, clearToken } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  /** true면 Authorization 헤더를 붙이지 않습니다 (로그인·회원가입용) */
  skipAuth?: boolean;
}

async function request<T>(
  path: string,
  { method = 'GET', body, skipAuth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // 네트워크 자체가 실패 — 백엔드가 안 떠 있을 때 여기로 옵니다
    throw new ApiError(
      0,
      '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
    }
    const message =
      ((parsed as { message?: string })?.message ??
        (typeof parsed === 'string' && parsed)) ||
      '요청을 처리하지 못했습니다.';
    throw new ApiError(res.status, message, parsed);
  }

  return parsed as T;
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};
