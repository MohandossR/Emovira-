import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Briefcase, Eye, EyeOff, GraduationCap, Handshake, Lock, Shield, Speaker, Trash2, Waves } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const VOICE_STYLES = [
  { key: 'calm', label: 'Calm', description: 'Steady and reassuring for emotional regulation.' },
  { key: 'coach', label: 'Coach', description: 'More energetic and motivational tone.' },
  { key: 'gentle', label: 'Gentle', description: 'Soft pace for sensitive moments.' },
  { key: 'clinical', label: 'Clinical', description: 'Neutral and structured guidance style.' },
];

const COACHING_PROFILES = [
  {
    key: 'auto',
    label: 'Auto',
    icon: BrainCircuit,
    description: 'Model automatically infers student/work/relationship/general context for each query.',
  },
  {
    key: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'Optimizes responses for exams, study load, deadlines, and academic stress.',
  },
  {
    key: 'work',
    label: 'Work',
    icon: Briefcase,
    description: 'Biases guidance toward workload control, burnout prevention, and delivery focus.',
  },
  {
    key: 'relationship',
    label: 'Relationship',
    icon: Handshake,
    description: 'Prioritizes communication clarity, boundaries, and emotional repair planning.',
  },
  {
    key: 'general',
    label: 'General',
    icon: Shield,
    description: 'Applies broad emotional-support strategy without domain specialization.',
  },
];

const Settings = () => {
  const { state, dispatch } = useAppState();

  const settings = [
    {
      icon: Shield,
      title: 'Privacy lockdown',
      description: 'Force all processing to remain local and block outbound telemetry paths.',
      actionLabel: state.privacyLockEnabled ? 'Enabled' : 'Disabled',
      actionKind: state.privacyLockEnabled ? 'primary' : 'secondary',
      onClick: () => dispatch({ type: 'TOGGLE_PRIVACY_LOCK' }),
    },
    {
      icon: state.isCameraActive ? Eye : EyeOff,
      title: 'Presence camera',
      description: `Camera is currently ${state.isCameraActive ? 'enabled' : 'disabled'} for contextual turn-taking.`,
      actionLabel: state.isCameraActive ? 'Disable' : 'Enable',
      onClick: () => dispatch({ type: 'TOGGLE_CAMERA' }),
      actionKind: 'secondary',
    },
    {
      icon: Lock,
      title: 'Encryption key rotation',
      description: 'Rotate local storage keys used for protected conversation logs.',
      actionLabel: `Rotate v${state.encryptionKeyVersion}`,
      onClick: () => dispatch({ type: 'ROTATE_ENCRYPTION_KEY' }),
      actionKind: 'secondary',
    },
  ];

  const handleResetAllData = () => {
    const approved = window.confirm('This will erase local conversation and telemetry data. Continue?');
    if (!approved) {
      return;
    }

    dispatch({ type: 'RESET_ALL_DATA' });
  };

  return (
    <div className="space-y-8 pb-8 pt-6 sm:space-y-10 sm:pt-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-9"
      >
        <span className="pill-label bg-primary-soft text-primary">Security controls</span>
        <h1 className="mt-5 text-3xl font-bold sm:text-5xl">Privacy and governance settings</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed sm:text-base">
          Tune session behavior, local security boundaries, and response controls without compromising user privacy or model safety.
        </p>
      </motion.section>

      <section className="grid gap-4">
        {settings.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.05 }}
            className="surface-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-text-secondary">{item.description}</p>
              </div>
            </div>

            <button
              onClick={item.onClick}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                item.actionKind === 'primary'
                  ? 'bg-primary text-white shadow-tier-1 hover:bg-primary-deep hover:shadow-tier-2'
                  : 'border border-slate-200 bg-white text-text-secondary hover:border-primary/30 hover:text-primary'
              }`}
            >
              {item.actionLabel}
            </button>
          </motion.article>
        ))}

        {state.lastKeyRotationAt && (
          <div className="rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3 text-xs text-primary">
            Encryption key rotated at{' '}
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }).format(new Date(state.lastKeyRotationAt))}
            .
          </div>
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="surface-card p-6 sm:p-7"
      >
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Speaker size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Voice response style</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Choose how the assistant sounds when speaking responses. This also influences pacing and motivational tone.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VOICE_STYLES.map((style) => {
            const isActive = state.voiceStyle === style.key;

            return (
              <button
                key={style.key}
                onClick={() => dispatch({ type: 'SET_VOICE_STYLE', payload: style.key })}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? 'border-primary bg-primary-soft text-primary shadow-tier-1'
                    : 'border-slate-200 bg-white text-text-secondary hover:border-primary/30'
                }`}
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-primary">
                  <Waves size={15} />
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em]">{style.label}</p>
                <p className="mt-1 text-xs leading-relaxed">{style.description}</p>
                {isActive && <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em]">Active</p>}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="surface-card p-6 sm:p-7"
      >
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Coaching profile</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Lock support strategy to a specific context or keep automatic domain detection enabled.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COACHING_PROFILES.map((profile) => {
            const isActive = state.coachingProfile === profile.key;

            return (
              <button
                key={profile.key}
                onClick={() => dispatch({ type: 'SET_COACHING_PROFILE', payload: profile.key })}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? 'border-primary bg-primary-soft text-primary shadow-tier-1'
                    : 'border-slate-200 bg-white text-text-secondary hover:border-primary/30'
                }`}
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-primary">
                  <profile.icon size={15} />
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em]">{profile.label}</p>
                <p className="mt-1 text-xs leading-relaxed">{profile.description}</p>
                {isActive && <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em]">Active</p>}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-3xl border border-status-crisis/25 bg-status-crisis/5 p-6 sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-status-crisis/15 text-status-crisis">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-status-crisis">Danger zone</p>
              <h2 className="mt-1 text-2xl font-bold text-status-crisis">Erase local session data</h2>
              <p className="mt-2 text-sm text-red-700/80">
                This permanently removes local interaction logs and resets the session profile.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAllData}
            className="inline-flex items-center gap-2 rounded-full border border-status-crisis/40 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-status-crisis transition hover:bg-status-crisis hover:text-white"
          >
            Execute reset
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default Settings;
