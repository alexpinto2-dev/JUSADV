export interface Client {
  id: string;
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
  type: 'Reunião' | 'Audiência' | 'Visita' | 'Consultoria' | string;
  clientId: string;
  processNumber: string;
  date: string;
  actionType: 'Reclamação Trabalhista' | 'Indenizatoria' | 'Familiar' | 'Cobrança' | string;
  createdAt: string;
}

export type DocumentType = 'procuracao' | 'contrato' | 'hipossuficiencia';

export interface Payment {
  id: string;
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
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'advogado';
}

export interface Template {
  id: DocumentType | string;
  type: DocumentType | string;
  title: string;
  content: string;
}

export interface CustomVar {
  id: string;
  key: string;
  value: string;
}
