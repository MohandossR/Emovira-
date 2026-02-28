import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const CameraIndicator = () => {
  const { state, dispatch } = useAppState();
  const { isCameraActive } = state;

  return (
    <motion.button
      onClick={() => dispatch({ type: 'TOGGLE_CAMERA' })}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted shadow-tier-1 transition hover:border-primary/30 hover:text-primary"
      aria-label={isCameraActive ? 'Disable camera presence signal' : 'Enable camera presence signal'}
    >
      <span className="relative inline-flex h-2.5 w-2.5">
        {isCameraActive && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-emerald-500"
            animate={{ scale: [1, 1.8], opacity: [0.55, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isCameraActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      </span>

      <span>{isCameraActive ? 'Camera on' : 'Camera off'}</span>
      {isCameraActive ? <Camera size={14} /> : <CameraOff size={14} />}
    </motion.button>
  );
};

export default CameraIndicator;
