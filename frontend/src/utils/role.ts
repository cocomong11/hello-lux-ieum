export type UserRole = 'patient' | 'guardian' | 'doctor'

export const roleHome: Record<UserRole, string> = {
  patient:  '/patient-home',
  guardian: '/caregiver-home',
  doctor:   '/doctor-home',
}

export const saveRole = (role: UserRole) => localStorage.setItem('ieum_role', role)

/**
 * 저장된 역할을 읽습니다.
 * 값을 그대로 캐스팅하면 예전 버전이 남긴 값이나 대문자("PATIENT") 같은 예상 밖의
 * 문자열이 그대로 통과해, roleHome[role] 이 undefined 가 되고 navigate(undefined) 로
 * 이어집니다. 그래서 roleHome 의 키에 실제로 있는 값만 인정합니다.
 */
export const getRole = (): UserRole | null => {
  const raw = localStorage.getItem('ieum_role')
  return raw && raw in roleHome ? (raw as UserRole) : null
}

export const clearRole = () => localStorage.removeItem('ieum_role')
