import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'I feel stuck and need help getting grounded.',
  'Can you guide me through a calming reset?',
  'I want to reflect on what triggered this stress.',
  'Help me create a short recovery plan for today.',
];

const Suggestions = ({ onSelect }) => {
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl px-2 pb-2 sm:mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-text-muted shadow-tier-1">
          <Compass size={13} className="text-primary" />
          Prompt suggestions
        </div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-text-muted">
          <Sparkles size={12} className="text-primary" />
          Tap to run
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.05 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(suggestion)}
            className="surface-card text-left"
          >
            <div className="p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-text-primary">{suggestion}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                Use prompt
                <span className="h-px w-5 bg-primary" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
