export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  tenantId?: string;
  fullName: string;
  cpf: string;
  rg: string;
  nationality: string;
  maritalStatus: string;
  profession: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}

export interface Process {
  id: string;
  tenantId?: string;
  clientId: string;
  processNumber: string;
  area: 'Civil' | 'Empresarial' | 'Penal' | 'Tributaria' | 'Trabalhista' | string;
  actionType: 'Reclamação Trabalhista' | 'Indenizatoria' | 'Familiar' | 'Cobrança' | string;
  status: 'Arquivado' | 'Suspenso' | 'Sentenciado' | 'Em Andamento' | 'Finalizado' | string;
  deadline: string;
  value: number;
  createdAt: string;
}

export interface Event {
  id: string;
  tenantId?: string;
  type: 'Reunião' | 'Audiência' | 'Visita' | 'Consultoria' | string;
  clientId: string;
  processNumber: string;
  date: string;
  actionType: 'Reclamação Trabalhista' | 'Indenizatoria' | 'Familiar' | 'Cobrança' | string;
  createdAt: string;
  googleEventId?: string;
}

export type DocumentType = 'procuracao' | 'contrato' | 'hipossuficiencia';

export interface Payment {
  id: string;
  tenantId?: string;
  clientId: string;
  description: string;
  amount: number;
  status: 'pago' | 'pendente' | 'atrasado';
  installments: number;
  dueDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin' | 'advogado';
}

export interface Template {
  id: DocumentType | string;
  tenantId?: string;
  type: DocumentType | string;
  title: string;
  content: string;
}

export interface CustomVar {
  id: string;
  tenantId?: string;
  key: string;
  value: string;
}
