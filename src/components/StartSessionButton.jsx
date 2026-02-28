import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../context/AppStateContext';

const StartSessionButton = () => {
  const { state, dispatch } = useAppState();
  
  if (state.isSessionActive) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => dispatch({ type: 'START_SESSION' })}
      className="relative group overflow-hidden bg-gradient-to-r from-primary via-primary to-accent px-12 py-5 rounded-2xl font-display font-bold text-xl text-white shadow-xl shadow-primary/20 transition-all duration-300"
    >
      {/* Dynamic Shine Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1 }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
        />
      </div>

      <span className="relative z-10 flex items-center space-x-3">
        <span>Start Your Session</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </span>
    </motion.button>
  );
};

export default StartSessionButton;
