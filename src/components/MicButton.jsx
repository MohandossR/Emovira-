import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { APP_STATES, useAppState } from '../context/AppStateContext';

const MicButton = ({ onClick }) => {
  const { state } = useAppState();
  const isListening = state.status === APP_STATES.LISTENING;
  const isMuted = state.isMuted;

  const buttonStyle = isMuted
    ? 'bg-slate-200 text-slate-400 shadow-inner'
    : isListening
      ? 'bg-gradient-to-br from-primary to-primary-deep text-white shadow-listening-glow'
      : 'bg-white text-text-secondary shadow-premium hover:text-primary';

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        whileHover={{ scale: isMuted ? 1 : 1.05 }}
        whileTap={{ scale: isMuted ? 1 : 0.94 }}
        onClick={onClick}
        disabled={isMuted}
        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${buttonStyle} ${
          isMuted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        aria-label={isMuted ? 'Microphone disabled' : 'Activate microphone'}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.65 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.65 }}
              className="flex items-center gap-1"
            >
              {[0, 1, 2].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1 rounded-full bg-white"
                  animate={{ height: [4, 14, 4] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: bar * 0.1 }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.65 }}>
              <Mic size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/35"
          animate={{ scale: [1, 1.45, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.1 }}
        />
      )}
    </div>
  );
};

export default MicButton;
