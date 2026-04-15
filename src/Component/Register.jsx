import React, { useState } from 'react';
import usePostDonatur from './hooks/usePostDonatur';
import { addNotification } from './Services/notifikasi';

function Register({ onGoToLogin, onRegisterLogin }) {
  const { postDonatur, loading, error } = usePostDonatur();
  const [formData, setFormData] = useState({
    email: '',
    no_hp: '',
    password: '',
    password_confirm: '',
  });
  const [stepError, setStepError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const inputClassName =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100';
  const primaryButtonClassName =
    'flex-1 rounded-2xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_72%,_#f59e0b_140%)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none';
  const secondaryButtonClassName =
    'flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-blue-200 hover:bg-slate-50';

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 85) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Lemah';
    if (passwordStrength < 60) return 'Sedang';
    if (passwordStrength < 85) return 'Kuat';
    return 'Sangat Kuat';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStepError('');

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.no_hp || !formData.password) {
      setStepError('Email, nomor HP, dan password harus diisi.');
      return;
    }

    // Stricter email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setStepError('Format email tidak valid. Gunakan format: nama@domain.com');
      return;
    }

    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(formData.no_hp.replace(/\s/g, ''))) {
      setStepError('Format nomor HP tidak valid (gunakan +62xxx atau 0xxx dengan 9-12 digit).');
      return;
    }

    if (formData.password.length < 6) {
      setStepError('Password minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setStepError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    const result = await postDonatur(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      formData.no_hp,
      formData.email,
      formData.password,
      1
    );

    if (result) {
      try {
        localStorage.setItem('donatur_user', JSON.stringify(result));
        
        // Safely extract audience key with fallback
        const audienceKey = result?.kode_donatur || result?.donatur?.kode_donatur;
        
        addNotification({
          title: 'Registrasi Berhasil',
          message: 'Akun berhasil dibuat. Lengkapi data diri Anda di halaman profil.',
          userType: 'donatur',
          audienceKey: audienceKey || null,
        });
        onRegisterLogin(result);
        return;
      } catch (storageError) {
        console.error('Error saving user data:', storageError);
        setStepError('Gagal menyimpan data. Silakan coba lagi.');
        return;
      }
    }

    setStepError(error || 'Terjadi kesalahan saat menyimpan data.');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_42%,_#fff7ed_100%)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="relative overflow-hidden border-b border-blue-900/10 bg-[linear-gradient(145deg,_#0f172a_0%,_#1e3a8a_58%,_#1d4ed8_100%)] px-8 py-8 text-white lg:px-10">
            <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <img src="/logo512.png" alt="Logo MPZ DT" className="h-full w-full object-contain drop-shadow-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Buat Akun Baru</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Daftar Donatur MPZ DT</h1>
                <p className="mt-2 text-sm text-blue-100">
                  Registrasi cukup dengan email, nomor HP, dan password. Data diri bisa dilengkapi nanti di halaman profil.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            {(stepError || error) && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4v2m0-14a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                <div>
                  <p className="mb-1 font-semibold text-red-900">Terjadi Kesalahan</p>
                  <p className="text-sm text-red-700">{stepError || error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Informasi Akun</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Setelah akun dibuat, Anda bisa langsung masuk lalu melengkapi biodata donatur di halaman profil.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email Anda"
                    onChange={handleChange}
                    value={formData.email}
                    className={inputClassName}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">Email akan digunakan sebagai username untuk login. Gunakan format: nama@domain.com</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Nomor HP *</label>
                  <input
                    type="tel"
                    name="no_hp"
                    placeholder="Contoh: 62812345678 atau 08123456789"
                    onChange={handleChange}
                    value={formData.no_hp}
                    className={inputClassName}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">Format: +62xxx atau 0xxx dengan 9-12 digit angka.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Masukkan password minimal 6 karakter"
                      onChange={handleChange}
                      value={formData.password}
                      className={`${inputClassName} pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Kekuatan Password:</span>
                        <span
                          className={`text-xs font-bold ${
                            passwordStrength < 30
                              ? 'text-red-600'
                              : passwordStrength < 60
                                ? 'text-yellow-600'
                                : passwordStrength < 85
                                  ? 'text-blue-600'
                                  : 'text-green-600'
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Konfirmasi Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirm"
                    placeholder="Masukkan ulang password"
                    onChange={handleChange}
                    value={formData.password_confirm}
                    className={`${inputClassName} ${
                      formData.password_confirm && formData.password !== formData.password_confirm
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : ''
                    }`}                    required
                  />
                  {formData.password_confirm && (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        formData.password === formData.password_confirm ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {formData.password === formData.password_confirm ? 'Password cocok.' : 'Password tidak cocok.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">Lengkapi profil setelah login</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Biodata seperti nama lengkap, alamat, NIK, tempat lahir, dan data pribadi lainnya bisa Anda isi nanti
                  melalui menu profil.
                </p>
              </div>

              <div className="flex gap-4 border-t border-slate-200 pt-6">
                <button type="button" onClick={onGoToLogin} className={secondaryButtonClassName}>
                  Kembali ke Login
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.email ||
                    !formData.no_hp ||
                    !formData.password ||
                    formData.password !== formData.password_confirm ||
                    formData.password.length < 6
                  }
                  className={`${primaryButtonClassName} flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Selesaikan Registrasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
