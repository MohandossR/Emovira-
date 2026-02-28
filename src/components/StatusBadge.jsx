import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { APP_STATES, useAppState } from '../context/AppStateContext';

const statusConfig = {
  [APP_STATES.IDLE]: { text: 'System ready', dotClass: 'bg-emerald-500' },
  [APP_STATES.LISTENING]: { text: 'Listening', dotClass: 'bg-primary' },
  [APP_STATES.THINKING]: { text: 'Analyzing context', dotClass: 'bg-sky-500' },
  [APP_STATES.SPEAKING]: { text: 'Assistant responding', dotClass: 'bg-accent' },
  [APP_STATES.CONCERN]: { text: 'Concern detected', dotClass: 'bg-status-concern' },
  [APP_STATES.CRISIS]: { text: 'Crisis mode active', dotClass: 'bg-status-crisis' },
};

const StatusBadge = () => {
  const { state } = useAppState();
  const { text, dotClass } = statusConfig[state.status] || statusConfig[APP_STATES.IDLE];

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2 shadow-tier-1">
      <span className="relative inline-flex h-2.5 w-2.5">
        <motion.span
          className={`absolute inline-flex h-full w-full rounded-full ${dotClass}`}
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.7 }}
        />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`} />
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-[10px] font-semibold uppercase tracking-[0.17em] text-text-muted"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default StatusBadge;
