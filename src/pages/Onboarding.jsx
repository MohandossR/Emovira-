import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Cpu, ShieldCheck } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useAppState();

  const steps = useMemo(
    () => [
      {
        title: 'Privacy baseline',
        description:
          'EMOVIRA runs inference locally. Your voice and camera context stay on-device, and no raw media is sent to external services.',
        icon: ShieldCheck,
        actionLabel: 'Confirm privacy model',
      },
      {
        title: 'Presence calibration',
        description:
          'Enable camera signals to improve turn-taking and context awareness. You can disable this at any time from settings.',
        icon: Camera,
        actionLabel: 'Enable camera mode',
        onAction: () => dispatch({ type: 'TOGGLE_CAMERA' }),
      },
      {
        title: 'Session initialization',
        description:
          'Initialize the interaction state machine and launch into a live session workspace.',
        icon: Cpu,
        actionLabel: 'Launch session workspace',
      },
    ],
    [dispatch]
  );

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (steps[step].onAction) {
      steps[step].onAction();
    }

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    dispatch({ type: 'SET_SESSION_ACTIVE', payload: true });
    navigate('/session');
  };

  return (
    <div className="mx-auto max-w-4xl pb-8 pt-6 sm:pt-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden"
      >
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div className="surface-card p-6 sm:p-7">
            <p className="pill-label bg-primary-soft text-primary">Setup flow</p>
            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Configure your edge assistant</h1>
            <p className="mt-4 text-sm leading-relaxed">
              Follow this guided setup to align privacy controls, presence awareness, and session readiness.
            </p>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="mt-7 space-y-2">
              {steps.map((entry, idx) => (
                <div
                  key={entry.title}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                    idx === step
                      ? 'border-primary/30 bg-primary-soft text-primary'
                      : 'border-slate-200 bg-white/80 text-text-muted'
                  }`}
                >
                  {idx + 1}. {entry.title}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex min-h-[320px] flex-col"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {React.createElement(steps[step].icon, { size: 26 })}
                </div>
                <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{steps[step].title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{steps[step].description}</p>

                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <button
                    onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary transition hover:border-primary/25 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={step === 0}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-tier-1 transition hover:bg-primary-deep hover:shadow-tier-2"
                  >
                    {steps[step].actionLabel}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Onboarding;
