import React, { useState, useRef } from 'react';
import { useUsers, useTemplates, useAuth, useCustomVars } from '../store';
import { useCurrentTenant } from '../contexts/TenantContext';
import { Plus, Edit, Trash2, Upload, Save } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function Settings() {
  const { currentUser } = useAuth();
  const { currentTenant, getTenantPath } = useCurrentTenant();
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { templates, updateTemplate } = useTemplates();
  const { customVars, addCustomVar, updateCustomVar, deleteCustomVar } = useCustomVars();
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'variables'>('users');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User form state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'advogado' as 'admin' | 'advogado' });

  // Variable form state
  const [isVarModalOpen, setIsVarModalOpen] = useState(false);
  const [editingVarId, setEditingVarId] = useState<string | null>(null);
  const [varForm, setVarForm] = useState({ key: '', value: '' });

  // Template form state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [templateContent, setTemplateContent] = useState<string>(templates[0]?.content || '');

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
    return <Navigate to={getTenantPath('/')} replace />;
  }

  const handleOpenUserModal = (userId?: string) => {
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        setUserForm({ name: user.name, email: user.email, password: user.password || '', role: user.role });
        setEditingUserId(userId);
      }
    } else {
      setUserForm({ name: '', email: '', password: '', role: 'advogado' });
      setEditingUserId(null);
    }
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateUser(editingUserId, userForm);
    } else {
      addUser(userForm);
    }
    setIsUserModalOpen(false);
  };

  const handleOpenVarModal = (varId?: string) => {
    if (varId) {
      const v = customVars.find(c => c.id === varId);
      if (v) {
        setVarForm({ key: v.key, value: v.value });
        setEditingVarId(varId);
      }
    } else {
      setVarForm({ key: '', value: '' });
      setEditingVarId(null);
    }
    setIsVarModalOpen(true);
  };

  const handleVarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVarId) {
      updateCustomVar(editingVarId, varForm.key, varForm.value);
    } else {
      addCustomVar(varForm.key, varForm.value);
    }
    setIsVarModalOpen(false);
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setTemplateContent(template.content);
    }
  };

  const handleSaveTemplate = () => {
    updateTemplate(selectedTemplateId, templateContent);
    alert('Modelo salvo com sucesso!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTemplateContent(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="mt-2 text-sm text-slate-700">
          Gerencie usuários, acessos, variáveis globais e modelos de documentos.
        </p>
      </div>

      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Usuários e Acessos
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`${activeTab === 'variables' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Variáveis Globais
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`${activeTab === 'templates' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Modelos de Documentos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="sm:flex sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900">Usuários do Sistema</h2>
            <button
              onClick={() => handleOpenUserModal()}
              className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
            >
              <Plus size={16} /> Novo Usuário
            </button>
          </div>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-slate-300">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">Nome</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Perfil</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900">{user.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 capitalize">{user.role}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenUserModal(user.id)} className="text-slate-600 hover:text-slate-900">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => { if (window.confirm('Excluir este usuário?')) deleteUser(user.id); }} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'variables' && (
        <div>
          <div className="sm:flex sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-slate-900">Variáveis Globais</h2>
              <p className="text-sm text-slate-500">
                Crie variáveis que serão substituídas automaticamente em todos os modelos. Ex: [NOME_ADVOGADO]
              </p>
            </div>
            <button
              onClick={() => handleOpenVarModal()}
              className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
            >
              <Plus size={16} /> Nova Variável
            </button>
          </div>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-slate-300">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">Chave (Uso no Modelo)</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Valor Substituído</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {customVars.map((v) => (
                  <tr key={v.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono font-medium text-slate-900">[{v.key}]</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{v.value}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenVarModal(v.id)} className="text-slate-600 hover:text-slate-900">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => { if (window.confirm('Excluir esta variável?')) deleteCustomVar(v.id); }} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customVars.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-slate-500">Nenhuma variável criada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-medium text-slate-900">Modelos</h2>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium ${selectedTemplateId === template.id ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {template.title}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Variáveis do Cliente:</p>
              <ul className="text-xs text-slate-600 space-y-1 font-mono bg-slate-50 p-3 rounded border border-slate-200 mb-4">
                <li>[NOME_CLIENTE]</li>
                <li>[CPF]</li>
                <li>[RG]</li>
                <li>[NACIONALIDADE]</li>
                <li>[ESTADO_CIVIL]</li>
                <li>[PROFISSAO]</li>
                <li>[ENDERECO]</li>
                <li>[CIDADE]</li>
                <li>[ESTADO]</li>
                <li>[CEP]</li>
                <li>[DATA_ATUAL]</li>
              </ul>
              <p className="text-xs text-slate-500 mb-2">Variáveis Globais:</p>
              <ul className="text-xs text-slate-600 space-y-1 font-mono bg-slate-50 p-3 rounded border border-slate-200">
                {customVars.map(v => (
                  <li key={v.id}>[{v.key}]</li>
                ))}
                {customVars.length === 0 && <li>Nenhuma variável global</li>}
              </ul>
              <p className="text-xs text-slate-500 mt-4 mb-2">Variáveis Dinâmicas:</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                Qualquer outra variável em colchetes (ex: <span className="font-mono">[VALOR]</span>) será solicitada na hora de gerar o documento.
              </p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
                <h3 className="font-medium text-slate-900">Editor HTML</h3>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".html,.txt"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    <Upload size={16} /> Subir Arquivo
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
                  >
                    <Save size={16} /> Salvar Modelo
                  </button>
                </div>
              </div>
              <textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="w-full h-[600px] p-4 font-mono text-sm border-0 focus:ring-0 resize-none"
                placeholder="Insira o HTML do modelo aqui..."
              />
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setIsUserModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">
                {editingUserId ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                  <input
                    type="password"
                    required={!editingUserId}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Perfil</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm border ring-1 ring-slate-200"
                  >
                    <option value="advogado">Advogado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:col-start-2"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:col-start-1 sm:mt-0"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Variable Modal */}
      {isVarModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setIsVarModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">
                {editingVarId ? 'Editar Variável' : 'Nova Variável'}
              </h3>
              <form onSubmit={handleVarSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Chave (sem colchetes)</label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-slate-500 sm:text-sm">[</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={varForm.key}
                      onChange={(e) => setVarForm({ ...varForm, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                      className="block w-full rounded-md border-0 py-1.5 pl-6 pr-6 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 uppercase font-mono"
                      placeholder="NOME_ADVOGADO"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-500 sm:text-sm">]</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Apenas letras maiúsculas, números e underline (_).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Valor</label>
                  <textarea
                    required
                    rows={3}
                    value={varForm.value}
                    onChange={(e) => setVarForm({ ...varForm, value: e.target.value })}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    placeholder="Valor que substituirá a variável no documento..."
                  />
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:col-start-2"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVarModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:col-start-1 sm:mt-0"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
