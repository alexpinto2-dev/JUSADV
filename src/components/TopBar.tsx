import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useProcesses, useClients } from '../store';
import { Link } from 'react-router-dom';

export function TopBar() {
  const { processes } = useProcesses();
  const { clients } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingDeadlines = processes.filter(p => {
    if (!p.deadline || ['Arquivado', 'Finalizado'].includes(p.status)) return false;
    const deadlineDate = new Date(p.deadline);
    // Adjust for timezone issues if deadline is just a date string
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate >= today && deadlineDate <= nextWeek;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const overdueDeadlines = processes.filter(p => {
    if (!p.deadline || ['Arquivado', 'Finalizado'].includes(p.status)) return false;
    const deadlineDate = new Date(p.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < today;
  }).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());

  const totalNotifications = upcomingDeadlines.length + overdueDeadlines.length;

  return (
    <div className="h-16 border-b border-zinc-200 bg-white flex items-center justify-end px-8 shrink-0">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
        >
          <Bell size={20} />
          {totalNotifications > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {totalNotifications}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="p-4 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {totalNotifications === 0 ? (
                <div className="p-4 text-sm text-zinc-500 text-center">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {overdueDeadlines.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-red-600 uppercase tracking-wider">
                        Prazos Vencidos
                      </div>
                      {overdueDeadlines.map(process => {
                        const client = clients.find(c => c.id === process.clientId);
                        return (
                          <Link
                            key={process.id}
                            to={`/processes/${process.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-2 py-2 hover:bg-zinc-50 rounded-md"
                          >
                            <div className="text-sm font-medium text-zinc-900 truncate">
                              {process.processNumber}
                            </div>
                            <div className="text-xs text-zinc-500 truncate">
                              {client?.fullName || 'Cliente Removido'}
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              Venceu em: {new Date(process.deadline).toLocaleDateString('pt-BR')}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {upcomingDeadlines.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                        Próximos Prazos (7 dias)
                      </div>
                      {upcomingDeadlines.map(process => {
                        const client = clients.find(c => c.id === process.clientId);
                        return (
                          <Link
                            key={process.id}
                            to={`/processes/${process.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-2 py-2 hover:bg-zinc-50 rounded-md"
                          >
                            <div className="text-sm font-medium text-zinc-900 truncate">
                              {process.processNumber}
                            </div>
                            <div className="text-xs text-zinc-500 truncate">
                              {client?.fullName || 'Cliente Removido'}
                            </div>
                            <div className="text-xs text-yellow-600 mt-1">
                              Vence em: {new Date(process.deadline).toLocaleDateString('pt-BR')}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
