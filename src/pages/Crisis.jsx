import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, PhoneCall } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const Crisis = () => {
  const { dispatch } = useAppState();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-status-crisis/95 px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/30 bg-white/10 p-6 text-center backdrop-blur-md sm:p-8"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-status-crisis shadow-tier-3">
          <AlertCircle size={40} strokeWidth={2.4} />
        </div>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Safety Mode Enabled</h1>
        <p className="mt-4 text-base leading-relaxed text-white/90">
          EMOVIRA detected high emotional distress. Pause the session and connect with immediate human support.
        </p>

        <div className="mt-6 rounded-2xl border border-white/25 bg-black/20 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">United States crisis support</p>
          <p className="mt-3 text-5xl font-bold tracking-tight">988</p>
          <p className="mt-1 text-sm text-white/80">Suicide & Crisis Lifeline (call or text, 24/7)</p>

          <a
            href="tel:988"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-status-crisis transition hover:bg-slate-100"
          >
            <PhoneCall size={16} />
            Call 988 now
          </a>
        </div>

        <button
          onClick={() => dispatch({ type: 'SET_STATUS', payload: 'IDLE' })}
          className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 transition hover:text-white"
        >
          Return to session
        </button>
      </motion.section>
    </div>
  );
};

export default Crisis;
