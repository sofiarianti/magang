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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Silakan login terlebih dahulu.</p>
      </div>
    );
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Memuat data profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="w-full px-6 lg:px-16 py-8 lg:py-10 space-y-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali ke profil"
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <span className="text-lg leading-none">&#8592;</span>
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-500/80">
              MPZ DT • Edit Profil
            </p>
            <h1 className="mt-1 text-xl md:text-2xl font-semibold text-slate-800">
              Ubah Data Profil
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Perbarui informasi pribadi yang terhubung dengan akun donatur
              Anda.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
            {successMessage}
          </div>
        )}

        {(saveError || updateError) && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
            {saveError || updateError}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  NIK
                </label>
                <input
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-medium text-slate-500">
                  Alamat Lengkap
                </label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Tempat Lahir
                </label>
                <input
                  name="tempat_lahir"
                  value={form.tempat_lahir}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Jenis Kelamin
                </label>
                <input
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Agama
                </label>
                <input
                  name="agama"
                  value={form.agama}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Status Perkawinan
                </label>
                <input
                  name="status_perkawinan"
                  value={form.status_perkawinan}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Pekerjaan
                </label>
                <input
                  name="pekerjaan"
                  value={form.pekerjaan}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Kewarganegaraan
                </label>
                <input
                  name="kewarganegaraan"
                  value={form.kewarganegaraan}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Nomor HP
                </label>
                <input
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving || updating}
                className="inline-flex justify-center items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {saving || updating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex justify-center items-center px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ProfilEdit;

