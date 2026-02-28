import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppStateContext';

const Avatar = () => {
  const { state } = useAppState();
  const currentStatus = state.status;

  const getPrimaryColor = () => {
    switch (currentStatus) {
      case 'LISTENING': return '#3A7AFE';
      case 'THINKING': return '#8B5CF6';
      case 'SPEAKING': return '#10B981';
      case 'CONCERN': return '#FFB020';
      case 'CRISIS': return '#D32F2F';
      default: return '#3A7AFE';
    }
  };

  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      {/* Decorative Outer Ring */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: currentStatus === 'LISTENING' ? [1, 1.05, 1] : 1
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 rounded-full border border-dashed border-slate-200/50"
      />

      {/* Dynamic Background Halo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus}
          className="absolute inset-4 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: currentStatus === 'LISTENING' || currentStatus === 'SPEAKING' ? [1, 1.15, 1] : 1,
            opacity: 0.15,
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            backgroundColor: getPrimaryColor(),
            filter: 'blur(60px)' 
          }}
        />
      </AnimatePresence>

      {/* Main Avatar Body */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        animate={{
          y: currentStatus === 'IDLE' ? [0, -8, 0] : 0,
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <filter id="eyeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Head/Body Shape */}
        <motion.path
          d="M100,40 C140,40 165,75 165,110 C165,155 140,175 100,175 C60,175 35,155 35,110 C35,75 60,40 100,40 Z"
          fill="url(#bodyGradient)"
          stroke={getPrimaryColor()}
          strokeWidth="1.5"
          className="transition-colors duration-500"
          animate={{
            d: currentStatus === 'SPEAKING' 
              ? "M100,42 C142,42 167,77 167,112 C167,157 142,177 100,177 C58,177 33,157 33,112 C33,77 58,42 100,42 Z"
              : "M100,40 C140,40 165,75 165,110 C165,155 140,175 100,175 C60,175 35,155 35,110 C35,75 60,40 100,40 Z"
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Eyes Group */}
        <g filter="url(#eyeShadow)">
          {/* Left Eye */}
          <motion.g animate={{ x: currentStatus === 'LISTENING' ? [0, 2, -2, 0] : 0 }} transition={{ duration: 4, repeat: Infinity }}>
            <circle cx="72" cy="100" r="6" fill="#1E293B" opacity="0.1" />
            <motion.circle 
              cx="72" cy="100" r="4.5" 
              fill={currentStatus === 'CRISIS' ? '#EF4444' : '#0F172A'}
              animate={{ 
                scaleY: [1, 1, 0.1, 1, 1],
                scale: currentStatus === 'LISTENING' ? 1.2 : 1
              }}
              transition={{ 
                scaleY: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] },
                scale: { duration: 0.3 }
              }}
            />
          </motion.g>

          {/* Right Eye */}
          <motion.g animate={{ x: currentStatus === 'LISTENING' ? [0, 2, -2, 0] : 0 }} transition={{ duration: 4, repeat: Infinity }}>
            <circle cx="128" cy="100" r="6" fill="#1E293B" opacity="0.1" />
            <motion.circle 
              cx="128" cy="100" r="4.5" 
              fill={currentStatus === 'CRISIS' ? '#EF4444' : '#0F172A'}
              animate={{ 
                scaleY: [1, 1, 0.1, 1, 1],
                scale: currentStatus === 'LISTENING' ? 1.2 : 1
              }}
              transition={{ 
                scaleY: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] },
                scale: { duration: 0.3 }
              }}
            />
          </motion.g>
        </g>

        {/* Mouth/Expression */}
        <motion.path
          d={
            currentStatus === 'SPEAKING' ? "M80,135 Q100,150 120,135" :
            currentStatus === 'CONCERN' ? "M82,142 Q100,138 118,142" :
            currentStatus === 'CRISIS' ? "M82,142 Q100,135 118,142" :
            "M85,138 Q100,142 115,138"
          }
          fill="none"
          stroke={currentStatus === 'CRISIS' ? '#EF4444' : '#0F172A'}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{
            d: currentStatus === 'SPEAKING' 
              ? ["M80,135 Q100,155 120,135", "M80,135 Q100,140 120,135"]
              : undefined
          }}
          transition={{
            repeat: Infinity,
            duration: 0.25,
            ease: "easeInOut"
          }}
        />
      </motion.svg>

      {/* Floating Particles for Thinking */}
      <AnimatePresence>
        {currentStatus === 'THINKING' && (
          <div className="absolute inset-0 z-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/40"
                initial={{ 
                  x: 144 + (Math.random() - 0.5) * 40, 
                  y: 144 + (Math.random() - 0.5) * 40, 
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, -100],
                  x: [null, 144 + (Math.random() - 0.5) * 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Avatar;
