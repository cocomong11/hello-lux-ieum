import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';
import { getRole } from '../../utils/role';
import { hasLinkedPatient } from '../../api/link';

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * true 면 보호자·의사가 환자를 연동했는지까지 확인하고,
   * 연동 전이면 코드 연동 화면(S08)으로 보냅니다.
   * 코드 연동 화면 자신과 마이페이지에는 쓰지 마세요(들어갈 수 없게 됩니다).
   */
  requireLink?: boolean;
}

type LinkState = 'checking' | 'ok' | 'need-link';

/** 토큰이 없으면 로그인 화면으로 보냅니다. 로그인/회원가입 등 공개 라우트에는 쓰지 않습니다. */
export default function ProtectedRoute({
  children,
  requireLink = false,
}: ProtectedRouteProps) {
  const loggedIn = isLoggedIn();
  const role = getRole();
  // 환자는 연동 대상이 아니므로 확인하지 않습니다.
  const mustCheck =
    loggedIn && requireLink && (role === 'guardian' || role === 'doctor');

  const [state, setState] = useState<LinkState>(mustCheck ? 'checking' : 'ok');

  useEffect(() => {
    if (!mustCheck || !role) {
      setState('ok');
      return;
    }
    let alive = true;
    hasLinkedPatient(role)
      .then((linked) => alive && setState(linked ? 'ok' : 'need-link'))
      // 조회 자체가 실패한 경우(서버 오류 등)까지 막으면 앱에 아예 못 들어가므로
      // 통과시킵니다. 인증 만료(401)라면 client.ts가 로그인 화면으로 보냅니다.
      .catch(() => alive && setState('ok'));
    return () => {
      alive = false;
    };
  }, [mustCheck, role]);

  if (!loggedIn) return <Navigate to='/login' replace />;
  if (state === 'checking') return null;
  if (state === 'need-link') return <Navigate to='/code-link' replace />;
  return <>{children}</>;
}
