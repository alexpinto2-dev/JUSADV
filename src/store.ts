import { useState, useEffect } from 'react';
import { Client, Payment, User, Template, CustomVar, Process, Event, Tenant } from './types';
import { useCurrentTenant } from './contexts/TenantContext';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState] as const;
}

export function useTenants() {
  const [tenants, setTenants] = useLocalStorage<Tenant[]>('rl_tenants', [
    {
      id: 'default-tenant-1',
      name: 'Rubens Lima Advocacia',
      slug: 'rubenslima',
      primaryColor: '#ca8a04',
      createdAt: new Date().toISOString()
    }
  ]);

  const addTenant = (tenant: Omit<Tenant, 'id' | 'createdAt'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTenants((prev) => [...prev, newTenant]);
    return newTenant;
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  return { tenants, addTenant, updateTenant, deleteTenant };
}

export function useClients() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allClients, setAllClients] = useLocalStorage<Client[]>('rl_clients', []);

  const clients = allClients.filter(c => c.tenantId === tenantId || (!c.tenantId && tenantId === 'default-tenant-1'));

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      tenantId,
      createdAt: new Date().toISOString(),
    };
    setAllClients((prev) => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setAllClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteClient = (id: string) => {
    setAllClients((prev) => prev.filter((c) => c.id !== id));
  };

  const getClient = (id: string) => clients.find((c) => c.id === id);

  return { clients, addClient, updateClient, deleteClient, getClient };
}

export function usePayments() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allPayments, setAllPayments] = useLocalStorage<Payment[]>('rl_payments', []);

  const payments = allPayments.filter(p => p.tenantId === tenantId || (!p.tenantId && tenantId === 'default-tenant-1'));

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
      tenantId,
      createdAt: new Date().toISOString(),
    };
    setAllPayments((prev) => [...prev, newPayment]);
    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setAllPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePayment = (id: string) => {
    setAllPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return { payments, addPayment, updatePayment, deletePayment };
}

export function useProcesses() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allProcesses, setAllProcesses] = useLocalStorage<Process[]>('rl_processes', []);

  const processes = allProcesses.filter(p => p.tenantId === tenantId || (!p.tenantId && tenantId === 'default-tenant-1'));

  const addProcess = (process: Omit<Process, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const newProcess: Process = {
      ...process,
      id: crypto.randomUUID(),
      tenantId,
      createdAt: new Date().toISOString(),
    };
    setAllProcesses((prev) => [...prev, newProcess]);
    return newProcess;
  };

  const updateProcess = (id: string, updates: Partial<Process>) => {
    setAllProcesses((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProcess = (id: string) => {
    setAllProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  return { processes, addProcess, updateProcess, deleteProcess };
}

export function useEvents() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allEvents, setAllEvents] = useLocalStorage<Event[]>('rl_events', []);

  const events = allEvents.filter(e => e.tenantId === tenantId || (!e.tenantId && tenantId === 'default-tenant-1'));

  const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      tenantId,
      createdAt: new Date().toISOString(),
    };
    setAllEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setAllEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, addEvent, updateEvent, deleteEvent };
}

export function useUsers() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allUsers, setAllUsers] = useLocalStorage<User[]>('rl_users', [
    { id: '1', tenantId: 'default-tenant-1', name: 'Rubens Lima', email: 'admin@rubenslima.com', password: '123456', role: 'admin' },
    { id: 'super-1', name: 'Alex Pinto', email: 'alexpinto2@gmail.com', password: 'admin', role: 'superadmin' }
  ]);

  const users = allUsers.filter(u => u.tenantId === tenantId || (!u.tenantId && tenantId === 'default-tenant-1') || u.role === 'superadmin');

  const addUser = (user: Omit<User, 'id' | 'tenantId'>) => {
    if (!tenantId) return;
    const newUser: User = { ...user, id: crypto.randomUUID(), tenantId };
    setAllUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, allUsers, addUser, updateUser, deleteUser };
}

export function useCustomVars() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allCustomVars, setAllCustomVars] = useLocalStorage<CustomVar[]>('rl_custom_vars', [
    { id: '1', tenantId: 'default-tenant-1', key: 'NOME_ADVOGADO', value: 'Rubens Lima' },
    { id: '2', tenantId: 'default-tenant-1', key: 'OAB', value: '12345/SP' },
    { id: '3', tenantId: 'default-tenant-1', key: 'ENDERECO_ESCRITORIO', value: 'Rua Exemplo, 123, Centro, São Paulo - SP' }
  ]);

  const customVars = allCustomVars.filter(v => v.tenantId === tenantId || (!v.tenantId && tenantId === 'default-tenant-1'));

  const addCustomVar = (key: string, value: string) => {
    if (!tenantId) return;
    const formattedKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setAllCustomVars((prev) => [...prev, { id: crypto.randomUUID(), tenantId, key: formattedKey, value }]);
  };

  const updateCustomVar = (id: string, key: string, value: string) => {
    const formattedKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setAllCustomVars((prev) => prev.map((v) => (v.id === id ? { ...v, key: formattedKey, value } : v)));
  };

  const deleteCustomVar = (id: string) => {
    setAllCustomVars((prev) => prev.filter((v) => v.id !== id));
  };

  return { customVars, addCustomVar, updateCustomVar, deleteCustomVar };
}

const defaultTemplates: Template[] = [
  {
    id: 'procuracao',
    tenantId: 'default-tenant-1',
    type: 'procuracao',
    title: 'Procuração Ad Judicia et Extra',
    content: `<h1 style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 30px; text-transform: uppercase;">Procuração Ad Judicia et Extra</h1>
<p style="text-align: justify; margin-bottom: 15px;"><strong>OUTORGANTE:</strong> [NOME_CLIENTE], [NACIONALIDADE], [ESTADO_CIVIL], [PROFISSAO], portador(a) da Cédula de Identidade RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado(a) na [ENDERECO], [CIDADE] - [ESTADO], CEP: [CEP].</p>
<p style="text-align: justify; margin-bottom: 15px;"><strong>OUTORGADO(S):</strong> [NOME_ADVOGADO], brasileiro(a), advogado(a), inscrito(a) na OAB sob o nº [OAB], com escritório profissional situado na [ENDERECO_ESCRITORIO].</p>
<p style="text-align: justify; margin-bottom: 15px;"><strong>PODERES:</strong> Pelo presente instrumento particular de procuração, o(a) outorgante nomeia e constitui o(a) outorgado(a) seu(sua) bastante procurador(a), conferindo-lhe os poderes da cláusula <em>ad judicia et extra</em>, para o foro em geral, podendo, portanto, promover quaisquer medidas judiciais ou administrativas, em qualquer instância, assinar termo, oferecer defesa, direta ou indireta, interpor recursos, ajuizar ações, bem como os poderes especiais para receber citação, confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre que se funda a ação, receber, dar quitação, firmar compromisso e assinar declaração de hipossuficiência econômica, agindo em conjunto ou separadamente, podendo ainda substabelecer esta com ou sem reserva de iguais poderes, dando tudo por bom, firme e valioso.</p>
<p style="text-align: right; margin-top: 40px; margin-bottom: 60px;">[CIDADE] - [ESTADO], [DATA_ATUAL].</p>
<div style="text-align: center; margin-top: 80px;">
  <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto 10px auto;"></div>
  <p style="font-weight: bold;">[NOME_CLIENTE]</p>
  <p style="font-size: 14px;">Outorgante</p>
</div>`
  },
  {
    id: 'hipossuficiencia',
    tenantId: 'default-tenant-1',
    type: 'hipossuficiencia',
    title: 'Declaração de Hipossuficiência',
    content: `<h1 style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 30px; text-transform: uppercase;">Declaração de Hipossuficiência</h1>
<p style="text-align: justify; margin-bottom: 30px;">Eu, <strong>[NOME_CLIENTE]</strong>, [NACIONALIDADE], [ESTADO_CIVIL], [PROFISSAO], portador(a) da Cédula de Identidade RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado(a) na [ENDERECO], [CIDADE] - [ESTADO], CEP: [CEP], <strong>DECLARO</strong>, para todos os fins de direito e sob as penas da lei, que não tenho condições de arcar com as despesas inerentes ao presente processo, sem prejuízo do meu sustento e de minha família, necessitando, portanto, da Gratuidade da Justiça, nos termos do art. 98 e seguintes da Lei 13.105/2015 (Código de Processo Civil) e do art. 5º, LXXIV, da Constituição Federal.</p>
<p style="text-align: justify; margin-bottom: 40px;">Por ser expressão da verdade, firmo a presente declaração.</p>
<p style="text-align: right; margin-bottom: 60px;">[CIDADE] - [ESTADO], [DATA_ATUAL].</p>
<div style="text-align: center; margin-top: 80px;">
  <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto 10px auto;"></div>
  <p style="font-weight: bold;">[NOME_CLIENTE]</p>
  <p style="font-size: 14px;">Declarante</p>
</div>`
  },
  {
    id: 'contrato',
    tenantId: 'default-tenant-1',
    type: 'contrato',
    title: 'Contrato de Prestação de Serviços',
    content: `<h1 style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 30px; text-transform: uppercase;">Contrato de Prestação de Serviços Advocatícios</h1>
<p style="text-align: justify; margin-bottom: 15px;"><strong>CONTRATANTE:</strong> [NOME_CLIENTE], [NACIONALIDADE], [ESTADO_CIVIL], [PROFISSAO], portador(a) da Cédula de Identidade RG nº [RG], inscrito(a) no CPF sob o nº [CPF], residente e domiciliado(a) na [ENDERECO], [CIDADE] - [ESTADO], CEP: [CEP].</p>
<p style="text-align: justify; margin-bottom: 15px;"><strong>CONTRATADO:</strong> [NOME_ADVOGADO], inscrito(a) na OAB sob o nº [OAB], com escritório profissional situado na [ENDERECO_ESCRITORIO].</p>
<p style="text-align: justify; margin-bottom: 15px;">As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços Advocatícios, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.</p>
<h2 style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">CLÁUSULA 1ª - DO OBJETO DO CONTRATO</h2>
<p style="text-align: justify; margin-bottom: 15px;">O presente instrumento tem como objeto a prestação de serviços advocatícios a serem realizados pelo CONTRATADO em favor do CONTRATANTE, referente à ação de [TIPO_DE_ACAO].</p>
<h2 style="font-weight: bold; margin-top: 24px; margin-bottom: 8px;">CLÁUSULA 2ª - DOS HONORÁRIOS</h2>
<p style="text-align: justify; margin-bottom: 15px;">Em remuneração aos serviços profissionais ora contratados, o CONTRATANTE pagará ao CONTRATADO a importância de R$ [VALOR_HONORARIOS], a serem pagos da seguinte forma: [FORMA_PAGAMENTO].</p>
<p style="text-align: right; margin-top: 40px; margin-bottom: 60px;">[CIDADE] - [ESTADO], [DATA_ATUAL].</p>
<div style="display: flex; justify-content: space-between; margin-top: 80px; text-align: center;">
  <div style="width: 45%;">
    <div style="border-top: 1px solid #000; width: 100%; margin-bottom: 10px;"></div>
    <p style="font-weight: bold;">[NOME_CLIENTE]</p>
    <p style="font-size: 14px;">Contratante</p>
  </div>
  <div style="width: 45%;">
    <div style="border-top: 1px solid #000; width: 100%; margin-bottom: 10px;"></div>
    <p style="font-weight: bold;">[NOME_ADVOGADO]</p>
    <p style="font-size: 14px;">Contratado</p>
  </div>
</div>`
  }
];

export function useTemplates() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [allTemplates, setAllTemplates] = useLocalStorage<Template[]>('rl_templates', defaultTemplates);

  const templates = allTemplates.filter(t => t.tenantId === tenantId || (!t.tenantId && tenantId === 'default-tenant-1'));

  const updateTemplate = (id: string, content: string) => {
    setAllTemplates(prev => prev.map(t => t.id === id ? { ...t, content } : t));
  };

  return { templates, updateTemplate };
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('rl_auth', null);
  const { allUsers } = useUsers();

  const login = (email: string, pass: string, tenantId?: string) => {
    if (email === 'alexpinto2@gmail.com' && pass === 'admin') {
      setCurrentUser({ id: 'super-1', name: 'Alex Pinto', email: 'alexpinto2@gmail.com', password: 'admin', role: 'superadmin' });
      return true;
    }

    const user = allUsers.find((u) => 
      u.email === email && 
      u.password === pass && 
      (u.role === 'superadmin' || u.tenantId === tenantId || (!u.tenantId && tenantId === 'default-tenant-1'))
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  return { currentUser, login, logout };
}
