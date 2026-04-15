import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '../store';
import { useCurrentTenant } from '../contexts/TenantContext';
import { Client } from '../types';

const INITIAL_STATE: Omit<Client, 'id' | 'createdAt'> = {
  fullName: '',
  cpf: '',
  rg: '',
  nationality: '',
  maritalStatus: '',
  profession: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  phone: '',
  notes: '',
};

export function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addClient, updateClient, clients } = useClients();
  const { currentTenant, getTenantPath } = useCurrentTenant();
  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    if (id && id !== 'new') {
      const client = clients.find(c => c.id === id);
      if (client && client.fullName !== formData.fullName) {
        setFormData(client);
      }
    }
  }, [id, clients, formData.fullName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && id !== 'new') {
      updateClient(id, formData);
    } else {
      addClient(formData);
    }
    navigate(getTenantPath('/clients'));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {id === 'new' ? 'Novo Cliente' : 'Editar Cliente'}
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          Preencha os dados do cliente para gerar documentos posteriormente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2 p-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-slate-900">
              Nome Completo
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-slate-900">
              CPF
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="cpf"
                id="cpf"
                required
                value={formData.cpf}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="rg" className="block text-sm font-medium leading-6 text-slate-900">
              RG
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="rg"
                id="rg"
                value={formData.rg}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="nationality" className="block text-sm font-medium leading-6 text-slate-900">
              Nacionalidade
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="nationality"
                id="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="maritalStatus" className="block text-sm font-medium leading-6 text-slate-900">
              Estado Civil
            </label>
            <div className="mt-2">
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="">Selecione...</option>
                <option value="solteiro(a)">Solteiro(a)</option>
                <option value="casado(a)">Casado(a)</option>
                <option value="divorciado(a)">Divorciado(a)</option>
                <option value="viúvo(a)">Viúvo(a)</option>
                <option value="união estável">União Estável</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profession" className="block text-sm font-medium leading-6 text-slate-900">
              Profissão
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="profession"
                id="profession"
                value={formData.profession}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-slate-900">
              Endereço Completo
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label htmlFor="city" className="block text-sm font-medium leading-6 text-slate-900">
              Cidade
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="state" className="block text-sm font-medium leading-6 text-slate-900">
              Estado
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="zipCode" className="block text-sm font-medium leading-6 text-slate-900">
              CEP
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">
              Telefone
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="notes" className="block text-sm font-medium leading-6 text-slate-900">
              Observações
            </label>
            <div className="mt-2">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => navigate(getTenantPath('/clients'))}
            className="text-sm font-semibold leading-6 text-slate-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
