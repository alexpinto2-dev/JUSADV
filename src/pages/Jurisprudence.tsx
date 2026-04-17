import React, { useState } from 'react';
import { useJurisprudence, JurisprudenceRecord } from '../store';
import { Search, MapPin, Scale, Trash2, ExternalLink, Loader2, Save } from 'lucide-react';

export function Jurisprudence() {
  const { savedJurisprudences, saveJurisprudence, deleteJurisprudence } = useJurisprudence();
  const [searchTerm, setSearchTerm] = useState('');
  const [tribunal, setTribunal] = useState('');
  const [tipoBusca, setTipoBusca] = useState<'texto' | 'processo' | 'palavraChave'>('texto');
  
  const [results, setResults] = useState<JurisprudenceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // In production, the URL is relative /api/jurisprudencia/validar
      const response = await fetch('/api/jurisprudencia/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termo: searchTerm, tribunal: tribunal || undefined, tipoBusca })
      });

      if (!response.ok) {
        throw new Error('Falha ao consultar jurisprudência.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (result: any) => {
    await saveJurisprudence(result);
    alert('Jurisprudência salva com sucesso no banco do escritório!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Validador de Jurisprudência</h1>
        <p className="mt-2 text-sm text-slate-700">
          Automação de pesquisa e validação em bases oficiais (LexML/Tribunais).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Nova Consulta</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Tipo de Busca</label>
                <select
                  value={tipoBusca}
                  onChange={(e) => setTipoBusca(e.target.value as any)}
                  className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm border ring-1 ring-slate-200"
                >
                  <option value="texto">Trecho de Decisão / Texto Livre</option>
                  <option value="processo">Número do Processo / Recurso</option>
                  <option value="palavraChave">Palavras-chave (Tema)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Tribunal (Opcional)</label>
                <select
                  value={tribunal}
                  onChange={(e) => setTribunal(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm border ring-1 ring-slate-200"
                >
                  <option value="">Todos (Em todo o Brasil)</option>
                  <option value="STF">STF</option>
                  <option value="STJ">STJ</option>
                  <option value="TST">TST</option>
                  <option value="TRF1">TRF1</option>
                  <option value="TJSP">TJSP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Termo Pesquisado</label>
                <textarea
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  placeholder={tipoBusca === 'processo' ? 'Ex: REsp 123456' : 'Ex: "dano moral" AND "extravio de bagagem"'}
                  rows={3}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !searchTerm}
                  className="w-full flex justify-center items-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                  Validar Jurisprudência
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-md font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Save size={18} className="text-slate-500" /> Jurisprudências Salvas
            </h2>
            {savedJurisprudences.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum registro armazenado.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedJurisprudences.map(j => (
                  <div key={j.id} className="bg-white p-3 rounded border border-slate-200 text-sm">
                    <div className="font-semibold text-slate-800 flex justify-between items-start">
                      <span>{j.tribunal} - {j.processo}</span>
                      <button onClick={() => deleteJurisprudence(j.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-slate-600 truncate mt-1">{j.ementa}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium text-slate-900">Resultados Oficiais</h2>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="bg-white p-12 text-center rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
              <Scale size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500">Faça uma busca para validar a jurisprudência nos tribunais.</p>
              <p className="text-xs text-slate-400 mt-2">Módulo integrado via APIs REST / OpenSearch.</p>
            </div>
          )}

          <div className="space-y-4">
            {results.map((r, i) => {
              const isVigente = r.status.toLowerCase().includes('vigente');
              return (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 flex gap-2">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    isVigente 
                      ? 'bg-green-50 text-green-700 ring-green-600/20' 
                      : 'bg-red-50 text-red-700 ring-red-600/20'
                  }`}>
                    Status: {r.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 pr-24 flex items-center gap-2">
                  <MapPin size={18} className="text-yellow-600" />
                  {r.tribunal} - {r.processo}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-600">
                  <div><strong className="text-slate-700">Data:</strong> {r.data}</div>
                  <div><strong className="text-slate-700">Órgão Julgador:</strong> {r.orgao_julgador}</div>
                  <div><strong className="text-slate-700">Relator:</strong> {r.relator}</div>
                </div>

                <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-100 text-sm text-slate-800">
                  <strong className="block text-slate-700 mb-1">Ementa / Decisão:</strong>
                  {r.ementa}
                </div>

                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                  <button 
                    onClick={() => handleSave(r)}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-yellow-700 shadow-sm ring-1 ring-inset ring-yellow-300 hover:bg-yellow-50"
                  >
                    <Save size={16} /> Salvar no Banco
                  </button>
                  <a 
                    href={r.fonte} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    <ExternalLink size={16} /> Ver Íntegra
                  </a>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
