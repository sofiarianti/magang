import React, { useState } from 'react';
import api from './Services/api';
import endpointsUser from './Services/endpointUser';
import endpointsAdmin from './Services/endpointAdmin';
import ForgotPassword from './layout/User/ForgotPassword';

function getKodeHimpunFromAdmin(adminData) {
  if (!adminData) return null;
  if (adminData.kode_himpun) return adminData.kode_himpun;
  if (adminData.himpun?.kode_himpun) return adminData.himpun.kode_himpun;
  if (Array.isArray(adminData.himpun) && adminData.himpun[0]?.kode_himpun) {
    return adminData.himpun[0].kode_himpun;
  }
  if (adminData.user?.kode_himpun) return adminData.user.kode_himpun;
  if (adminData.data?.kode_himpun) return adminData.data.kode_himpun;
  return null;
}

function Login({ onLogin, onAdminLogin, onGoToRegister, onGuestAccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) {
    return <ForgotPassword onGoToLogin={() => setShowForgot(false)} />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let lastError = null;

      try {
        const responseUser = await api.post(endpointsUser.donatur.login, {
          email,
          password,
        });

        const userData = responseUser.data;
        localStorage.setItem('donatur_user', JSON.stringify(userData));
        onLogin(userData);
        return;
      } catch (errUser) {
        lastError = errUser;
        console.warn('Login donatur gagal, mencoba sebagai admin...', errUser);
      }

      const adminLoginEndpoints = [
        endpointsAdmin.users.login,
        endpointsAdmin.users.loginSuperAdmin,
      ].filter(Boolean);

      for (const adminLoginEndpoint of adminLoginEndpoints) {
        try {
          const responseAdmin = await api.post(adminLoginEndpoint, {
            email,
            password,
          });

          const adminData = responseAdmin.data;
          const kodeHimpun = getKodeHimpunFromAdmin(adminData);

          const storedAdmin = {
            ...adminData,
            ...(kodeHimpun ? { kode_himpun: kodeHimpun } : {}),
          };

          localStorage.setItem('admin_user', JSON.stringify(storedAdmin));
          if (onAdminLogin) {
            onAdminLogin(storedAdmin);
          }
          return;
        } catch (errAdmin) {
          lastError = errAdmin;
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (err) {
      const status = err.response?.status;
      const is404 = status === 404;
      let message =
        err.response?.data?.error ||
        err.message ||
        'Login gagal. Periksa kembali data Anda.';
      if (is404 && err.config?.url?.includes('/api/users/login')) {
        message =
          'Login donatur gagal. Endpoint admin (/api/users/login atau /api/users/login/superadmin) tidak ditemukan (404). Pastikan kredensial benar atau backend sudah deploy.';
      }
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
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100';

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_42%,_#fff7ed_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center">
        <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="relative overflow-hidden border-b border-blue-900/10 bg-[linear-gradient(145deg,_#0f172a_0%,_#1e3a8a_58%,_#1d4ed8_100%)] px-8 py-8 text-white">
            <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <img src="/logo512.png" alt="Logo MPZ DT" className="h-full w-full object-contain drop-shadow-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  Login Akun
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Selamat Datang</h2>
                <p className="mt-1 text-sm text-blue-100">
                  Masuk untuk melanjutkan donasi dan memantau transaksi Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                    <svg className="absolute right-4 top-4 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Butuh bantuan masuk?</p>
                    <p className="text-xs text-slate-500">Gunakan fitur pemulihan password.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm font-semibold text-blue-900 transition-colors hover:text-amber-600"
                  >
                    Lupa password
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_72%,_#f59e0b_140%)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
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

              <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-4 text-center">
                <p className="text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <button
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
      </div>
    </div>
  );
}

export default Login;




