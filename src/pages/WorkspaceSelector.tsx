import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenants } from '../store';

export function WorkspaceSelector() {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { tenants } = useTenants();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tenant = tenants.find(t => t.slug === slug.toLowerCase());
    if (tenant) {
      navigate(`/${tenant.slug}`);
    } else if (slug.toUpperCase() === 'JUSADV') {
      navigate('/superadmin');
    } else {
      setError('Workspace não encontrado.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mt-6 text-center text-2xl font-serif tracking-[0.2em] text-yellow-500">
            JUSADV
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Digite o endereço do seu workspace
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="workspace" className="sr-only">
              Workspace URL
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-600 sm:max-w-md">
              <input
                type="text"
                name="workspace"
                id="workspace"
                className="block flex-1 border-0 bg-transparent py-3 pl-3 text-zinc-100 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="seuescritorio"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <span className="flex select-none items-center pr-3 text-zinc-500 sm:text-sm">.app.com</span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-yellow-600 px-3 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 transition-colors"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
