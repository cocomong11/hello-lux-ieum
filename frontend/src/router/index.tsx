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
import S10_DailyHealthCheck from '../pages/S10_DailyHealthCheck'
import S11_TextVoiceQuiz from '../pages/S11_TextVoiceQuiz'
import S12_PhotoRecallQuiz from '../pages/S12_PhotoRecallQuiz'
import S13_RecallVoiceChat from '../pages/S13_RecallVoiceChat'
import S14_DrawingCognitiveActivity from '../pages/S14_DrawAlong'

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
  { path: '/patient-info',  element: <S05_PatientInfo /> },
  { path: '/voice-setting', element: <S06_VoiceSetting /> },
  { path: '/memory-db',     element: <S07_MemoryDB /> },

  // ── 보호자 / 의료진 코드 연동 ─────────────────────
  { path: '/code-link',     element: <S08_CodeLink /> },

  // ── 역할별 홈 ──────────────────────────────────────
  { path: '/patient-home',  element: <S09_PatientHome /> },
  // ── 계정 ───────────────────────────────────────────
  { path: '/mypage',        element: <S27_MyPage /> },

  // ── 환자 흐름───────────────────────────────────────────
  { path: '/patient-check',element: <S10_DailyHealthCheck /> },
  { path: '/patient-voicequiz',element: <S11_TextVoiceQuiz /> },
  { path: '/patient-photo',element: <S12_PhotoRecallQuiz /> },
  { path: '/patient-voicechat',element: <S13_RecallVoiceChat /> },
  { path: '/patient-draw',element: <S14_DrawingCognitiveActivity /> },
  
  { path: '/patient-result',element: <S17_ActivityReport/> },


  // ── 보호자 흐름───────────────────────────────────────────
  
  { path: '/cargiver-home', element: <S18_CargiverHome />},

  // ── 계정 ───────────────────────────────────────────
  { path: '/cargiver-mypage',        element: <S27_MyPage /> },

  // ── 보호자 흐름───────────────────────────────────────────
  { path: '/cargiver-report', element: <S19_CargiverReport />},
  { path: '/cargiver-memo', element: <S20_CargiverMemo />},
  { path: '/cargiver-update', element: <S21_CargiverUpdate />},
  { path: '/cargiver-alerm', element: <S22_CargiverAlerm />},

  // ── 의료진 흐름───────────────────────────────────────────
  { path: '/doctor-home', element: <S23_DoctorHome />},
  { path: '/doctor-dashboard', element: <S24_DoctorDashboard />},
  { path: '/doctor-level', element: <S26_DoctorLevel/>},
])

export default router
