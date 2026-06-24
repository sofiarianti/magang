import React, { useState } from 'react';
import api from './Services/api';
import endpointsUser from './Services/endpointUser';

function Login({ onLogin, onGoToRegister, onGuestAccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const responseUser = await api.post(endpointsUser.donatur.login, {
        email,
        password,
      });

      const userData = responseUser.data;
      localStorage.setItem('donatur_user', JSON.stringify(userData));
      onLogin(userData);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Login gagal. Periksa kembali data Anda.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <>
          <path
            d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </>
      ) : (
        <>
          <path
            d="M3 3l18 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M6.6 6.6C4.2 8.3 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.4 4.7-1.1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M9.4 5.2C10.2 5.1 11.1 5 12 5c6 0 9.5 7 9.5 7s-1.2 2.4-3.4 4.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );

  const inputClassName =
    'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1A3A6F] focus:bg-white focus:ring-4 focus:ring-[#1A3A6F]/10';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4 py-8 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:p-8">
        <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
            <img src="/bsz-assets/logo_dpudt.png" alt="Logo DT Peduli" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Login Akun</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-950">Selamat Datang</h1>
            <p className="mt-1 text-sm leading-5 text-slate-500">Masuk untuk melanjutkan ke dashboard donatur.</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    className={`${inputClassName} pr-12`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <svg className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password Anda"
                    className={`${inputClassName} pr-12`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-4 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-xl bg-[#1A3A6F] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Masuk ke Akun'
                )}
              </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Belum punya akun?{' '}
            <button
              type="button"
              className="font-semibold text-amber-700 transition-colors hover:text-blue-900"
              onClick={onGoToRegister}
            >
              Daftar sekarang
            </button>
          </p>
          <button
            type="button"
            onClick={onGuestAccess}
            className="mt-3 text-xs font-semibold text-blue-700 transition-colors hover:text-blue-900"
          >
            Lanjut sebagai Guest Donatur
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;


