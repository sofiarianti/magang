import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePostDonatur from '../../hooks/usePostDonatur';

function GuestIdentityForm({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const inferredForcedJenisKey = currentPath.includes('/donasi/wakaf')
    ? 'wakaf'
    : currentPath.includes('/donasi/infaq-sedekah')
      ? 'infaq-sedekah'
      : currentPath.includes('/donasi/zakat')
        ? 'zakat'
        : null;
  const nextPath = location.state?.nextPath || '/transaksi';
  const selectedJenis = location.state?.selectedJenis || null;
  const selectedDetail = location.state?.selectedDetail || null;
  const forcedJenisKey = location.state?.forcedJenisKey || inferredForcedJenisKey;
  const { postDonatur, loading, error: postDonaturError } = usePostDonatur();

  const initialForm = useMemo(
    () => ({
      nama: user?.donatur?.nama || (user?.nama && user.nama !== 'Guest Donatur' ? user.nama : ''),
      jenis_kelamin: user?.donatur?.jenis_kelamin || user?.jenis_kelamin || '',
      no_hp: user?.donatur?.no_hp || user?.no_hp || '',
      email: user?.donatur?.email || user?.email || '',
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalized = {
      nama: String(form.nama || '').trim(),
      jenis_kelamin: String(form.jenis_kelamin || '').trim(),
      no_hp: String(form.no_hp || '').trim(),
      email: String(form.email || '').trim(),
    };

    if (!normalized.nama || !normalized.jenis_kelamin || !normalized.no_hp || !normalized.email) {
      setError('Nama, jenis kelamin, nomor HP, dan email wajib diisi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized.email)) {
      setError('Format email tidak valid.');
      return;
    }

    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(normalized.no_hp.replace(/\s/g, ''))) {
      setError('Format nomor HP tidak valid. Gunakan +62xxx atau 0xxx.');
      return;
    }

    const createdGuestDonatur = await postDonatur(
      '',
      normalized.nama,
      '',
      '',
      '',
      normalized.jenis_kelamin,
      '',
      '',
      '',
      '',
      normalized.no_hp,
      normalized.email,
      '',
      0
    );

    if (!createdGuestDonatur) {
      setError(postDonaturError || 'Gagal menyimpan data donatur tamu. Silakan cek data Anda dan coba lagi.');
      return;
    }

    const guestDonaturEntity = createdGuestDonatur?.donatur || createdGuestDonatur;
    const kodeDonatur =
      guestDonaturEntity?.kode_donatur ||
      guestDonaturEntity?.kode ||
      '';

    if (!kodeDonatur || !String(kodeDonatur).trim()) {
      setError('Data donatur tamu berhasil dikirim, tetapi kode donatur tidak diterima.');
      return;
    }

    const updatedGuestUser = {
      nama: normalized.nama,
      email: normalized.email,
      no_hp: normalized.no_hp,
      jenis_kelamin: normalized.jenis_kelamin,
      kode_donatur: kodeDonatur,
      isGuest: true,
      isRegister: 0,
      is_register: 0,
    };

    localStorage.setItem(
      'guest_user',
      JSON.stringify({
        nama: normalized.nama,
        email: normalized.email,
        no_hp: normalized.no_hp,
        jenis_kelamin: normalized.jenis_kelamin,
        isGuest: true,
        isRegister: 0,
        is_register: 0,
      })
    );

    navigate(nextPath, {
      replace: true,
      state: {
        user: updatedGuestUser,
        selectedJenis,
        selectedDetail,
        forcedJenisKey,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_42%,_#fff7ed_100%)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="border-b border-blue-900/10 bg-[linear-gradient(145deg,_#0f172a_0%,_#1e3a8a_58%,_#1d4ed8_100%)] px-8 py-8 text-white lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Data Tamu</p>
            <h1 className="mt-2 text-3xl font-semibold">Lengkapi Identitas Sebelum Donasi</h1>
            <p className="mt-3 text-sm text-blue-100">
              Sebelum masuk ke form transaksi, lengkapi identitas dasar Anda terlebih dahulu.
            </p>
          </div>

          <div className="p-8 lg:p-10">
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Nama</label>
                  <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Nomor HP</label>
                  <input type="tel" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="Contoh: 08123456789" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Masukkan email aktif" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100" />
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-slate-600">
                Data ini digunakan untuk pencatatan donasi tamu sebelum transaksi dibuat.
              </div>

              <div className="flex gap-4 border-t border-slate-200 pt-6">
                <button type="button" onClick={() => navigate('/', { replace: true })} className="flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-slate-50">
                  Kembali ke Home
                </button>
                <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_72%,_#f59e0b_140%)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Menyimpan Data...' : 'Next ke Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestIdentityForm;
