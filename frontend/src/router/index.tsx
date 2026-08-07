import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute    from '../components/common/ProtectedRoute'
import S01_Main         from '../pages/S01_Main'
import S02_Login        from '../pages/S02_Login'
import S03_Register     from '../pages/S03_Register'
import S04_RoleSelect   from '../pages/S04_RoleSelect'
import S05_PatientInfo  from '../pages/S05_PatientInfo'
import S06_VoiceSetting from '../pages/S06_VoiceSetting'
import S07_MemoryDB     from '../pages/S07_MemoryDB'
import S08_CodeLink     from '../pages/S08_CodeLink'
import S09_PatientHome  from '../pages/S09_PatientHome'
import S10_DailyHealthCheck from '../pages/S10_DailyHealthCheck'
import S11_TextVoiceQuiz from '../pages/S11_TextVoiceQuiz'
import S12_PhotoRecallQuiz from '../pages/S12_PhotoRecallQuiz'
import S13_RecallVoiceChat from '../pages/S13_RecallVoiceChat'


import S17_ActivityReport from '../pages/S17_ActivityResult'
import S18_CargiverHome from '../pages/S18_CargiverHome'
import S19_CargiverReport from '../pages/S19_CargiverReport'
import S20_CargiverMemo from '../pages/S20_CargiverMemo'
import S21_CargiverUpdate from '../pages/S21_CargiverUpdate'
import S22_CargiverAlerm from '../pages/S22_CargiverAlerm'


import S23_DoctorHome from '../pages/S23_DoctorHome'
import S24_DoctorDashboard from '../pages/S24_DoctorDashboard'
import S26_DoctorLevel from '../pages/S26_DoctorLevel'

import S27_MyPage       from '../pages/S27_MyPage'


const router = createBrowserRouter([
  // ── 공통 / 온보딩 ──────────────────────────────────
  { path: '/',              element: <S01_Main /> },
  { path: '/login',         element: <S02_Login /> },
  { path: '/register',      element: <S03_Register /> },
  { path: '/role-select',   element: <S04_RoleSelect /> },

  // ── 환자 초기 설정 흐름 ────────────────────────────
  { path: '/patient-info',  element: <ProtectedRoute><S05_PatientInfo /></ProtectedRoute> },
  { path: '/voice-setting', element: <ProtectedRoute><S06_VoiceSetting /></ProtectedRoute> },
  // 삶의 DB는 보호자 화면이라 환자 연동이 끝난 뒤에만 들어갈 수 있습니다.
  { path: '/memory-db',     element: <ProtectedRoute requireLink><S07_MemoryDB /></ProtectedRoute> },

  // ── 보호자 / 의료진 코드 연동 ─────────────────────
  { path: '/code-link',     element: <ProtectedRoute><S08_CodeLink /></ProtectedRoute> },

  // ── 역할별 홈 ──────────────────────────────────────
  { path: '/patient-home',  element: <ProtectedRoute><S09_PatientHome /></ProtectedRoute> },
  // ── 계정 ───────────────────────────────────────────
  { path: '/mypage',        element: <ProtectedRoute><S27_MyPage /></ProtectedRoute> },

  // ── 환자 흐름───────────────────────────────────────────
  { path: '/patient-check',element: <ProtectedRoute><S10_DailyHealthCheck /></ProtectedRoute> },
  { path: '/patient-voicequiz',element: <ProtectedRoute><S11_TextVoiceQuiz /></ProtectedRoute> },
  { path: '/patient-photo',element: <ProtectedRoute><S12_PhotoRecallQuiz /></ProtectedRoute> },
  { path: '/patient-voicechat',element: <ProtectedRoute><S13_RecallVoiceChat /></ProtectedRoute> },

  { path: '/patient-result',element: <ProtectedRoute><S17_ActivityReport/></ProtectedRoute> },


  // ── 보호자 흐름───────────────────────────────────────────
  // requireLink: 환자 코드를 연동하기 전에는 전부 /code-link 로 되돌립니다.

  { path: '/caregiver-home', element: <ProtectedRoute requireLink><S18_CargiverHome /></ProtectedRoute>},

  // ── 계정 ───────────────────────────────────────────
  // 마이페이지는 연동 전에도 열려 있어야 합니다(로그아웃 경로가 여기뿐입니다).
  { path: '/caregiver-mypage',        element: <ProtectedRoute><S27_MyPage /></ProtectedRoute> },

  // ── 보호자 흐름───────────────────────────────────────────
  { path: '/caregiver-report', element: <ProtectedRoute requireLink><S19_CargiverReport /></ProtectedRoute>},
  { path: '/caregiver-memo', element: <ProtectedRoute requireLink><S20_CargiverMemo /></ProtectedRoute>},
  { path: '/caregiver-update', element: <ProtectedRoute requireLink><S21_CargiverUpdate /></ProtectedRoute>},
  { path: '/caregiver-alerm', element: <ProtectedRoute requireLink><S22_CargiverAlerm /></ProtectedRoute>},

  // ── 의료진 흐름───────────────────────────────────────────
  { path: '/doctor-home', element: <ProtectedRoute requireLink><S23_DoctorHome /></ProtectedRoute>},
  { path: '/doctor-dashboard', element: <ProtectedRoute requireLink><S24_DoctorDashboard /></ProtectedRoute>},
  { path: '/doctor-level', element: <ProtectedRoute requireLink><S26_DoctorLevel/></ProtectedRoute>},
])

export default router
