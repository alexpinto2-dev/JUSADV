import React, { useState } from 'react';
import { useTenants, useAuth } from '../store';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, ExternalLink, Building2, Edit2, Power, PowerOff, Search, Bell, LayoutDashboard, Calendar, Users, Stethoscope, Briefcase, FileText, DollarSign, Shield } from 'lucide-react';

export function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/superadmin');
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mt-6 text-center text-2xl font-serif tracking-[0.2em] text-yellow-500">
            JUSADV SUPER ADMIN
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 bg-zinc-800 py-3 px-3 text-zinc-100 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 bg-zinc-800 py-3 px-3 text-zinc-100 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-yellow-600 px-3 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 transition-colors"
            >
              Entrar
            </button>
          </div>
          <div className="text-center text-xs text-zinc-500 mt-4">
            Acesso super admin: alexpinto2@gmail.com
          </div>
        </form>
      </div>
    </div>
  );
}

export function SuperAdminDashboard() {
  const { tenants, addTenant, deleteTenant } = useTenants();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '', customDomain: '', primaryColor: '#ca8a04' });
  const [adminData, setAdminData] = useState({ name: '', email: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditClick = (tenant: any) => {
    setEditingTenantId(tenant.id);
    setNewTenant({
      name: tenant.name,
      slug: tenant.slug,
      customDomain: tenant.customDomain || '',
      primaryColor: tenant.primaryColor || '#ca8a04'
    });
    setAdminData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenantId) {
      await updateTenant(editingTenantId, newTenant);
    } else {
      await addTenant(newTenant, adminData);
    }
    setIsModalOpen(false);
    setEditingTenantId(null);
    setNewTenant({ name: '', slug: '', customDomain: '', primaryColor: '#ca8a04' });
    setAdminData({ name: '', email: '', password: '' });
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTenants = tenants.length; // Assuming all are active for now
  const inactiveTenants = 0;

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#18181b] text-zinc-400 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-600 flex items-center justify-center text-white font-bold">
              J
            </div>
            <div>
              <h1 className="text-white font-serif tracking-widest text-sm">JUSADV</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-yellow-600/10 text-yellow-500 font-medium transition-colors">
            <Shield size={20} />
            Super Admin
          </button>
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Visão Geral
          </div>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <Calendar size={20} /> Agenda
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <Users size={20} /> Clientes
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <Briefcase size={20} /> Processos
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <FileText size={20} /> Documentos
          </button>
          <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors opacity-50 cursor-not-allowed">
            <DollarSign size={20} /> Financeiro
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar escritórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Hoje</p>
                <p className="text-xs text-slate-500 capitalize">{today}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-lg border border-yellow-200">
                {(currentUser?.name || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Super Admin</h1>
                <p className="text-slate-500 mt-1">Gerencie os escritórios cadastrados na plataforma</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus size={20} />
                Novo Negócio
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Building2 size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{tenants.length}</p>
                  <p className="text-slate-500 font-medium">Total de Negócios</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Power size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{activeTenants}</p>
                  <p className="text-slate-500 font-medium">Ativos</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <PowerOff size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{inactiveTenants}</p>
                  <p className="text-slate-500 font-medium">Inativos</p>
                </div>
              </div>
            </div>

            {/* Tenants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTenants.map((tenant) => (
                <div key={tenant.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${tenant.primaryColor}15`, color: tenant.primaryColor }}
                      >
                        <Building2 size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-900 truncate" title={tenant.name}>
                            {tenant.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Ativo
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1 truncate">
                          /{tenant.slug}
                        </p>
                        {tenant.customDomain && (
                          <p className="text-slate-400 text-xs mt-1 truncate">
                            {tenant.customDomain}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => handleEditClick(tenant)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir este tenant? Todos os dados serão perdidos.')) {
                          deleteTenant(tenant.id);
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                    <button 
                      onClick={() => navigate(`/${tenant.slug}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink size={16} />
                      Abrir
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{editingTenantId ? 'Editar Tenant' : 'Novo Tenant'}</h2>
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nome do Escritório</label>
                <input
                  type="text"
                  required
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={newTenant.slug}
                  onChange={(e) => setNewTenant({ ...newTenant, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Domínio Personalizado (Opcional)</label>
                <input
                  type="text"
                  value={newTenant.customDomain}
                  onChange={(e) => setNewTenant({ ...newTenant, customDomain: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Cor Principal</label>
                <input
                  type="color"
                  value={newTenant.primaryColor}
                  onChange={(e) => setNewTenant({ ...newTenant, primaryColor: e.target.value })}
                  className="mt-1 block h-10 w-full rounded-md border-0 py-1.5 px-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>

              {!editingTenantId && (
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Administrador do Escritório</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Nome do Admin</label>
                      <input
                        type="text"
                        required
                        value={adminData.name}
                        onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Email (Login)</label>
                      <input
                        type="email"
                        required
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Senha</label>
                      <input
                        type="password"
                        required
                        value={adminData.password}
                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTenantId(null);
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
