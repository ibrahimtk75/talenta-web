import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Advisor from './pages/Advisor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProviderPortal from './pages/ProviderPortal';
import AdminPortal from './pages/AdminPortal';
import Providers from './pages/Providers';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/signup" element={<Login mode="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/provider" element={<ProviderPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
