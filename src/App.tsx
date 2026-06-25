import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense, type ReactElement } from 'react';
import { SessionProvider, useSession, type Role } from './session';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import SupportWidget from './components/SupportWidget';
import Landing from './pages/Landing'; // eager — it's the first paint
import { trackPage } from './analytics';

// Every other page is code-split, so the initial bundle (landing) stays small
// and loads fast on mobile. Each page's JS downloads only when it's visited.
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const OrgRegister = lazy(() => import('./pages/OrgRegister'));
const PlayerOnboard = lazy(() => import('./pages/PlayerOnboard'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Browse = lazy(() => import('./pages/Browse'));
const Feed = lazy(() => import('./pages/Feed'));
const Rankings = lazy(() => import('./pages/Rankings'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Coaches = lazy(() => import('./pages/Coaches'));
const CoachRegister = lazy(() => import('./pages/CoachRegister'));
const Referees = lazy(() => import('./pages/Referees'));
const RefereeRegister = lazy(() => import('./pages/RefereeRegister'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const ClubDashboard = lazy(() => import('./pages/ClubDashboard'));
const AcademyDashboard = lazy(() => import('./pages/AcademyDashboard'));
const Hub = lazy(() => import('./pages/Hub'));
const Messages = lazy(() => import('./pages/Messages'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Faq = lazy(() => import('./pages/Faq'));
const Rules = lazy(() => import('./pages/Rules'));
const Admin = lazy(() => import('./pages/Admin'));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));

function Toast() {
  const { toastMsg } = useSession();
  if (!toastMsg) return null;
  return (
    <div className="fixed bottom-7 left-1/2 z-[200] -translate-x-1/2 rounded-xl border border-white/15 bg-ink/95 px-5 py-3.5 text-sm font-semibold shadow-card backdrop-blur flex items-center gap-2.5">
      <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
      {toastMsg}
    </div>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Report each SPA route change to GA (HashRouter doesn't auto-track these).
    trackPage('#' + pathname);
  }, [pathname]);
  return null;
}

// Redirect to signup if the current role can't access a role-specific route.
function Protected({ allow, children }: { allow: Role[]; children: ReactElement }) {
  const { role } = useSession();
  return allow.includes(role) ? children : <Navigate to="/signup" replace />;
}

export default function App() {
  return (
    <SessionProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="stadium-bg" />
      <ScrollTop />
      <Nav />
      <main id="main" className="min-h-[70vh]">
        <ErrorBoundary>
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center text-mute">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<OrgRegister />} />
          <Route path="/onboard" element={<PlayerOnboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coach-register" element={<CoachRegister />} />
          <Route path="/referees" element={<Referees />} />
          <Route path="/referee-register" element={<RefereeRegister />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/club" element={<Protected allow={['club']}><ClubDashboard /></Protected>} />
          <Route path="/academy" element={<Protected allow={['academy']}><AcademyDashboard /></Protected>} />
          <Route path="/hub" element={<Protected allow={['player']}><Hub /></Protected>} />
          <Route path="/messages" element={<Protected allow={['player', 'club', 'academy']}><Messages /></Protected>} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toast />
      <SupportWidget />
    </SessionProvider>
  );
}
