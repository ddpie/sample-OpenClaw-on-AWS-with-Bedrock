import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TenantList from './pages/Tenants/TenantList';
import SkillCatalog from './pages/Skills/SkillCatalog';
import Approvals from './pages/Approvals';
import AuditLog from './pages/AuditLog';
import Usage from './pages/Usage';
import Security from './pages/Security';
import Playground from './pages/Playground';
import Settings from './pages/Settings';

// Apply Cloudscape dark mode
applyMode(Mode.Dark);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tenants" element={<TenantList />} />
          <Route path="/skills" element={<SkillCatalog />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/security" element={<Security />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
