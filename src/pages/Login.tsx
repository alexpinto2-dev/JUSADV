import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-2">
            <span className="absolute text-6xl font-serif text-yellow-600/80 -ml-4">R</span>
            <span className="absolute text-6xl font-serif text-yellow-500 mt-4 ml-4">L</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-serif tracking-[0.2em] text-yellow-500">
            RUBENS LIMA
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400 uppercase tracking-widest">
            Advocacia e Consultoria
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 bg-zinc-800 py-3 px-3 text-zinc-100 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 bg-zinc-800 py-3 px-3 text-zinc-100 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-yellow-600 px-3 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 transition-colors"
            >
              Entrar no Sistema
            </button>
          </div>
          <div className="text-center text-xs text-zinc-500 mt-4">
            Acesso padrão: admin@rubenslima.com / admin
          </div>
        </form>
      </div>
    </div>
  );
}
