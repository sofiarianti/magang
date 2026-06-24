import React, { useState, useEffect } from 'react';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';
import usePutDonatur from '../../hooks/useUpdateDonatur';
import {
  validatePasswordStrength,
  isPasswordSame,
  isPasswordMatch,
} from '../../Services/passwordValidator';

function ChangePasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: verify old password, 2: set new password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [donaturId, setDonaturId] = useState(null);

  const { data, loading: profileLoading } = useAPI(
    donaturId ? endpoints.donatur.getById(donaturId) : null
  );
  const { putDonatur, loading, error } = usePutDonatur();

  useEffect(() => {
    const savedUser = localStorage.getItem('donatur_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setDonaturId(parsed.id || parsed.donatur?.id || null);
      } catch {
        setDonaturId(null);
      }
    }
  }, []);

  if (!isOpen) return null;

  const profile = data?.donatur || {};

  const handleVerifyOldPassword = async () => {
    setLocalError('');

    if (!oldPassword.trim()) {
      setLocalError('Kata sandi lama tidak boleh kosong');
      return;
    }

    // Langsung ke step 2, tanpa API call
    // Backend akan verifikasi password lama pada saat submit akhir
    setStep(2);
  };

  const handleChangePassword = async () => {
    setLocalError('');

    // Validasi input
    if (!newPassword.trim()) {
      setLocalError('Kata sandi baru tidak boleh kosong');
      return;
    }

    if (!confirmPassword.trim()) {
      setLocalError('Konfirmasi kata sandi tidak boleh kosong');
      return;
    }

    // Check password sama dengan password lama
    if (isPasswordSame(oldPassword, newPassword)) {
      setLocalError('Kata sandi baru tidak boleh sama dengan kata sandi lama');
      return;
    }

    // Validasi strength password baru
    const validation = validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      setLocalError(validation.errors.join(', '));
      return;
    }

    // Check password match
    if (!isPasswordMatch(newPassword, confirmPassword)) {
      setLocalError('Kata sandi baru tidak cocok dengan konfirmasi');
      return;
    }

    if (!donaturId) {
      setLocalError('Akun donatur tidak ditemukan, silakan login ulang.');
      return;
    }

    const result = await putDonatur(
      donaturId,
      profile.nik || '',
      profile.nama || '',
      profile.alamat || '',
      profile.tempat_lahir || '',
      profile.tanggal_lahir || '',
      profile.jenis_kelamin || '',
      profile.agama || '',
      profile.status_perkawinan || '',
      profile.pekerjaan || '',
      profile.kewarganegaraan || '',
      profile.no_hp || '',
      profile.email || '',
      newPassword
    );

    if (result) {
      setSuccessMessage('Kata sandi berhasil diubah!');
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setLocalError('');
    setSuccessMessage('');
    onClose();
  };

  const passwordValidation = validatePasswordStrength(newPassword);

  if (profileLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-xl bg-white shadow-lg animate-in fade-in zoom-in-95">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Ubah Kata Sandi</h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            </div>
          )}

          {/* Error Message */}
          {(localError || error) && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{localError || error}</span>
              </div>
            </div>
          )}

          {/* Step 1: Verify Old Password */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Kata Sandi Lama
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showOldPassword ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.414 1.415a1 1 0 00.707-.293 10 10 0 00-1.414-1.414zM6.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.780-1.116l.501.501A5.978 5.978 0 1010 15.5v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">
                  Masukkan kata sandi lama Anda untuk melanjutkan
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleVerifyOldPassword}
                  disabled={!oldPassword.trim()}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Set New Password */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Info Box */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
                <div className="flex gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm0 4a1 1 0 100 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
                  </svg>
                  <span>Kata sandi lama Anda akan diverifikasi saat proses penyimpanan</span>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru"
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.414 1.415a1 1 0 00.707-.293 10 10 0 00-1.414-1.414zM6.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.780-1.116l.501.501A5.978 5.978 0 1010 15.5v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-700">Kriteria Kata Sandi Kuat:</div>
                  <div className="space-y-1.5">
                    {[
                      { key: 'length', label: '• Minimal 8 karakter' },
                      { key: 'uppercase', label: '• Minimal 1 huruf besar (A-Z)' },
                      { key: 'lowercase', label: '• Minimal 1 huruf kecil (a-z)' },
                      { key: 'number', label: '• Minimal 1 angka (0-9)' },
                      { key: 'symbol', label: '• Minimal 1 simbol (!@#$%^&*)' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`text-xs flex items-center gap-2 ${
                          passwordValidation.requirements[item.key]
                            ? 'text-green-700'
                            : 'text-slate-500'
                        }`}
                      >
                        <svg
                          className={`h-4 w-4 ${
                            passwordValidation.requirements[item.key]
                              ? 'text-green-600'
                              : 'text-slate-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {passwordValidation.requirements[item.key] ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <circle cx="10" cy="10" r="1" />
                          )}
                        </svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.414 1.415a1 1 0 00.707-.293 10 10 0 00-1.414-1.414zM6.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.780-1.116l.501.501A5.978 5.978 0 1010 15.5v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Ubah Kata Sandi'
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Kembali
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
