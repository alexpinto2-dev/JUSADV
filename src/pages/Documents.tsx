import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClients, useTemplates, useCustomVars } from '../store';
import { DocumentType } from '../types';
import { Printer, FileText } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export function Documents() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const { clients } = useClients();
  const { templates } = useTemplates();
  const { customVars } = useCustomVars();
  
  const [selectedClient, setSelectedClient] = useState(clientId || '');
  const [docType, setDocType] = useState<DocumentType | string>('procuracao');
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  
  const client = clients.find(c => c.id === selectedClient);
  const template = templates.find(t => t.id === docType);
  const printRef = useRef<HTMLDivElement>(null);

  // Parse template to find dynamic variables
  const templateContent = template?.content || '';
  const matches = Array.from(templateContent.matchAll(/\[([^\]]+)\]/g)).map(m => m[1]);
  const uniqueVars = [...new Set(matches)];

  // Standard variables mapping
  const standardVars: Record<string, string> = {
    'NOME_CLIENTE': client?.fullName || '',
    'CPF': client?.cpf || '',
    'RG': client?.rg || '',
    'NACIONALIDADE': client?.nationality || 'brasileiro(a)',
    'ESTADO_CIVIL': client?.maritalStatus || 'estado civil',
    'PROFISSAO': client?.profession || 'profissão',
    'ENDERECO': client?.address || '',
    'CIDADE': client?.city || '',
    'ESTADO': client?.state || '',
    'CEP': client?.zipCode || '',
    'DATA_ATUAL': new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };

  // Global custom variables mapping
  const globalVars: Record<string, string> = {};
  customVars.forEach(v => {
    globalVars[v.key] = v.value;
  });

  // Dynamic variables are those not found in standard or global
  const dynamicVars = uniqueVars.filter(v => {
    const norm = v.trim().toUpperCase().replace(/\s+/g, '_');
    return standardVars[norm] === undefined && globalVars[norm] === undefined;
  });

  const handlePrint = () => {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin:       15,
      filename:     `${template?.title || 'Documento'} - ${client?.fullName || 'Cliente'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const getProcessedContent = () => {
    if (!client || !template) return '';

    let content = template.content;
    
    uniqueVars.forEach(v => {
      const norm = v.trim().toUpperCase().replace(/\s+/g, '_');
      let val = '____________________';
      
      if (standardVars[norm] !== undefined && standardVars[norm] !== '') {
        val = standardVars[norm];
      } else if (globalVars[norm] !== undefined && globalVars[norm] !== '') {
        val = globalVars[norm];
      } else if (dynamicValues[v]) {
        val = dynamicValues[v];
      }

      // Replace all occurrences of [VAR_NAME] safely using split/join
      content = content.split(`[${v}]`).join(val);
    });

    return content;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gerador de Documentos</h1>
        <p className="mt-2 text-sm text-slate-700">
          Selecione um cliente e o tipo de documento para gerar automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Configurações</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-slate-700">
                  Cliente
                </label>
                <select
                  id="client"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm border ring-1 ring-slate-200"
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.cpf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="docType" className="block text-sm font-medium text-slate-700">
                  Tipo de Documento
                </label>
                <select
                  id="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm border ring-1 ring-slate-200"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              {dynamicVars.length > 0 && selectedClient && (
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Preencher Variáveis</h3>
                  <div className="space-y-3">
                    {dynamicVars.map(v => (
                      <div key={v}>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          [{v}]
                        </label>
                        <input
                          type="text"
                          value={dynamicValues[v] || ''}
                          onChange={(e) => setDynamicValues(prev => ({ ...prev, [v]: e.target.value }))}
                          className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                          placeholder="Digite o valor..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handlePrint}
                  disabled={!selectedClient}
                  className="w-full flex justify-center items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer size={18} />
                  Imprimir / Salvar PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-100 p-8 rounded-lg min-h-[800px] flex items-start justify-center overflow-auto border border-slate-200">
            {selectedClient && template ? (
              <div 
                ref={printRef} 
                className="bg-white p-10 shadow-lg max-w-3xl w-full mx-auto"
                dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
              />
            ) : (
              <div className="text-center text-slate-500 mt-20">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p>Selecione um cliente para visualizar o documento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
