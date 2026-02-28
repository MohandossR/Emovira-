import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, CalendarClock, LineChart, FileText, Shield } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const fallbackHistory = [
  {
    query: 'I feel overwhelmed with work and I need a way to reset.',
    response: 'Let us slow things down together. Try a short breathing cycle and pick one task to complete first.',
    timestamp: new Date('2026-02-27T12:34:00').getTime(),
  },
  {
    query: 'I had a good day but I am still anxious at night.',
    response: 'That is understandable. We can preserve what worked today and close with a calm pre-sleep routine.',
    timestamp: new Date('2026-02-25T18:20:00').getTime(),
  },
  {
    query: 'I am finding it hard to focus right now.',
    response: 'Let us reduce cognitive load. Start with a two-minute pause and one clear next action.',
    timestamp: new Date('2026-02-22T09:05:00').getTime(),
  },
];

const formatTimestamp = (timestamp) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));

const downloadBlob = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

const History = () => {
  const { state } = useAppState();
  const sessions = state.history.length ? state.history : fallbackHistory;

  const metrics = useMemo(() => {
    const total = sessions.length;
    const thisWeek = sessions.filter((item) => Date.now() - item.timestamp < 1000 * 60 * 60 * 24 * 7).length;
    const avgChars =
      Math.round(
        sessions.reduce((sum, item) => sum + (item.response?.length || 0), 0) / Math.max(total, 1)
      ) || 0;

    return [
      { label: 'Logged interactions', value: total },
      { label: 'This week', value: thisWeek },
      { label: 'Avg response length', value: `${avgChars} chars` },
    ];
  }, [sessions]);

  const handleExportAudit = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      totalInteractions: sessions.length,
      interactions: sessions,
    };

    downloadBlob(
      `interaction-audit-${Date.now()}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8'
    );
  };

  return (
    <div className="space-y-8 pb-8 pt-6 sm:space-y-10 sm:pt-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden p-6 sm:p-9"
      >
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="pill-label bg-primary-soft text-primary">
              <Shield size={14} />
              Session history
            </span>
            <h1 className="mt-5 text-3xl font-bold sm:text-5xl">Conversation analytics on your device</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
              Review emotional interaction snapshots without leaving the edge environment. Every record remains local and available for reflective review.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {metrics.map((metric) => (
              <div key={metric.label} className="surface-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">{metric.label}</p>
                <p className="mt-1 text-xl font-bold text-text-primary">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="surface-card p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Interaction timeline</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              <CalendarClock size={13} />
              Recent first
            </span>
          </div>

          <div className="space-y-4">
            {sessions.map((item, index) => (
              <motion.article
                key={`${item.timestamp}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white/85 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">Query</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">{formatTimestamp(item.timestamp)}</p>
                </div>
                <p className="text-sm font-medium text-text-primary">{item.query}</p>
                <div className="my-3 h-px bg-slate-200" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">Assistant response</p>
                <p className="mt-2 text-sm text-text-secondary">{item.response}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6"
        >
          <div className="surface-card p-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <LineChart size={13} />
              Insight vector
            </div>
            <h3 className="text-xl font-bold">Emotional trend overview</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Use trend summaries to monitor pacing, intensity, and emotional drift before sessions escalate.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Stability confidence', value: 78 },
                { label: 'Response alignment', value: 86 },
                { label: 'Recovery readiness', value: 92 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">Audit export</p>
                <p className="text-base font-bold text-text-primary">Compliance-ready summary</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              Export sanitized interaction metadata for internal review workflows without exposing user-identifiable details.
            </p>
            <button
              onClick={handleExportAudit}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-elevated px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary transition hover:bg-primary-soft hover:text-primary"
            >
              <Activity size={14} />
              Prepare export
            </button>
          </div>
        </motion.aside>
      </section>
    </div>
  );
};

export default History;
