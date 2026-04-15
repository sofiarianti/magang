import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';
import useDeleteDonatur from '../../hooks/useDeleteDonatur';

function Profil() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('donatur_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('donatur_user');
      }
    }
  }, []);

  const donaturId = user?.id || user?.donatur?.id;

  const { data, loading, error } = useAPI(
    donaturId ? endpoints.donatur.getById(donaturId) : null
  );
  const { deleteDonatur, loading: deleting, error: deleteError } = useDeleteDonatur();

  const donatur = data?.donatur;
  const isProfileIncomplete = [
    donatur?.nama,
    donatur?.nik,
    donatur?.alamat,
    donatur?.tempat_lahir,
    donatur?.tanggal_lahir,
  ].some((value) => !String(value || '').trim());

  const initials = donatur?.nama
    ? donatur.nama
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'DT';

  const biodataItems = [
    { label: 'NIK', value: donatur?.nik },
    { label: 'Tempat Lahir', value: donatur?.tempat_lahir },
    { label: 'Tanggal Lahir', value: donatur?.tanggal_lahir },
    { label: 'Jenis Kelamin', value: donatur?.jenis_kelamin },
    { label: 'Agama', value: donatur?.agama },
    { label: 'Status Perkawinan', value: donatur?.status_perkawinan },
    { label: 'Pekerjaan', value: donatur?.pekerjaan },
    { label: 'Kewarganegaraan', value: donatur?.kewarganegaraan },
  ];

  const handleEditClick = () => {
    navigate('/profil/edit');
  };

  const handleDelete = async () => {
    if (!donaturId) return;

    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus akun donatur ini? Tindakan ini tidak dapat dibatalkan.'
    );

    if (!confirmDelete) return;

    const success = await deleteDonatur(donaturId);
    if (success) {
      localStorage.removeItem('donatur_user');
      localStorage.removeItem('donatur_credential');
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto flex max-w-md items-center justify-center rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
            <p className="text-sm font-medium text-slate-700">Silakan login terlebih dahulu.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !donatur) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto flex max-w-md items-center justify-center rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
            <p className="text-sm font-medium text-slate-700">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-white px-6 py-5 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-900 px-6 py-8 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-white/15 bg-white/10 text-2xl font-bold text-white">
                  {initials}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">
                      Profil Donatur
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                      {donatur?.nama || 'Donatur MPZ DT'}
                    </h1>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300">
                    Informasi profil ini digunakan untuk mendukung proses donasi, riwayat
                    transaksi, dan komunikasi resmi dari MPZ Daarut Tauhiid.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
                  <p className="mt-2 text-sm font-medium text-white">{donatur?.email || '-'}</p>
                </div>
                <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Telepon</p>
                  <p className="mt-2 text-sm font-medium text-white">{donatur?.no_hp || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                Data Donatur Aktif
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
                Tersinkron dengan akun
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleEditClick}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Edit Profil
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-2xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Menghapus...' : 'Hapus Akun'}
              </button>
            </div>
          </div>
        </section>

        {deleteError && (
          <div className="rounded-[28px] border border-red-200 bg-white px-5 py-4 text-sm text-red-700 shadow-sm">
            {deleteError}
          </div>
        )}

        {isProfileIncomplete && (
          <div className="flex flex-col gap-4 rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-5 text-sm text-amber-800 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-amber-900">Data diri Anda belum lengkap.</p>
              <p className="mt-1 leading-6">
                Lengkapi profil agar proses donasi, pencatatan transaksi, dan layanan akun berjalan lebih baik.
              </p>
            </div>
            <button
              type="button"
              onClick={handleEditClick}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Lengkapi Data Diri
            </button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                Biodata
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">Informasi Pribadi</h2>
              <p className="text-sm leading-7 text-slate-600">
                Pastikan identitas donatur sudah sesuai agar proses pencatatan transaksi dan
                komunikasi berjalan dengan baik.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {biodataItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-900">
                    {item.value || '-'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="border-b border-slate-200 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                  Alamat
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Domisili Donatur</h2>
              </div>

              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-5">
                <p className="text-sm leading-7 text-slate-700">
                  {donatur?.alamat || 'Belum ada alamat yang terdaftar.'}
                </p>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="border-b border-slate-200 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                  Kontak
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Informasi Akun</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    {donatur?.email || '-'}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Nomor Telepon
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    {donatur?.no_hp || '-'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-slate-900 p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                Catatan
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">Jaga data tetap akurat</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Bila ada perubahan nomor telepon, alamat, atau identitas pribadi, perbarui profil
                agar notifikasi transaksi dan proses layanan donasi tetap berjalan dengan baik.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
