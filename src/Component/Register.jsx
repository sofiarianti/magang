import React, { useState } from 'react';
import usePostDonatur from './hooks/usePostDonatur';
import { addNotification } from './Services/notifikasi';

function Register({ onGoToLogin, onRegisterLogin }) {
  const { postDonatur, loading, error } = usePostDonatur();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    email: '',
    no_hp: '',
    // Step 2
    nik: '',
    nama: '',
    alamat: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    status_perkawinan: '',
    pekerjaan: '',
    kewarganegaraan: '',
    // Step 3
    password: '',
    password_confirm: '',
  });

  const [stepError, setStepError] = useState(null);
  const inputClassName =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100';
  const subtleInputClassName = `${inputClassName} bg-slate-50/40`;
  const primaryButtonClassName =
    'flex-1 rounded-2xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_72%,_#f59e0b_140%)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none';
  const secondaryButtonClassName =
    'flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-blue-200 hover:bg-slate-50';

  const handleStep1Next = (data) => {
    // Validasi step 1
    if (!data.email || !data.no_hp) {
      setStepError('Email dan Nomor HP harus diisi');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setStepError('Format email tidak valid');
      return;
    }

    // Validasi format nomor HP
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(data.no_hp.replace(/\s/g, ''))) {
      setStepError('Format nomor HP tidak valid (gunakan format: 62xxx atau 0xxx)');
      return;
    }

    setFormData({ ...formData, ...data });
    setStepError(null);
    setCurrentStep(2);
  };

  const handleStep2Next = (data) => {
    // Validasi step 2
    const requiredFields = ['nik', 'nama', 'alamat', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'status_perkawinan', 'pekerjaan', 'kewarganegaraan'];
    
    for (let field of requiredFields) {
      if (!data[field]) {
        setStepError(`${field} harus diisi`);
        return;
      }
    }

    // Validasi NIK (16 digit)
    if (!/^\d{16}$/.test(data.nik)) {
      setStepError('NIK harus 16 digit');
      return;
    }

    setFormData({ ...formData, ...data });
    setStepError(null);
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data) => {
    // Validasi step 3
    if (!data.password) {
      setStepError('Password harus diisi');
      return;
    }

    if (data.password !== data.password_confirm) {
      setStepError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (data.password.length < 6) {
      setStepError('Password minimal 6 karakter');
      return;
    }

    const finalData = { ...formData, ...data };

    const result = await postDonatur(
      finalData.nik,
      finalData.nama,
      finalData.alamat,
      finalData.tempat_lahir,
      finalData.tanggal_lahir,
      finalData.jenis_kelamin,
      finalData.agama,
      finalData.status_perkawinan,
      finalData.pekerjaan,
      finalData.kewarganegaraan,
      finalData.no_hp,
      finalData.email,
      finalData.password
    );

    if (result) {
      localStorage.setItem('donatur_user', JSON.stringify(result));
      addNotification({
        title: 'Registrasi Berhasil',
        message: 'Selamat, Anda telah berhasil registrasi sebagai donatur MPZ DT.',
        userType: 'donatur',
        audienceKey: result?.kode_donatur || result?.donatur?.kode_donatur || null,
      });
      onRegisterLogin(result);
    } else {
      setStepError('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStepError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  // ==================== STEP 1 COMPONENT ====================
  const Step1 = () => {
    const [step1Data, setStep1Data] = useState({
      email: formData.email || '',
      no_hp: formData.no_hp || '',
    });

    const handleChange = (e) => {
      setStep1Data({
        ...step1Data,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleStep1Next(step1Data);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">Email dan Nomor HP</h3>
          <p className="text-sm leading-6 text-slate-600">Mulai dengan mengisi email dan nomor HP Anda. Data ini akan digunakan untuk login dan komunikasi.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Email *</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Masukkan email Anda" 
              onChange={handleChange} 
              value={step1Data.email}
              className={subtleInputClassName}
              required 
            />
            <p className="text-xs text-slate-500 mt-2">Email akan digunakan sebagai username untuk login</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Nomor HP *</label>
            <input 
              type="tel" 
              name="no_hp" 
              placeholder="Contoh: 62812345678 atau 08123456789" 
              onChange={handleChange} 
              value={step1Data.no_hp}
              className={subtleInputClassName}
              required 
            />
            <p className="text-xs text-slate-500 mt-2">Format: +62xxx atau 0xxx (9-13 digit)</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex gap-4">
          <button
            type="button"
            onClick={onGoToLogin}
            className={secondaryButtonClassName}
          >
            Kembali ke Login
          </button>
          <button
            type="submit"
            className={`${primaryButtonClassName} flex items-center justify-center gap-2`}
          >
            <span>Berikutnya</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    );
  };

  // ==================== STEP 2 COMPONENT DATA DIRI ====================
  const Step2 = () => {
    const [step2Data, setStep2Data] = useState({
      nik: formData.nik || '',
      nama: formData.nama || '',
      alamat: formData.alamat || '',
      tempat_lahir: formData.tempat_lahir || '',
      tanggal_lahir: formData.tanggal_lahir || '',
      jenis_kelamin: formData.jenis_kelamin || '',
      agama: formData.agama || '',
      status_perkawinan: formData.status_perkawinan || '',
      pekerjaan: formData.pekerjaan || '',
      kewarganegaraan: formData.kewarganegaraan || '',
    });

    const handleChange = (e) => {
      setStep2Data({
        ...step2Data,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleStep2Next(step2Data);
    };

    return (
      <div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">Data Diri</h3>
            <p className="text-sm leading-6 text-slate-600">Isi data diri Anda secara lengkap dan akurat.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">NIK (16 digit) *</label>
              <input 
                type="text" 
                name="nik" 
                placeholder="Masukkan NIK 16 digit" 
                onChange={handleChange} 
                value={step2Data.nik}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Nama Lengkap *</label>
              <input 
                type="text" 
                name="nama" 
                placeholder="Masukkan nama lengkap sesuai KTP" 
                onChange={handleChange} 
                value={step2Data.nama}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Tempat Lahir *</label>
              <input 
                type="text" 
                name="tempat_lahir" 
                placeholder="Masukkan tempat lahir" 
                onChange={handleChange} 
                value={step2Data.tempat_lahir}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Tanggal Lahir *</label>
              <input 
                type="date" 
                name="tanggal_lahir" 
                onChange={handleChange} 
                value={step2Data.tanggal_lahir}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Jenis Kelamin *</label>
              <select 
                name="jenis_kelamin" 
                onChange={handleChange} 
                value={step2Data.jenis_kelamin}
                className={subtleInputClassName}
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Agama *</label>
              <select 
                name="agama" 
                onChange={handleChange} 
                value={step2Data.agama}
                className={subtleInputClassName}
                required
              >
                <option value="">Pilih agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Status Perkawinan *</label>
              <select 
                name="status_perkawinan" 
                onChange={handleChange} 
                value={step2Data.status_perkawinan}
                className={subtleInputClassName}
                required
              >
                <option value="">Pilih status</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Pekerjaan *</label>
              <input 
                type="text" 
                name="pekerjaan" 
                placeholder="Masukkan pekerjaan Anda" 
                onChange={handleChange} 
                value={step2Data.pekerjaan}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Kewarganegaraan *</label>
              <input 
                type="text" 
                name="kewarganegaraan" 
                placeholder="Masukkan kewarganegaraan" 
                onChange={handleChange} 
                value={step2Data.kewarganegaraan}
                className={subtleInputClassName}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Alamat *</label>
              <textarea 
                name="alamat" 
                placeholder="Masukkan alamat lengkap" 
                onChange={handleChange} 
                value={step2Data.alamat}
                rows="3"
                className={`${subtleInputClassName} resize-none`}
                required 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className={`${secondaryButtonClassName} flex items-center justify-center gap-2`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>
            <button
              type="submit"
              className={`${primaryButtonClassName} flex items-center justify-center gap-2`}
            >
              <span>Berikutnya</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ==================== STEP 3 COMPONENT PASSWORD====================
  const Step3 = () => {
    const [step3Data, setStep3Data] = useState({
      password: '',
      password_confirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setStep3Data({
        ...step3Data,
        [name]: value,
      });

      if (name === 'password') {
        calculatePasswordStrength(value);
      }
    };

    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength += 25;
      if (password.length >= 10) strength += 25;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
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

    const handleSubmit = (e) => {
      e.preventDefault();
      handleStep3Submit(step3Data);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">Atur Password</h3>
          <p className="text-sm leading-6 text-slate-600">Buat password yang kuat untuk melindungi akun Anda. Gunakan kombinasi huruf, angka, dan simbol.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Password *</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password" 
                placeholder="Masukkan password (minimal 6 karakter)" 
                onChange={handleChange} 
                value={step3Data.password}
                className={`${inputClassName} pr-12`}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {step3Data.password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">Kekuatan Password:</span>
                  <span className={`text-xs font-bold ${
                    passwordStrength < 30 ? 'text-red-600' :
                    passwordStrength < 60 ? 'text-yellow-600' :
                    passwordStrength < 85 ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-3">Persyaratan Password:</p>
              <ul className="space-y-2 text-xs">
                <li className={`flex items-center gap-2 ${step3Data.password.length >= 6 ? 'text-green-700' : 'text-slate-600'}`}>
                  <svg className={`w-4 h-4 ${step3Data.password.length >= 6 ? 'text-green-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Minimal 6 karakter
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(step3Data.password) ? 'text-green-700' : 'text-slate-600'}`}>
                  <svg className={`w-4 h-4 ${/[A-Z]/.test(step3Data.password) ? 'text-green-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mengandung huruf besar (A-Z)
                </li>
                <li className={`flex items-center gap-2 ${/[a-z]/.test(step3Data.password) ? 'text-green-700' : 'text-slate-600'}`}>
                  <svg className={`w-4 h-4 ${/[a-z]/.test(step3Data.password) ? 'text-green-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mengandung huruf kecil (a-z)
                </li>
                <li className={`flex items-center gap-2 ${/[0-9]/.test(step3Data.password) ? 'text-green-700' : 'text-slate-600'}`}>
                  <svg className={`w-4 h-4 ${/[0-9]/.test(step3Data.password) ? 'text-green-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mengandung angka (0-9)
                </li>
                <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(step3Data.password) ? 'text-green-700' : 'text-slate-600'}`}>
                  <svg className={`w-4 h-4 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(step3Data.password) ? 'text-green-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mengandung simbol (!@#$%...)
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Konfirmasi Password *</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password_confirm" 
                placeholder="Masukkan ulang password" 
                onChange={handleChange} 
                value={step3Data.password_confirm}
                className={`w-full px-5 py-3 pr-12 rounded-xl border-2 transition-all duration-200 font-medium focus:outline-none ${
                  step3Data.password_confirm && step3Data.password !== step3Data.password_confirm
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : step3Data.password_confirm === step3Data.password && step3Data.password
                    ? 'border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    : 'border-slate-200 bg-white focus:ring-4 focus:ring-amber-100 focus:border-amber-400'
                }`}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {step3Data.password_confirm && (
              <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                step3Data.password === step3Data.password_confirm
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {step3Data.password === step3Data.password_confirm
                  ? 'Password cocok'
                  : 'Password tidak cocok'}
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className={`${secondaryButtonClassName} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>
          <button
            type="submit"
            disabled={loading || !step3Data.password || step3Data.password !== step3Data.password_confirm || step3Data.password.length < 6}
            className={`${primaryButtonClassName} disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Menyelesaikan Registrasi...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Selesaikan Registrasi</span>
              </>
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_42%,_#fff7ed_100%)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-[0_24px_80px_rgba(15,23,42,0.12)] border border-slate-200 overflow-hidden">
          <div className="relative overflow-hidden border-b border-blue-900/10 bg-[linear-gradient(145deg,_#0f172a_0%,_#1e3a8a_58%,_#1d4ed8_100%)] px-8 py-8 lg:px-10 text-white">
            <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="flex flex-col gap-5">
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                  <img src="/logo512.png" alt="Logo MPZ DT" className="h-full w-full object-contain drop-shadow-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Buat Akun Baru</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">Daftar Donatur MPZ DT</h1>
                  <p className="mt-2 text-sm text-blue-100">
                    Lengkapi formulir berikut untuk mulai berdonasi dan memantau transaksi Anda.
                  </p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((step) => {
                  const active = currentStep === step;
                  const done = currentStep > step;
                  return (
                    <div
                      key={step}
                      className={`rounded-2xl border px-4 py-3 ${
                        active
                          ? 'border-amber-300 bg-amber-50 text-slate-900'
                          : done
                            ? 'border-white/20 bg-white/15 text-white'
                            : 'border-white/10 bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            active
                              ? 'bg-amber-500 text-white'
                              : done
                                ? 'bg-white text-blue-900'
                                : 'bg-white/15 text-white'
                          }`}
                        >
                          {step}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${active ? 'text-slate-900' : 'text-white'}`}>
                            {step === 1 ? 'Kontak' : step === 2 ? 'Identitas' : 'Password'}
                          </p>
                          <p className={`text-[11px] ${active ? 'text-slate-600' : 'text-blue-100'}`}>
                            {step === 1 ? 'Email & HP' : step === 2 ? 'Data diri' : 'Keamanan akun'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            {(stepError || error) && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4v2m0-14a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-900 mb-1">Terjadi Kesalahan</p>
                  <p className="text-sm text-red-700">{stepError || error}</p>
                </div>
              </div>
            )}

            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
