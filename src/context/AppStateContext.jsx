import React, { createContext, useReducer, useContext } from 'react';

const AppStateContext = createContext();

export const APP_STATES = {
  IDLE: 'IDLE',
  LISTENING: 'LISTENING',
  THINKING: 'THINKING',
  SPEAKING: 'SPEAKING',
  CONCERN: 'CONCERN',
  CRISIS: 'CRISIS',
};

const initialState = {
  status: APP_STATES.IDLE,
  isMuted: false,
  voiceStyle: 'calm',
  coachingProfile: 'auto',
  privacyLockEnabled: true,
  encryptionKeyVersion: 1,
  lastKeyRotationAt: null,
  isCameraActive: true,
  isSessionActive: false,
  lastQuery: '',
  lastResponse: '',
  history: [],
  reactionEvents: [],
  reactionSamples: [],
  onboardingStep: 0,
};

function stateReducer(state, action) {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'SET_VOICE_STYLE':
      return { ...state, voiceStyle: action.payload };
    case 'SET_COACHING_PROFILE':
      return { ...state, coachingProfile: action.payload };
    case 'TOGGLE_PRIVACY_LOCK':
      return { ...state, privacyLockEnabled: !state.privacyLockEnabled };
    case 'ROTATE_ENCRYPTION_KEY':
      return {
        ...state,
        encryptionKeyVersion: state.encryptionKeyVersion + 1,
        lastKeyRotationAt: Date.now(),
      };
    case 'SET_SESSION_ACTIVE':
      return { ...state, isSessionActive: action.payload };
    case 'START_SESSION':
      return { ...state, isSessionActive: true, status: APP_STATES.IDLE };
    case 'END_SESSION':
      return { ...state, isSessionActive: false, status: APP_STATES.IDLE };
    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.payload };
    case 'TOGGLE_CAMERA':
      return { ...state, isCameraActive: !state.isCameraActive };
    case 'SET_LAST_QUERY':
      return { ...state, lastQuery: action.payload };
    case 'SET_LAST_RESPONSE':
      return { ...state, lastResponse: action.payload };
    case 'RECORD_INTERACTION':
      return { 
        ...state, 
        history: [{ query: action.payload.query, response: action.payload.response, timestamp: Date.now() }, ...state.history].slice(0, 50),
        lastQuery: action.payload.query,
        lastResponse: action.payload.response
      };
    case 'ADD_REACTION_EVENT':
      return {
        ...state,
        reactionEvents: [action.payload, ...state.reactionEvents].slice(0, 160),
      };
    case 'ADD_REACTION_SAMPLE':
      return {
        ...state,
        reactionSamples: [...state.reactionSamples, action.payload].slice(-480),
      };
    case 'CLEAR_REACTION_TELEMETRY':
      return {
        ...state,
        reactionEvents: [],
        reactionSamples: [],
      };
    case 'RESET_ALL_DATA':
      return {
        ...state,
        status: APP_STATES.IDLE,
        isSessionActive: false,
        coachingProfile: 'auto',
        lastQuery: '',
        lastResponse: '',
        history: [],
        reactionEvents: [],
        reactionSamples: [],
      };
    default:
      return state;
  }
}

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
