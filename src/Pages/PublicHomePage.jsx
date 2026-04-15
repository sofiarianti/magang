import React from 'react';
import { FiArrowRight, FiBookOpen, FiHeart, FiShield, FiTrendingUp } from 'react-icons/fi';

function PublicHomePage({ onLogin, onRegister, onGuestAccess }) {
  const highlights = [
    {
      title: 'Amanah dan Transparan',
      description: 'Pantau penyaluran dan transaksi donasi dengan alur yang lebih jelas.',
      icon: <FiShield />,
    },
    {
      title: 'Program Donasi Terarah',
      description: 'Pilih zakat, infaq/sedekah, dan wakaf sesuai niat yang ingin ditunaikan.',
      icon: <FiHeart />,
    },
    {
      title: 'Laporan Mudah Dipahami',
      description: 'Ringkasan donasi dan data penting disusun rapi untuk admin maupun donatur.',
      icon: <FiTrendingUp />,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#ffffff_45%,_#fff7ed_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-700">MPZDT</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900">Platform Donasi dan Zakat</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Registrasi
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center py-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                <FiBookOpen />
                <span>Beranda Publik</span>
              </div>

              <div className="space-y-5">
                <h2 className="max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                  Kelola zakat dan donasi dengan tampilan awal yang lebih jelas sebelum login.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                  Pengunjung bisa melihat halaman utama terlebih dahulu, lalu memilih untuk login,
                  registrasi, atau masuk sebagai tamu untuk mulai berdonasi.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onLogin}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <span>Masuk Sekarang</span>
                  <FiArrowRight />
                </button>
                <button
                  type="button"
                  onClick={onGuestAccess}
                  className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-3.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                >
                  Lanjut sebagai Tamu
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg text-blue-700">
                      {item.icon}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur md:p-8">
              <div className="rounded-[28px] bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_55%,_#f59e0b_100%)] p-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Akses Cepat
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-tight">
                  Pilih jalur masuk yang sesuai dengan kebutuhan Anda.
                </h3>
                <p className="mt-3 text-sm leading-7 text-blue-100">
                  Donatur baru bisa registrasi, pengguna lama bisa login, dan pengunjung tetap bisa
                  meninjau alur donasi lewat mode tamu.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={onLogin}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">Login Akun</p>
                    <p className="mt-1 text-sm text-slate-600">Masuk untuk melihat dashboard dan riwayat transaksi.</p>
                  </div>
                  <FiArrowRight className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={onRegister}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">Registrasi Donatur</p>
                    <p className="mt-1 text-sm text-slate-600">Buat akun baru untuk proses donasi yang lebih lengkap.</p>
                  </div>
                  <FiArrowRight className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={onGuestAccess}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">Masuk Sebagai Tamu</p>
                    <p className="mt-1 text-sm text-slate-600">Langsung menuju halaman donasi tanpa membuat akun.</p>
                  </div>
                  <FiArrowRight className="text-slate-400" />
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PublicHomePage;
