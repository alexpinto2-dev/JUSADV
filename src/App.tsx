/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}
