import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Lock, Sparkles, Waves } from 'lucide-react';

const capabilityCards = [
  {
    icon: Lock,
    title: 'On-device privacy by default',
    description: 'Audio and contextual signals are processed locally so sensitive emotional data never leaves the endpoint.',
    accent: 'bg-primary/10 text-primary',
  },
  {
    icon: Brain,
    title: 'State-aware response engine',
    description: 'Adaptive transitions from listening to guidance are deterministic, auditable, and tuned for safe interaction.',
    accent: 'bg-accent/10 text-accent',
  },
  {
    icon: Waves,
    title: 'Responsive multimodal UI',
    description: 'Visual feedback, voice controls, and safety interventions are coordinated as one coherent interface.',
    accent: 'bg-sky-100 text-sky-700',
  },
];

const Landing = () => {
  return (
    <div className="space-y-10 pb-8 pt-6 sm:space-y-14 sm:pt-10">
      <section className="glass-panel overflow-hidden px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-7"
          >
            <span className="pill-label bg-primary-soft text-primary">Edge-native empathy platform</span>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Built for calm, clarity, and
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> trustworthy emotional AI</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              EMOVIRA blends privacy-safe intelligence with a premium assistant experience. The full product flow is local-first,
              crisis-aware, and ready for production-grade user sessions.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-tier-1 transition hover:bg-primary-deep hover:shadow-tier-2"
              >
                Start guided setup
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/session"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-text-secondary transition hover:border-primary/25 hover:text-primary"
              >
                Open live session
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Inference latency', value: '< 20 ms' },
                { label: 'Data residency', value: '100% local' },
                { label: 'Safety state model', value: '6 modes' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-tier-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-text-muted">{metric.label}</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="surface-card relative overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-primary/10" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-tier-1">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Current profile</p>
                  <p className="text-lg font-bold text-text-primary">Balanced Conversation Mode</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">Session insight</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Presence and voice confidence are stable. Suggest a reflective prompt to maintain user grounding and positive momentum.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Voice confidence', value: 84 },
                  { label: 'Conversation balance', value: 77 },
                  { label: 'Safety confidence', value: 96 },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                      <span>{bar.label}</span>
                      <span>{bar.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200/80">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.value}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {capabilityCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
            className="surface-card p-6 sm:p-7"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}>
              <card.icon size={20} />
            </div>
            <h2 className="mt-5 text-xl font-bold">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{card.description}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default Landing;
