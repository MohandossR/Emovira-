import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CloudOff, Code, Cpu, Layout, Shield, Terminal } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Privacy governance',
    description: 'Voice and contextual data are processed at the edge with strict local boundaries.',
  },
  {
    icon: CloudOff,
    title: 'Cloud-independent runtime',
    description: 'Primary interactions continue without backend dependencies or external request overhead.',
  },
  {
    icon: Activity,
    title: 'Deterministic state engine',
    description: 'Explicit state transitions keep behavior predictable during high-emotion sessions.',
  },
  {
    icon: Layout,
    title: 'Consistent design system',
    description: 'Reusable tokens and components align every page to the same visual language.',
  },
  {
    icon: Terminal,
    title: 'Composable architecture',
    description: 'Hooks and modules are separated to support rapid experimentation and maintainability.',
  },
  {
    icon: Cpu,
    title: 'Adaptive theming layer',
    description: 'UI state is synchronized with real-time emotional context for clear feedback.',
  },
];

const Architecture = () => {
  return (
    <div className="space-y-8 pb-8 pt-6 sm:space-y-10 sm:pt-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-9"
      >
        <span className="pill-label bg-primary-soft text-primary">Technical blueprint</span>
        <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
          System architecture designed for reliability and emotional safety
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed sm:text-base">
          EMOVIRA is structured around a local-first execution model, deterministic state transitions, and a UI layer that responds
          clearly under normal and crisis states.
        </p>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.article
            key={pillar.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.04 }}
            className="surface-card p-6"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <pillar.icon size={20} />
            </div>
            <h2 className="mt-4 text-xl font-bold">{pillar.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{pillar.description}</p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="surface-card data-grid p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Runtime path</h2>
          <p className="mt-3 text-sm text-text-secondary">
            Request handling moves through explicit guardrails before any assistant response is emitted.
          </p>

          <div className="mt-6 space-y-3">
            {[
              'Capture input signal',
              'Infer emotional status',
              'Evaluate safety thresholds',
              'Render adaptive response',
              'Log local interaction record',
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-text-primary">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card bg-surface-dark p-6 text-slate-100 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
            <Code size={13} />
            State logic sample
          </div>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950/60 p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`const evaluateState = (signal) => {
  if (signal.riskScore > 0.8) return 'CRISIS';
  if (signal.stress > 0.6) return 'CONCERN';
  if (signal.inputActive) return 'LISTENING';
  return 'IDLE';
};`}
          </pre>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            This deterministic branch keeps safety behavior inspectable and avoids hidden state changes during sensitive conversations.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default Architecture;
