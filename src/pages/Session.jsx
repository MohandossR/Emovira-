import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, HeartPulse, MessageSquareHeart, Shield, Sparkles, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useVoice } from '../hooks/useVoice';
import { useEmotion } from '../hooks/useEmotion';
import { useThemeEngine } from '../hooks/useThemeEngine';
import { useFaceDetection } from '../hooks/useFaceDetection';
import Avatar from '../components/Avatar';
import BreathingGuide from '../components/BreathingGuide';
import CameraIndicator from '../components/CameraIndicator';
import EmotionalWave from '../components/EmotionalWave';
import MicButton from '../components/MicButton';
import MuteToggle from '../components/MuteToggle';
import ResponseText from '../components/ResponseText';
import StatusBadge from '../components/StatusBadge';
import Suggestions from '../components/Suggestions';

const formatIntent = (intent) =>
  String(intent || 'general')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatProfile = (profile) => (profile === 'auto' ? 'Auto' : formatIntent(profile));

const Session = () => {
  const { state, dispatch } = useAppState();
  const {
    simulateListening,
    simulateProcessing,
    isSpeechSupported,
    isRecognizing,
    voiceError,
    lastInference,
    modelSummary,
    feedbackMessage,
    reinforceLastResponse,
    requestAlternativeResponse,
  } = useVoice();

  const [inputValue, setInputValue] = useState('');

  useEmotion();
  useThemeEngine();
  const { isFacePresent, faceEmotion, cameraWarning, videoRef } = useFaceDetection(state.isCameraActive);

  const handleMicClick = () => {
    if (state.status === 'IDLE' || state.status === 'SPEAKING') {
      simulateListening();
    }
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();

    const text = inputValue.trim();
    if (!text || state.status === 'THINKING' || state.status === 'CRISIS') {
      return;
    }

    simulateProcessing(text);
    setInputValue('');
  };

  const isSessionActive = state.isSessionActive;
  const currentStatus = state.status;

  const conversationTimeline = useMemo(() => [...state.history].slice(0, 12).reverse(), [state.history]);

  const quickStats = useMemo(
    () => [
      {
        label: 'Session State',
        value: currentStatus,
        icon: Activity,
      },
      {
        label: 'Messages',
        value: `${state.history.length}`,
        icon: MessageSquareHeart,
      },
      {
        label: 'Voice',
        value: isSpeechSupported ? (isRecognizing ? 'Listening' : 'Ready') : 'Manual',
        icon: HeartPulse,
      },
    ],
    [currentStatus, isRecognizing, isSpeechSupported]
  );

  return (
    <div className="relative min-h-[calc(100vh-12rem)] pb-8 pt-4 sm:pt-6">
      <EmotionalWave />
      <BreathingGuide />

      {!isSessionActive ? (
        <div className="mx-auto max-w-4xl">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden p-6 sm:p-9"
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="pill-label bg-primary-soft text-primary">Compassion Session</div>
                <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                  Talk naturally and get supportive, motivational responses in real time
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                  This session uses trainable on-device intent and domain models. Speak with your mic or type your message, and EMOVIRA adapts responses from your feedback.
                </p>
                <button
                  onClick={() => dispatch({ type: 'START_SESSION' })}
                  className="mt-7 inline-flex items-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-tier-1 transition hover:bg-primary-deep hover:shadow-tier-2"
                >
                  Start support session
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: 'Trainable Dual-ML Engine', detail: 'Intent and domain models learn online after each interaction' },
                  { title: 'Voice + Text', detail: 'Natural dictation and typed chat in one flow' },
                  { title: 'Adaptive Coaching', detail: 'Response plans tied to predicted emotional intent' },
                  { title: 'Safety Layer', detail: 'Concern and crisis guardrails stay active' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-tier-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">{item.title}</p>
                    <p className="mt-2 text-sm font-medium text-text-primary">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6">
            <div className="glass-panel p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Session Console</p>
                  <h2 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">Motivational Conversation Workspace</h2>
                  {state.isCameraActive && (
                    <div className="mt-2 text-xs font-medium">
                      {cameraWarning ? (
                        <span className="text-amber-500">{cameraWarning}</span>
                      ) : (
                        <span className="text-emerald-500">Face: {faceEmotion}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/history"
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition hover:border-primary/30 hover:text-primary"
                  >
                    Open History
                  </Link>
                  <StatusBadge />
                  <CameraIndicator />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3">
                {quickStats.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/80 bg-white/80 p-3">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon size={14} />
                    </div>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">{item.label}</p>
                    <p className="text-sm font-bold text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>

              {voiceError && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {voiceError}
                </div>
              )}
              {feedbackMessage && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {feedbackMessage}
                </div>
              )}
              {!isSpeechSupported && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Speech recognition is not available in this browser. You can still type messages and receive spoken responses.
                </div>
              )}
            </div>

            <section className="glass-panel relative overflow-hidden p-5 sm:p-7">
              <div className="flex flex-col items-center">
                <div className="relative mb-10 sm:mb-12">
                  <motion.div
                    animate={{
                      scale: currentStatus === 'LISTENING' ? [1, 1.1, 1] : 1,
                      opacity: currentStatus === 'IDLE' ? 0.15 : 0.26,
                    }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="pointer-events-none absolute inset-4 rounded-full bg-primary/30 blur-[90px]"
                  />
                  <Avatar />
                </div>

                <div className="mb-8 min-h-[120px] w-full max-w-3xl px-2 sm:mb-10">
                  <ResponseText />
                </div>

                <div className="glass-panel flex items-center gap-2 p-2">
                  <MuteToggle />
                  <div className="h-8 w-px bg-slate-200" />
                  <MicButton onClick={handleMicClick} />
                  <div className="h-8 w-px bg-slate-200" />
                  <button
                    onClick={() => dispatch({ type: 'END_SESSION' })}
                    className="rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary transition hover:bg-slate-100"
                  >
                    End session
                  </button>
                </div>

                <div className="mt-6 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">Conversation Feed</p>
                    {isRecognizing && (
                      <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Listening...
                      </span>
                    )}
                  </div>

                  <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                    {conversationTimeline.length > 0 ? (
                      conversationTimeline.map((entry, index) => (
                        <div key={`${entry.timestamp}-${index}`} className="space-y-2">
                          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-white shadow-tier-1">
                            {entry.query}
                          </div>
                          <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-text-primary">
                            {entry.response}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
                        Say or type how you are feeling, and EMOVIRA will respond with comfort and a supportive next-step question.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleMessageSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      placeholder="Tell me what is on your mind..."
                      className="h-11 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={currentStatus === 'THINKING' || currentStatus === 'CRISIS'}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>

                <AnimatePresence>
                  {currentStatus === 'IDLE' && (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 18 }}
                      className="w-full"
                    >
                      <Suggestions onSelect={(text) => simulateProcessing(text)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </section>

          <aside className="space-y-4 xl:w-[340px] shrink-0">
            <div className="surface-card p-4 overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles size={13} />
                Live Camera Feed
              </div>
              <h3 className="mt-3 text-lg font-bold text-text-primary">
                Visual Context
              </h3>

              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-inner relative">
                {state.isCameraActive ? (
                  <>
                    {/* 
                      We attach the video tag from the hook directly using dangerouslySetInnerHTML,
                      or by manually appending it in an effect, but since the hook created a raw DOM element,
                      we can't just drop it into JSX easily if it's not a React node. 
                      Instead we will use a ref callback to append the node. 
                    */}
                    <div
                      className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
                      ref={node => {
                        if (node && videoRef.current && !node.contains(videoRef.current)) {
                          node.innerHTML = '';
                          node.appendChild(videoRef.current);
                        }
                      }}
                    />
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                      {cameraWarning ? '⚠️ ' + cameraWarning : faceEmotion}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
                    <Shield size={24} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium tracking-wide">Camera disabled</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                {state.isCameraActive
                  ? "EMOVIRA locally analyzes your expressions to provide better contextual support. No video is ever saved or sent anywhere."
                  : "Enable your camera to allow EMOVIRA to read your facial expressions and adapt its responses."}
              </p>
            </div>
            <div className="surface-card p-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles size={13} />
                Comfort Protocol
              </div>
              <h3 className="mt-3 text-lg font-bold text-text-primary">Supportive conversation style</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Responses validate emotions, provide practical next steps, and adapt from your feedback signals.
              </p>
            </div>

            <div className="surface-card p-4">
              <h3 className="text-lg font-bold text-text-primary">Current focus</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Status: <span className="font-semibold text-text-primary">{currentStatus}</span>
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Voice style: <span className="font-semibold capitalize text-text-primary">{state.voiceStyle}</span>
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Coaching profile: <span className="font-semibold capitalize text-text-primary">{formatProfile(state.coachingProfile)}</span>
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Last prompt: <span className="font-medium text-text-primary">{state.lastQuery || 'Waiting for user input'}</span>
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Session;
