import React, { useState } from 'react';
import api from '../../Services/api';

function ForgotPassword({ onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: input email, 2: input OTP & password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Kirim OTP ke email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      // Pastikan payload hanya { email }
      await api.post('/api/donatur/password/otp-request', { email });
      setStep(2);
      setSuccess('Kode OTP telah dikirim ke email Anda.');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Gagal mengirim OTP. Pastikan email terdaftar.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verifikasi OTP dan ubah password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setIsLoading(true);
    try {
      // Pastikan payload dan endpoint benar
      await api.post('/api/donatur/password/otp-verify', {
        email,
        otp,
        newPassword,
      });
      setSuccess('Password berhasil diubah. Silakan login dengan password baru.');
      setTimeout(() => {
        if (onGoToLogin) onGoToLogin();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Gagal mengubah password. Pastikan OTP benar.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-200/50 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">Lupa Password</h2>
          <p className="text-sm text-slate-600 mt-1">
            Masukkan email donatur Anda untuk reset password.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan email donatur Anda"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? 'Mengirim OTP...' : 'Kirim OTP'}
            </button>
            <button
              type="button"
              className="w-full mt-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              onClick={onGoToLogin}
            >
              Kembali ke Login
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                Kode OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Masukkan kode OTP dari email"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Password Baru
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Masukkan password baru"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password baru"
                className="w-full border border-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
            <button
              type="button"
              className="w-full mt-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              onClick={onGoToLogin}
            >
              Kembali ke Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
