import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const MuteToggle = () => {
  const { state, dispatch } = useAppState();
  const { isMuted } = state;

  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 122, 254, 0.05)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative ${
        isMuted ? 'text-status-crisis bg-status-crisis/5' : 'text-text-secondary hover:text-primary transition-colors'
      }`}
      aria-label={isMuted ? "Unmute Neural Out" : "Mute Neural Out"}
    >
      <AnimatePresence mode="wait">
        <motion.div
           key={isMuted ? 'muted' : 'unmuted'}
           initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
           animate={{ opacity: 1, rotate: 0, scale: 1 }}
           exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
           transition={{ duration: 0.2 }}
        >
           {isMuted ? <VolumeX size={22} strokeWidth={2.5} /> : <Volume2 size={22} strokeWidth={2.5} />}
        </motion.div>
      </AnimatePresence>
      
      {isMuted && (
         <motion.div 
            layoutId="mute-ring"
            className="absolute inset-0 rounded-full border-2 border-status-crisis/20 opacity-40 animate-pulse"
         />
      )}
    </motion.button>
  );
};

export default MuteToggle;
