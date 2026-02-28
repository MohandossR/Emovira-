import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Camera,
  CameraOff,
  Eye,
  Gauge,
  RefreshCcw,
  ScanFace,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useReactionTracker } from '../hooks/useReactionTracker';

const permissionMap = {
  idle: { label: 'Idle', badge: 'bg-slate-100 text-slate-600' },
  requesting: { label: 'Requesting', badge: 'bg-amber-100 text-amber-700' },
  granted: { label: 'Live', badge: 'bg-emerald-100 text-emerald-700' },
  denied: { label: 'Blocked', badge: 'bg-red-100 text-red-700' },
  error: { label: 'Error', badge: 'bg-red-100 text-red-700' },
};

const toneClass = {
  safe: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warn: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-red-200 bg-red-50 text-red-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
};

const getReactionChip = (reaction) => {
  if (reaction === 'High Distress') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (reaction === 'Elevated Stress' || reaction === 'High Activation' || reaction === 'Face Not Visible') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-emerald-200 bg-emerald-50 text-emerald-700';
};

const ReactionTrackerPanel = () => {
  const { state, dispatch } = useAppState();
  const {
    videoRef,
    permission,
    streamActive,
    facesDetected,
    attentionScore,
    engagementScore,
    motionLevel,
    luminance,
    reaction,
    lastUpdated,
    faceBox,
    events,
    errorMessage,
    retryTracking,
  } = useReactionTracker();

  const permissionStatus = permissionMap[permission] || permissionMap.idle;

  return (
    <section className="surface-card overflow-hidden p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Clinical vision module</p>
          <h3 className="mt-1 text-lg font-bold text-text-primary">Reaction Tracker</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${permissionStatus.badge}`}>
          {permissionStatus.label}
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
        {state.isCameraActive ? (
          <video ref={videoRef} autoPlay muted playsInline className="aspect-[16/10] w-full object-cover" />
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center text-slate-300">
            <div className="text-center">
              <CameraOff size={28} className="mx-auto" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]">Camera disabled</p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />

        {streamActive && faceBox && (
          <motion.div
            className="pointer-events-none absolute rounded-xl border-2 border-primary shadow-[0_0_0_1px_rgba(26,115,232,0.2)]"
            style={{
              left: `${faceBox.x}%`,
              top: `${faceBox.y}%`,
              width: `${faceBox.width}%`,
              height: `${faceBox.height}%`,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getReactionChip(reaction)}`}
          >
            {reaction}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            Faces: {facesDetected}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
        Camera analysis remains local to this browser session. No video frames are uploaded.
      </p>

      {errorMessage && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage}</div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Attention', value: `${attentionScore}%`, icon: Eye },
          { label: 'Engagement', value: `${engagementScore}%`, icon: Gauge },
          { label: 'Motion', value: `${motionLevel}%`, icon: Zap },
          { label: 'Luminance', value: `${luminance}`, icon: Activity },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-2.5">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <metric.icon size={14} />
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">{metric.label}</p>
            <p className="text-sm font-bold text-text-primary">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">Reaction timeline</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            {lastUpdated ? `Updated ${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(lastUpdated)}` : 'Waiting'}
          </p>
        </div>

        <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
          {events.length > 0 ? (
            events.map((item) => (
              <div key={item.id} className={`rounded-xl border px-2.5 py-2 ${toneClass[item.tone] || toneClass.neutral}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">{item.label}</p>
                <p className="mt-1 text-xs opacity-90">{item.detail}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">{item.time}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              Start the camera to capture real-time reaction telemetry.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!state.isCameraActive ? (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CAMERA' })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-deep"
          >
            <Camera size={14} />
            Enable tracking
          </button>
        ) : permission === 'denied' || permission === 'error' ? (
          <button
            onClick={retryTracking}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100"
          >
            <RefreshCcw size={14} />
            Retry camera
          </button>
        ) : (
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CAMERA' })}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition hover:border-primary/25 hover:text-primary"
          >
            <CameraOff size={14} />
            Pause tracking
          </button>
        )}

        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          <ShieldCheck size={13} />
          Local compute only
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          <ScanFace size={13} />
          Face-aware mode
        </span>
        {permission === 'denied' && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            <AlertTriangle size={13} />
            Browser permission needed
          </span>
        )}
      </div>
    </section>
  );
};

export default ReactionTrackerPanel;
