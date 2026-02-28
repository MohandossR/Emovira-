import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { APP_STATES, useAppState } from '../context/AppStateContext';

const ResponseText = () => {
  const { state } = useAppState();
  const currentStatus = state.status;

  const getResponseContent = () => {
    switch (currentStatus) {
      case APP_STATES.LISTENING:
        return "Listening for your voice and pacing cues...";
      case APP_STATES.THINKING:
        return 'Analyzing context and selecting a supportive response...';
      case APP_STATES.SPEAKING:
        return state.lastResponse || 'I hear you. Let us work through this one step at a time.';
      case APP_STATES.CONCERN:
        return 'I am noticing elevated stress. We can slow down and regulate together.';
      case APP_STATES.CRISIS:
        return 'Urgent support mode is active. Immediate human support options are now available.';
      default:
        return 'Session active. Press the mic when you are ready to speak.';
    }
  };

  const text = getResponseContent();
  const isCrisis = currentStatus === APP_STATES.CRISIS;

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`max-w-3xl rounded-3xl px-4 py-3 text-center text-xl font-medium leading-relaxed sm:text-3xl ${
            isCrisis ? 'bg-status-crisis/10 text-status-crisis' : 'text-text-primary'
          }`}
        >
          {text}
        </motion.div>
      </AnimatePresence>

      {currentStatus === APP_STATES.THINKING && (
        <motion.div className="mt-4 flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.16 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ResponseText;
