import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, type ReactElement } from 'react';
import { SessionProvider, useSession, type Role } from './session';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SupportWidget from './components/SupportWidget';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OrgRegister from './pages/OrgRegister';
import PlayerOnboard from './pages/PlayerOnboard';
import Pricing from './pages/Pricing';
import Browse from './pages/Browse';
import Feed from './pages/Feed';
import Rankings from './pages/Rankings';
import Challenges from './pages/Challenges';
import Coaches from './pages/Coaches';
import CoachRegister from './pages/CoachRegister';
import PlayerDetail from './pages/PlayerDetail';
import ClubDashboard from './pages/ClubDashboard';
import AcademyDashboard from './pages/AcademyDashboard';
import Hub from './pages/Hub';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import { Terms, Privacy } from './pages/Legal';

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
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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
      <div className="stadium-bg" />
      <ScrollTop />
      <Nav />
      <main className="min-h-[70vh]">
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
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/club" element={<Protected allow={['club']}><ClubDashboard /></Protected>} />
          <Route path="/academy" element={<Protected allow={['academy']}><AcademyDashboard /></Protected>} />
          <Route path="/hub" element={<Protected allow={['player']}><Hub /></Protected>} />
          <Route path="/messages" element={<Protected allow={['player', 'club', 'academy']}><Messages /></Protected>} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      <SupportWidget />
    </SessionProvider>
  );
}
