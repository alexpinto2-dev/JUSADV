import React, { useState } from 'react';
import { useClients, useEvents, useProcesses } from '../store';
import { Plus, Edit, Trash2, Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types';

export function Calendar() {
  const { clients } = useClients();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { processes } = useProcesses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState<Omit<Event, 'id' | 'createdAt'>>({
    type: 'Reunião',
    clientId: '',
    processNumber: '',
    date: '',
    actionType: 'Indenizatoria',
  });

  const handleOpenModal = (eventId?: string) => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setFormData({
          type: event.type,
          clientId: event.clientId,
          processNumber: event.processNumber,
          date: event.date,
          actionType: event.actionType,
        });
        setEditingEventId(eventId);
      }
    } else {
      setFormData({
        type: 'Reunião',
        clientId: clients[0]?.id || '',
        processNumber: '',
        date: '',
        actionType: 'Indenizatoria',
      });
      setEditingEventId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, formData);
    } else {
      addEvent(formData);
    }
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(event => {
    const client = clients.find(c => c.id === event.clientId);
    const matchesSearch = 
      client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.processNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || event.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Reunião': return 'bg-blue-100 text-blue-800';
      case 'Audiência': return 'bg-red-100 text-red-800';
      case 'Visita': return 'bg-green-100 text-green-800';
      case 'Consultoria': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendário</h1>
          <p className="mt-2 text-sm text-slate-700">
            Acompanhamento de reuniões e audiências.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            <Plus size={16} />
            Novo Agendamento
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Reunião">Reunião</option>
            <option value="Audiência">Audiência</option>
            <option value="Visita">Visita</option>
            <option value="Consultoria">Consultoria</option>
          </select>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="mt-8 flow-root mb-12">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Tipo</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Cliente</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">N. Processo</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Data</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Tipo Ação</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => {
                    const client = clients.find(c => c.id === event.clientId);
                    return (
                      <tr key={event.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                          {client?.fullName || 'Cliente Removido'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {event.processNumber || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {event.date ? new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          {event.actionType}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(event.id)}
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
                                  deleteEvent(event.id);
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
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        Nenhum agendamento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Calendário Visual */}
      <div className="bg-white rounded-lg shadow ring-1 ring-black ring-opacity-5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <CalendarIcon size={20} className="text-yellow-600" />
            Visão Mensal
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <span className="text-base font-medium text-slate-900 min-w-[150px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="bg-slate-50 py-2 text-center text-xs font-semibold text-slate-700">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-white min-h-[100px] p-2"></div>;
            }

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const dayEvents = events.filter(e => e.date && e.date.startsWith(dateStr));
            const isToday = new Date().toISOString().startsWith(dateStr);

            return (
              <div key={day} className={`bg-white min-h-[100px] p-2 border-t border-slate-100 ${isToday ? 'bg-yellow-50/30' : ''}`}>
                <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-yellow-600 text-white' : 'text-slate-700'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => {
                    const client = clients.find(c => c.id === event.clientId);
                    const time = new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div 
                        key={event.id} 
                        onClick={() => handleOpenModal(event.id)}
                        className={`text-[10px] p-1 rounded truncate cursor-pointer hover:opacity-80 ${getTypeColor(event.type)}`}
                        title={`${time} - ${event.type}: ${client?.fullName || 'Sem cliente'}`}
                      >
                        <span className="font-semibold">{time}</span> {event.type}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">
                {editingEventId ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Tipo</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Reunião">Reunião</option>
                      <option value="Audiência">Audiência</option>
                      <option value="Visita">Visita</option>
                      <option value="Consultoria">Consultoria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Data e Hora</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium text-slate-700">N. Processo (Opcional)</label>
                    <select
                      value={formData.processNumber}
                      onChange={(e) => {
                        const processNumber = e.target.value;
                        const selectedProcess = processes.find(p => p.processNumber === processNumber);
                        setFormData({ 
                          ...formData, 
                          processNumber,
                          actionType: selectedProcess ? selectedProcess.actionType : formData.actionType
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Nenhum processo vinculado</option>
                      {processes
                        .filter(p => p.clientId === formData.clientId)
                        .map(p => (
                          <option key={p.id} value={p.processNumber}>
                            {p.processNumber} - {p.actionType}
                          </option>
                        ))}
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
