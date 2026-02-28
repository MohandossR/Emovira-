import { useEffect } from 'react';
import { useAppState, APP_STATES } from '../context/AppStateContext';

const statusThemes = {
  [APP_STATES.IDLE]: {
    '--theme-primary': '#1A73E8',
    '--theme-bg-start': 'rgba(26, 115, 232, 0.08)',
    '--theme-bg-end': 'rgba(24, 128, 56, 0.08)',
    '--theme-text': '#0F172A',
  },
  [APP_STATES.LISTENING]: {
    '--theme-primary': '#1A73E8',
    '--theme-bg-start': 'rgba(26, 115, 232, 0.16)',
    '--theme-bg-end': 'rgba(26, 115, 232, 0.06)',
    '--theme-text': '#0F172A',
  },
  [APP_STATES.THINKING]: {
    '--theme-primary': '#0EA5E9',
    '--theme-bg-start': 'rgba(14, 165, 233, 0.16)',
    '--theme-bg-end': 'rgba(59, 130, 246, 0.08)',
    '--theme-text': '#0F172A',
  },
  [APP_STATES.SPEAKING]: {
    '--theme-primary': '#188038',
    '--theme-bg-start': 'rgba(24, 128, 56, 0.14)',
    '--theme-bg-end': 'rgba(26, 115, 232, 0.05)',
    '--theme-text': '#0F172A',
  },
  [APP_STATES.CONCERN]: {
    '--theme-primary': '#F9AB00',
    '--theme-bg-start': 'rgba(249, 171, 0, 0.2)',
    '--theme-bg-end': 'rgba(249, 171, 0, 0.06)',
    '--theme-text': '#0F172A',
  },
  [APP_STATES.CRISIS]: {
    '--theme-primary': '#D93025',
    '--theme-bg-start': 'rgba(217, 48, 37, 0.2)',
    '--theme-bg-end': 'rgba(217, 48, 37, 0.1)',
    '--theme-text': '#F8FAFC',
  },
};

export const useThemeEngine = () => {
  const { state } = useAppState();

  useEffect(() => {
    const theme = statusThemes[state.status] || statusThemes[APP_STATES.IDLE];
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.setAttribute('data-app-state', state.status.toLowerCase());
  }, [state.status]);
};

export default useThemeEngine;
