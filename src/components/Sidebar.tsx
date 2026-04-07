import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, Settings, DollarSign, LogOut, Scale, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../store';
import { useCurrentTenant } from '../contexts/TenantContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { currentTenant, getTenantPath } = useCurrentTenant();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', href: getTenantPath('/'), icon: LayoutDashboard },
    { name: 'Clientes', href: getTenantPath('/clients'), icon: Users },
    { name: 'Processos', href: getTenantPath('/processes'), icon: Scale },
    { name: 'Calendário', href: getTenantPath('/calendar'), icon: CalendarIcon },
    { name: 'Documentos', href: getTenantPath('/documents'), icon: FileText },
    { name: 'Financeiro', href: getTenantPath('/finance'), icon: DollarSign },
  ];

  if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
    navItems.push({ name: 'Configurações', href: getTenantPath('/settings'), icon: Settings });
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="flex h-28 flex-col items-center justify-center bg-zinc-950 border-b border-zinc-800 pt-4 pb-2">
        {currentTenant?.logoUrl ? (
          <img src={currentTenant.logoUrl} alt={currentTenant.name} className="h-12 mb-1" />
        ) : (
          <div className="relative flex items-center justify-center w-12 h-12 mb-1">
            <span className="absolute text-4xl font-serif text-yellow-600/80 -ml-3">R</span>
            <span className="absolute text-4xl font-serif text-yellow-500 mt-3 ml-3">L</span>
          </div>
        )}
        <h1 className="text-sm tracking-[0.2em] font-serif mt-2" style={{ color: currentTenant?.primaryColor || '#eab308' }}>
          {currentTenant?.name?.toUpperCase() || 'RUBENS LIMA'}
        </h1>
        <span className="text-[0.5rem] tracking-widest text-zinc-500 mt-1 uppercase">Advocacia e Consultoria</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== getTenantPath('/'));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-yellow-700' : 'text-zinc-400 group-hover:text-zinc-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: currentTenant?.primaryColor || '#ca8a04' }}>
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900">{currentUser?.name}</span>
              <span className="text-xs text-zinc-500 capitalize">{currentUser?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500" title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
