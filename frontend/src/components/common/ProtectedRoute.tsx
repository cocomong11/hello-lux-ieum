import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/** 토큰이 없으면 로그인 화면으로 보냅니다. 로그인/회원가입 등 공개 라우트에는 쓰지 않습니다. */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isLoggedIn()) {
    return <Navigate to='/login' replace />;
  }
  return <>{children}</>;
}
