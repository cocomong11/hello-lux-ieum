/**
 * 음성 안내 설정 저장소 (S06)
 * 배치 위치: frontend/src/utils/voiceSettings.ts
 *
 * 저장할 백엔드 API가 아직 없어 localStorage에 저장/불러오기로 구현합니다.
 * 나중에 API가 생기면 이 파일의 save/load 구현만 fetch 호출로 바꾸면 됩니다.
 */

export type VoiceSpeed = '느리게' | '보통' | '빠르게';
export type SentenceLength = '짧음 (권장)' | '보통' | '길음';

export interface VoiceSettings {
  formal: boolean;
  autoPlay: boolean;
  repeat: boolean;
  lowStress: boolean;
  positiveFeedback: boolean;
  speed: VoiceSpeed;
  sentenceLen: SentenceLength;
}

export const defaultVoiceSettings: VoiceSettings = {
  formal: true,
  autoPlay: true,
  repeat: true,
  lowStress: false,
  positiveFeedback: true,
  speed: '느리게',
  sentenceLen: '짧음 (권장)',
};

const KEY = 'ieum_voice_settings';

export function saveVoiceSettings(settings: VoiceSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}

export function loadVoiceSettings(): VoiceSettings {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultVoiceSettings;
  try {
    return { ...defaultVoiceSettings, ...(JSON.parse(raw) as VoiceSettings) };
  } catch {
    return defaultVoiceSettings;
  }
}
