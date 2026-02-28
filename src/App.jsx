import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Clock,
  Heart,
  LayoutGrid,
  Menu,
  Settings as SettingsIcon,
  Share2,
  Shield,
  X,
} from 'lucide-react';
import { APP_STATES, useAppState } from './context/AppStateContext';

import MouseFollower from './components/MouseFollower';
import ParallaxBackground from './components/ParallaxBackground';

const Landing = lazy(() => import('./pages/Landing'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Session = lazy(() => import('./pages/Session'));
const History = lazy(() => import('./pages/History'));
const Settings = lazy(() => import('./pages/Settings'));
const Crisis = lazy(() => import('./pages/Crisis'));
const Architecture = lazy(() => import('./pages/Architecture'));

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutGrid },
  { to: '/session', label: 'Session', icon: Activity },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/architecture', label: 'Architecture', icon: Share2 },
];

const getStatusDetails = (status) => {
  switch (status) {
    case APP_STATES.LISTENING:
      return { label: 'Listening', color: 'bg-primary' };
    case APP_STATES.THINKING:
      return { label: 'Analyzing', color: 'bg-sky-500' };
    case APP_STATES.SPEAKING:
      return { label: 'Responding', color: 'bg-accent' };
    case APP_STATES.CONCERN:
      return { label: 'Concern Signal', color: 'bg-status-concern' };
    case APP_STATES.CRISIS:
      return { label: 'Crisis Mode', color: 'bg-status-crisis' };
    default:
      return { label: 'Ready', color: 'bg-emerald-500' };
  }
};

const NavItem = ({ item, onNavigate, compact = false }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
        isActive
          ? 'border-primary/20 bg-primary text-white shadow-tier-1'
          : 'border-white/70 bg-white/70 text-text-secondary hover:border-primary/20 hover:text-primary'
      } ${compact ? 'w-full justify-center py-3 text-[11px]' : ''}`}
    >
      <Icon size={15} />
      <span>{item.label}</span>
    </Link>
  );
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useAppState();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const statusMeta = useMemo(() => getStatusDetails(state.status), [state.status]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-tier-1">
                <Heart size={18} fill="currentColor" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-text-primary">EMOVIRA</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Edge Empathy Engine</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 sm:flex">
                <span className={`h-2.5 w-2.5 rounded-full ${statusMeta.color}`} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">{statusMeta.label}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/70 text-text-primary lg:hidden"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200/70 pt-3 lg:hidden"
              >
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.to} item={item} onNavigate={() => setIsMobileMenuOpen(false)} compact />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      >
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="h-12 w-12 rounded-full bg-primary/35"
              />
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/session" element={<Session />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const { state } = useAppState();

  return (
    <Router>
      <MouseFollower />
      <ParallaxBackground />

      <div className="relative min-h-screen pb-6 pt-24 text-text-primary sm:pt-28">
        <Header />

        <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <AppRoutes />
        </main>

        <footer className="relative z-10 mt-16 px-4 pb-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-3xl border border-white/70 bg-white/70 px-6 py-6 shadow-tier-1">
            <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  EMOVIRA 2026 · Privacy-First Edge Intelligence
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary sm:justify-end">
                <span>Safety Protocols</span>
                <span>Local Processing</span>
                <span>Design System v2</span>
              </div>
            </div>
          </div>
        </footer>

        {state.status === APP_STATES.CRISIS && (
          <div className="fixed inset-0 z-[200]">
            <Crisis />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
