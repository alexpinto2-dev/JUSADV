import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAuth } from '../store';
import { useCurrentTenant } from '../contexts/TenantContext';

export function Layout() {
  const { currentUser, loading } = useAuth();
  const { getTenantPath } = useCurrentTenant();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-white text-zinc-500">Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to={getTenantPath('/login')} replace />;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
