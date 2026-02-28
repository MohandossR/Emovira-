import { useEffect } from 'react';
import { APP_STATES, useAppState } from '../context/AppStateContext';

export const useEmotion = () => {
  const { state, dispatch } = useAppState();

  const analyzeKeywords = (text) => {
    const normalized = (text || '').toLowerCase();

    if (
      normalized.includes('suicide') ||
      normalized.includes('hurt myself') ||
      normalized.includes('kill myself') ||
      normalized.includes('danger')
    ) {
      dispatch({ type: 'SET_STATUS', payload: APP_STATES.CRISIS });
      return;
    }

    if (
      normalized.includes('sad') ||
      normalized.includes('lonely') ||
      normalized.includes('hopeless') ||
      normalized.includes('overwhelmed') ||
      normalized.includes('panic')
    ) {
      dispatch({ type: 'SET_STATUS', payload: APP_STATES.CONCERN });
    }
  };

  useEffect(() => {
    if (state.status !== APP_STATES.THINKING) {
      return;
    }

    const timer = setTimeout(() => {
      analyzeKeywords(state.lastQuery);
    }, 900);

    return () => clearTimeout(timer);
  }, [state.status, state.lastQuery]);

  return { analyzeKeywords };
};
