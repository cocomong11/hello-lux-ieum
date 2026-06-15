export type UserRole = 'patient' | 'guardian' | 'doctor'

export const saveRole = (role: UserRole) => localStorage.setItem('ieum_role', role)
export const getRole = (): UserRole | null => localStorage.getItem('ieum_role') as UserRole | null
export const clearRole = () => localStorage.removeItem('ieum_role')

export const roleHome: Record<UserRole, string> = {
  patient:  '/patient-home',
  guardian: '/guardian-home',
  doctor:   '/doctor-home',
}
