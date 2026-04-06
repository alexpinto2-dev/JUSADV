import { useClients, useProcesses, useEvents } from '../store';
import { Users, FileText, Activity, Calendar as CalendarIcon, Scale, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { clients } = useClients();
  const { processes } = useProcesses();
  const { events } = useEvents();

  const activeProcesses = processes.filter(p => !['Arquivado', 'Finalizado'].includes(p.status)).length;

  const stats = [
    { name: 'Total de Clientes', stat: clients.length, icon: Users, color: 'bg-blue-500' },
    { name: 'Total de Processos', stat: processes.length, icon: Scale, color: 'bg-indigo-500' },
    { name: 'Processos Ativos', stat: activeProcesses, icon: Activity, color: 'bg-green-500' },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingDeadlines = processes.filter(p => {
    if (!p.deadline || ['Arquivado', 'Finalizado'].includes(p.status)) return false;
    const deadlineDate = new Date(p.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate >= today && deadlineDate <= nextWeek;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const overdueDeadlines = processes.filter(p => {
    if (!p.deadline || ['Arquivado', 'Finalizado'].includes(p.status)) return false;
    const deadlineDate = new Date(p.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < today;
  }).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());

  const allDeadlines = [...overdueDeadlines, ...upcomingDeadlines].slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Visão Geral</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-slate-100">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-slate-500">{item.name}</dt>
                <dd className="text-3xl font-semibold text-slate-900">{item.stat}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900">Clientes Recentes</h2>
            <Link to="/clients" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow border border-slate-100">
            <ul role="list" className="divide-y divide-slate-200">
              {clients.slice(-5).reverse().map((client) => (
                <li key={client.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {client.fullName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-slate-900">{client.fullName}</div>
                      <div className="text-sm text-slate-500">{client.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/documents?client=${client.id}`}
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    >
                      Gerar Documento
                    </Link>
                  </div>
                </li>
              ))}
              {clients.length === 0 && (
                <li className="px-6 py-8 text-center text-slate-500">
                  Nenhum cliente cadastrado ainda.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900">Próximos Agendamentos</h2>
            <Link to="/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Ver calendário
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow border border-slate-100">
            <ul role="list" className="divide-y divide-slate-200">
              {events
                .filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => {
                  const client = clients.find(c => c.id === event.clientId);
                  const process = processes.find(p => p.processNumber === event.processNumber);
                  const eventDate = new Date(event.date);
                  const isToday = eventDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <li key={event.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${isToday ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                          <CalendarIcon size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {event.type}
                            {isToday && <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">Hoje</span>}
                          </div>
                          <div className="text-sm text-slate-500">
                            {client?.fullName || 'Cliente Removido'} 
                            {event.processNumber && (
                              <>
                                {' • Proc: '}
                                {process ? (
                                  <Link to={`/processes/${process.id}`} className="text-blue-600 hover:underline">
                                    {event.processNumber}
                                  </Link>
                                ) : (
                                  event.processNumber
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900">
                          {eventDate.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-slate-500">
                          {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </li>
                  );
              })}
              {events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0)).length === 0 && (
                <li className="px-6 py-8 text-center text-slate-500">
                  Nenhum agendamento futuro encontrado.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900">Prazos e Alertas</h2>
            <Link to="/processes" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Ver processos
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow border border-slate-100">
            <ul role="list" className="divide-y divide-slate-200">
              {allDeadlines.map((process) => {
                const client = clients.find(c => c.id === process.clientId);
                const deadlineDate = new Date(process.deadline);
                deadlineDate.setHours(23, 59, 59, 999);
                const isOverdue = deadlineDate < today;
                
                return (
                  <li key={process.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <AlertCircle size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          <Link to={`/processes/${process.id}`} className="hover:underline">
                            {process.processNumber}
                          </Link>
                          {isOverdue && <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Vencido</span>}
                        </div>
                        <div className="text-sm text-slate-500">
                          {client?.fullName || 'Cliente Removido'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                        {new Date(process.deadline).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </li>
                );
              })}
              {allDeadlines.length === 0 && (
                <li className="px-6 py-8 text-center text-slate-500">
                  Nenhum prazo próximo ou vencido.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
