/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientForm } from './pages/ClientForm';
import { Documents } from './pages/Documents';
import { Finance } from './pages/Finance';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Processes } from './pages/Processes';
import { ProcessDetails } from './pages/ProcessDetails';
import { Calendar } from './pages/Calendar';
import { WorkspaceSelector } from './pages/WorkspaceSelector';
import { SuperAdminLogin, SuperAdminDashboard } from './pages/SuperAdmin';
import { TenantProvider } from './contexts/TenantContext';
import { useTenants, useAuth } from './store';

function TenantApp() {
  const { tenantSlug } = useParams();
  const { tenants } = useTenants();
  const tenant = tenants.find(t => t.slug === tenantSlug);

  if (!tenant) return <Navigate to="/" />;

  return (
    <TenantProvider tenant={tenant}>
      <TenantRoutes />
    </TenantProvider>
  );
}

function TenantRoutes() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientForm />} />
        <Route path="processes" element={<Processes />} />
        <Route path="processes/:id" element={<ProcessDetails />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="documents" element={<Documents />} />
        <Route path="finance" element={<Finance />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function SuperAdminRoutes() {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <Routes>
        <Route path="*" element={<SuperAdminLogin />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard />} />
    </Routes>
  );
}

export default function App() {
  const { tenants } = useTenants();
  const hostname = window.location.hostname;
  
  // Check if we are on a custom domain (not localhost, not run.app, etc.)
  // For this demo, we'll assume any domain that matches a tenant's customDomain is a custom domain.
  const tenantByDomain = tenants.find(t => t.customDomain && t.customDomain === hostname);

  if (tenantByDomain) {
    return (
      <BrowserRouter>
        <TenantProvider tenant={tenantByDomain}>
          <TenantRoutes />
        </TenantProvider>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkspaceSelector />} />
        <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
        <Route path="/:tenantSlug/*" element={<TenantApp />} />
      </Routes>
    </BrowserRouter>
  );
}
