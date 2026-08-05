const P_CODE_KEY = 'ieum_p_code';

export const savePCode = (p_code: number) =>
  localStorage.setItem(P_CODE_KEY, String(p_code));

export const getPCode = (): number | null => {
  const v = localStorage.getItem(P_CODE_KEY);
  return v ? Number(v) : null;
};

export const clearPCode = () => localStorage.removeItem(P_CODE_KEY);
