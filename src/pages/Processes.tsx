import React, { useState } from 'react';
import { useClients, useProcesses } from '../store';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Process } from '../types';

export function Processes() {
  const { clients } = useClients();
  const { processes, addProcess, updateProcess, deleteProcess } = useProcesses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Process, 'id' | 'createdAt'>>({
    clientId: '',
    processNumber: '',
    area: 'Civil',
    actionType: 'Indenizatoria',
    status: 'Em Andamento',
    deadline: '',
    value: 0
  });

  const handleOpenModal = (processId?: string) => {
    if (processId) {
      const process = processes.find(p => p.id === processId);
      if (process) {
        setFormData({
          clientId: process.clientId,
          processNumber: process.processNumber,
          area: process.area,
          actionType: process.actionType,
          status: process.status,
          deadline: process.deadline,
          value: process.value
        });
        setEditingProcessId(processId);
      }
    } else {
      setFormData({
        clientId: clients[0]?.id || '',
        processNumber: '',
        area: 'Civil',
        actionType: 'Indenizatoria',
        status: 'Em Andamento',
        deadline: '',
        value: 0
      });
      setEditingProcessId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProcessId) {
      updateProcess(editingProcessId, formData);
    } else {
      addProcess(formData);
    }
    setIsModalOpen(false);
  };

  const filteredProcesses = processes.filter(process => {
    const client = clients.find(c => c.id === process.clientId);
    const matchesSearch = 
      client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || process.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Sentenciado': return 'bg-green-100 text-green-800';
      case 'Suspenso': return 'bg-yellow-100 text-yellow-800';
      case 'Arquivado': return 'bg-slate-100 text-slate-800';
      case 'Finalizado': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Processos</h1>
          <p className="mt-2 text-sm text-slate-700">
            Acompanhamento de processos dos clientes.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            <Plus size={16} />
            Novo Processo
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente ou número do processo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="relative min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Sentenciado">Sentenciado</option>
            <option value="Suspenso">Suspenso</option>
            <option value="Arquivado">Arquivado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Cliente</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">N. Processo</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Área</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Tipo Ação</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Prazo</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Valor da Causa</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredProcesses.map((process) => {
                    const client = clients.find(c => c.id === process.clientId);
                    return (
                      <tr key={process.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                          {client?.fullName || 'Cliente Removido'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {process.processNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {process.area}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {process.actionType}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(process.status)}`}>
                            {process.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {process.deadline ? new Date(process.deadline).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(process.value)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(process.id)}
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Tem certeza que deseja excluir este processo?')) {
                                  deleteProcess(process.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProcesses.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-slate-500">
                        Nenhum processo encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">
                {editingProcessId ? 'Editar Processo' : 'Novo Processo'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Cliente</label>
                    <select
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Selecione um cliente...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">N. Processo</label>
                    <input
                      type="text"
                      required
                      value={formData.processNumber}
                      onChange={(e) => setFormData({ ...formData, processNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Área</label>
                    <select
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Civil">Civil</option>
                      <option value="Empresarial">Empresarial</option>
                      <option value="Penal">Penal</option>
                      <option value="Tributaria">Tributária</option>
                      <option value="Trabalhista">Trabalhista</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Tipo Ação</label>
                    <select
                      required
                      value={formData.actionType}
                      onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Reclamação Trabalhista">Reclamação Trabalhista</option>
                      <option value="Indenizatoria">Indenizatória</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Cobrança">Cobrança</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status do Processo</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Sentenciado">Sentenciado</option>
                      <option value="Suspenso">Suspenso</option>
                      <option value="Arquivado">Arquivado</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Prazo</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Valor da Causa</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
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
                    onClick={() => setIsModalOpen(false)}
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
