import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { APP_STATES, useAppState } from '../context/AppStateContext';

const BreathingGuide = () => {
  const { state } = useAppState();
  const showGuide = state.status === APP_STATES.CONCERN || state.status === APP_STATES.CRISIS;

  return (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2"
        >
          <div className="glass-panel px-5 py-5 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.1, 0.7] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <Wind size={22} className="text-primary" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Guided breathing</p>
                <motion.p
                  className="mt-1 text-base font-bold text-text-primary"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  Inhale 4s · Exhale 6s
                </motion.p>
                <p className="mt-1 text-xs text-text-secondary">Stay with this rhythm until your body settles.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreathingGuide;
