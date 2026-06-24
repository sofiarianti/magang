import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';
import usePutDonatur from '../../hooks/useUpdateDonatur';

function ProfilEdit() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('donatur_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('donatur_user');
      }
    }
  }, []);

  const donaturId = user?.id || user?.donatur?.id;

  const { data, loading, error } = useAPI(
    donaturId ? endpoints.donatur.getById(donaturId) : null
  );

  useEffect(() => {
    const donaturData = data?.donatur;
    if (donaturData && !form) {
      setForm({
        nik: donaturData.nik || '',
        nama: donaturData.nama || '',
        alamat: donaturData.alamat || '',
        tempat_lahir: donaturData.tempat_lahir || '',
        tanggal_lahir: donaturData.tanggal_lahir || '',
        jenis_kelamin: donaturData.jenis_kelamin || '',
        agama: donaturData.agama || '',
        status_perkawinan: donaturData.status_perkawinan || '',
        pekerjaan: donaturData.pekerjaan || '',
        kewarganegaraan: donaturData.kewarganegaraan || '',
        no_hp: donaturData.no_hp || '',
        email: donaturData.email || '',
      });
    }
  }, [data, form]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const { putDonatur, loading: updating, error: updateError } = usePutDonatur();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donaturId || !form) return;

    setSaving(true);
    setSaveError('');
    setSuccessMessage('');

    try {
      const result = await putDonatur(
        donaturId,
        form.nik,
        form.nama,
        form.alamat,
        form.tempat_lahir,
        form.tanggal_lahir,
        form.jenis_kelamin,
        form.agama,
        form.status_perkawinan,
        form.pekerjaan,
        form.kewarganegaraan,
        form.no_hp,
        form.email
      );

      if (result) {
        localStorage.setItem('donatur_user', JSON.stringify(result));
        setUser(result);
      }

      setSuccessMessage('Profil berhasil diperbarui.');
      // Setelah berhasil menyimpan, arahkan kembali ke halaman profil
      navigate('/profil');
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/profil');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mb-4" />
          <p className="text-sm text-slate-600">Silakan login terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mb-4" />
          <p className="text-sm text-slate-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali ke profil"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Profil</h1>
            <p className="mt-1 text-sm text-slate-600">Perbarui informasi pribadi Anda</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {(saveError || updateError) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{saveError || updateError}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Identitas */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">Identitas</h2>
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">NIK</label>
                  <input
                    name="nik"
                    value={form.nik}
                    onChange={handleChange}
                    placeholder="0000000000000000"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Nama Lengkap</label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Alamat Lengkap</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap Anda"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Kependudukan */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">Kependudukan</h2>
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Tempat Lahir</label>
                  <input
                    name="tempat_lahir"
                    value={form.tempat_lahir}
                    onChange={handleChange}
                    placeholder="Kota/Kabupaten"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={form.tanggal_lahir}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                  <input
                    name="jenis_kelamin"
                    value={form.jenis_kelamin}
                    onChange={handleChange}
                    placeholder="Laki-laki / Perempuan"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Kewarganegaraan</label>
                  <input
                    name="kewarganegaraan"
                    value={form.kewarganegaraan}
                    onChange={handleChange}
                    placeholder="Indonesia"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Data Pribadi */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">Data Pribadi</h2>
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Agama</label>
                  <input
                    name="agama"
                    value={form.agama}
                    onChange={handleChange}
                    placeholder="Masukkan agama"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Status Perkawinan</label>
                  <input
                    name="status_perkawinan"
                    value={form.status_perkawinan}
                    onChange={handleChange}
                    placeholder="Belum Menikah / Menikah / Lainnya"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Pekerjaan</label>
                  <input
                    name="pekerjaan"
                    value={form.pekerjaan}
                    onChange={handleChange}
                    placeholder="Masukkan pekerjaan Anda"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Kontak */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900">Kontak</h2>
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Nomor Telepon</label>
                  <input
                    name="no_hp"
                    value={form.no_hp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || updating}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
            >
              {saving || updating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilEdit;

