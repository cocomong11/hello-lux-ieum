import { createBrowserRouter } from 'react-router-dom'
import S01_Main         from '../pages/S01_Main'
import S02_Login        from '../pages/S02_Login'
import S03_Register     from '../pages/S03_Register'
import S04_RoleSelect   from '../pages/S04_RoleSelect'
import S05_PatientInfo  from '../pages/S05_PatientInfo'
import S06_VoiceSetting from '../pages/S06_VoiceSetting'
import S07_MemoryDB     from '../pages/S07_MemoryDB'
import S08_CodeLink     from '../pages/S08_CodeLink'
import S09_PatientHome  from '../pages/S09_PatientHome'
import S18_CargiverHome from '../pages/S18_CargiverHome'
import S19_CargiverReport from '../pages/S19_CargiverReport'
import S20_CargiverMemo from '../pages/S20_CargiverMemo'
import S21_CargiverUpdate from '../pages/S21_CargiverUpdate'
import S22_CargiverAlerm from '../pages/S22_CargiverAlerm'
import S27_MyPage       from '../pages/S27_MyPage'

const router = createBrowserRouter([
  // ── 공통 / 온보딩 ──────────────────────────────────
  { path: '/',              element: <S01_Main /> },
  { path: '/login',         element: <S02_Login /> },
  { path: '/register',      element: <S03_Register /> },
  { path: '/role-select',   element: <S04_RoleSelect /> },

  // ── 환자 초기 설정 흐름 ────────────────────────────
  { path: '/patient-info',  element: <S05_PatientInfo /> },
  { path: '/voice-setting', element: <S06_VoiceSetting /> },
  { path: '/memory-db',     element: <S07_MemoryDB /> },

  // ── 보호자 / 의료진 코드 연동 ─────────────────────
  { path: '/code-link',     element: <S08_CodeLink /> },

  // ── 역할별 홈 ──────────────────────────────────────
  { path: '/patient-home',  element: <S09_PatientHome /> },
  { path: '/cargiver-home', element: <S18_CargiverHome />},

  // ── 계정 ───────────────────────────────────────────
  { path: '/mypage',        element: <S27_MyPage /> },

  // ── 보호자 흐름───────────────────────────────────────────
  { path: '/cargiver-report', element: <S19_CargiverReport />},
  { path: '/cargiver-memo', element: <S20_CargiverMemo />},
  { path: '/cargiver-update', element: <S21_CargiverUpdate />},
  { path: '/cargiver-alerm', element: <S22_CargiverAlerm />},
])

export default router
