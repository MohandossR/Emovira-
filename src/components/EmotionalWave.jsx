import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../context/AppStateContext';

const stateConfig = {
  LISTENING: { color: '#1A73E8', heights: [20, 78, 20], speed: 1.1 },
  THINKING: { color: '#0EA5E9', heights: [6, 18, 6], speed: 2.6 },
  SPEAKING: { color: '#188038', heights: [26, 92, 26], speed: 0.9 },
  CONCERN: { color: '#F9AB00', heights: [32, 98, 32], speed: 1.4 },
  CRISIS: { color: '#D93025', heights: [14, 36, 14], speed: 2.8 },
  IDLE: { color: '#94A3B8', heights: [4, 11, 4], speed: 3.2 },
};

const EmotionalWave = () => {
  const { state } = useAppState();
  const config = stateConfig[state.status] || stateConfig.IDLE;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[22vh] overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 mx-auto flex h-full max-w-5xl items-end gap-[4px] px-6">
        {Array.from({ length: 26 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              height: config.heights,
              opacity: [0.12, 0.38, 0.12],
            }}
            transition={{
              repeat: Infinity,
              duration: config.speed,
              delay: index * 0.05,
              ease: 'easeInOut',
            }}
            style={{ backgroundColor: config.color }}
            className="flex-1 rounded-t-full"
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/45 to-transparent" />
    </div>
  );
};

export default EmotionalWave;
