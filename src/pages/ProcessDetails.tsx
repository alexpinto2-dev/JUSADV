import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProcesses, useClients, useEvents } from '../store';
import { ArrowLeft, Calendar as CalendarIcon, FileText, User, Tag, Clock, DollarSign, Activity } from 'lucide-react';

export function ProcessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { processes } = useProcesses();
  const { clients } = useClients();
  const { events } = useEvents();

  const process = processes.find(p => p.id === id);
  const client = process ? clients.find(c => c.id === process.clientId) : null;
  const processEvents = process ? events.filter(e => e.processNumber === process.processNumber) : [];

  if (!process) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Processo não encontrado</h2>
        <button
          onClick={() => navigate('/processes')}
          className="mt-4 inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
        >
          <ArrowLeft size={20} />
          Voltar para Processos
        </button>
      </div>
    );
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Reunião': return 'bg-blue-100 text-blue-800';
      case 'Audiência': return 'bg-red-100 text-red-800';
      case 'Visita': return 'bg-green-100 text-green-800';
      case 'Consultoria': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/processes')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Processo {process.processNumber}
            <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(process.status)}`}>
              {process.status}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Criado em {new Date(process.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-yellow-600" />
              Detalhes do Processo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Tag size={16} /> Área
                </p>
                <p className="text-slate-900">{process.area}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Activity size={16} /> Tipo de Ação
                </p>
                <p className="text-slate-900">{process.actionType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Clock size={16} /> Prazo
                </p>
                <p className="text-slate-900">
                  {process.deadline ? new Date(process.deadline).toLocaleDateString('pt-BR') : 'Não definido'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <DollarSign size={16} /> Valor da Causa
                </p>
                <p className="text-slate-900 font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(process.value)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CalendarIcon size={20} className="text-yellow-600" />
              Eventos Vinculados
            </h2>
            {processEvents.length > 0 ? (
              <div className="space-y-4">
                {processEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(event => (
                  <div key={event.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        Ação: {event.actionType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum evento vinculado a este processo.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-yellow-600" />
              Cliente
            </h2>
            {client ? (
              <div>
                <Link to={`/clients/${client.id}`} className="text-lg font-medium text-yellow-600 hover:text-yellow-700 hover:underline block mb-2">
                  {client.fullName}
                </Link>
                <div className="space-y-2 mt-4">
                  <p className="text-sm text-slate-600"><span className="font-medium">CPF:</span> {client.cpf}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Email:</span> {client.email}</p>
                  <p className="text-sm text-slate-600"><span className="font-medium">Telefone:</span> {client.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">Cliente não encontrado ou removido.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
