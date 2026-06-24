import React, { useState } from 'react';
import useAPI from './hooks/useAPI';
import usePostDonatur from './hooks/usePostDonatur';
import endpoints from './Services/endpointUser';
import { addNotification } from './Services/notifikasi';

function Register({ onGoToLogin, onRegisterLogin }) {
  const { postDonatur, loading, error } = usePostDonatur();
  const { data: lembagaList, loading: lembagaLoading, error: lembagaError } = useAPI(endpoints.lembaga.getAll);
  const normalizedLembagaList = Array.isArray(lembagaList)
    ? lembagaList
    : Array.isArray(lembagaList?.data)
    ? lembagaList.data
    : Array.isArray(lembagaList?.lembaga)
    ? lembagaList.lembaga
    : [];
  const [formData, setFormData] = useState({
    id_lembaga: '',
    nama: '',
    jenis_kelamin: '',
    email: '',
    no_hp: '',
    password: '',
    password_confirm: '',
  });
  const [stepError, setStepError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const inputClassName =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100';
  const primaryButtonClassName =
    'flex-1 rounded-xl bg-[#1A3A6F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none';
  const secondaryButtonClassName =
    'flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-blue-200 hover:bg-slate-50';

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

    if (!formData.id_lembaga || !formData.nama || !formData.jenis_kelamin || !formData.email || !formData.no_hp || !formData.password) {
      setStepError('Lembaga, nama, jenis kelamin, email, nomor HP, dan password harus diisi.');
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
      formData.nama,
      '',
      '',
      '',
      formData.jenis_kelamin,
      '',
      '',
      '',
      '',
      formData.no_hp,
      formData.email,
      formData.password,
      1,
      formData.id_lembaga
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
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="relative overflow-hidden border-b border-slate-200 bg-[#1A3A6F] px-6 py-7 text-white sm:px-8 lg:px-10">
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white p-3 shadow-sm">
                  <img src="/bsz-assets/logo_dpudt.png" alt="Logo DT Peduli" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">Buat Akun Baru</p>
                  <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Daftar Donatur</h1>
                </div>
              </div>
              <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm leading-6 text-blue-50 backdrop-blur-sm">
                Registrasi cukup dengan data utama. Biodata lengkap bisa dilengkapi setelah login.
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {(stepError || error) && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
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
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Informasi Akun</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Isi data berikut untuk membuat akun donatur.
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Wajib diisi</span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Lembaga *</label>
                  <select
                    name="id_lembaga"
                    onChange={handleChange}
                    value={formData.id_lembaga}
                    className={inputClassName}
                    required
                  >
                    <option value="">Pilih lembaga</option>
                    {lembagaLoading && <option value="">Memuat lembaga...</option>}
                    {!lembagaLoading && lembagaError && <option value="">Gagal memuat lembaga</option>}
                    {!lembagaLoading && !lembagaError && normalizedLembagaList.length === 0 && <option value="">Belum ada lembaga tersedia</option>}
                    {!lembagaLoading && normalizedLembagaList.map((lembaga) => (
                      <option key={lembaga.id_lembaga || lembaga.id || lembaga._id} value={lembaga.id_lembaga || lembaga.id || lembaga._id}>
                        {lembaga.nama_lembaga || lembaga.nama || lembaga.name || `Lembaga ${lembaga.id_lembaga || lembaga.id || lembaga._id}`}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">Pilih lembaga tempat donatur terdaftar.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Nama *</label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Masukkan nama Anda"
                    onChange={handleChange}
                    value={formData.nama}
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Jenis Kelamin *</label>
                  <select
                    name="jenis_kelamin"
                    onChange={handleChange}
                    value={formData.jenis_kelamin}
                    className={inputClassName}
                    required
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

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
                  <p className="mt-2 text-xs text-slate-500">Email digunakan sebagai username login.</p>
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
                  <p className="mt-2 text-xs text-slate-500">Format: +62xxx atau 0xxx.</p>
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
                      className="absolute inset-y-0 right-0 px-4 text-slate-500 transition-colors hover:text-slate-700"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
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
                    }`}
                    required
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

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:gap-4">
                <button type="button" onClick={onGoToLogin} className={secondaryButtonClassName}>
                  Kembali ke Login
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.nama ||
                    !formData.jenis_kelamin ||
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
