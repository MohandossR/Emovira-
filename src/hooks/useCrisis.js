import { useAppState } from '../context/AppStateContext';

export const useCrisis = () => {
  const { state, dispatch } = useAppState();

  const triggerCrisis = () => {
    dispatch({ type: 'SET_STATE', payload: 'CRISIS' });
  };

  const resolveCrisis = () => {
    dispatch({ type: 'SET_STATE', payload: 'IDLE' });
  };

  return { 
    isCrisis: state.state === 'CRISIS',
    triggerCrisis,
    resolveCrisis
  };
};
