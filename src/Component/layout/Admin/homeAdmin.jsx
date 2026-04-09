import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';

function findFieldDeep(obj, fieldNames) {
  if (!obj || typeof obj !== 'object') return null;
  if (!Array.isArray(fieldNames)) fieldNames = [fieldNames];

  for (const key of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      return obj[key];
    }
  }

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const result = findFieldDeep(value, fieldNames);
      if (result) return result;
    }
  }

  return null;
}

function HomeAdmin({ admin }) {
  const displayName = findFieldDeep(admin, ['nama_user', 'nama', 'name', 'username']) || 'Admin MPZ';
  const kodeHimpun = findFieldDeep(admin, ['kode_himpun', 'kodeHimpun']) || 'Belum terdata';

  const { data: donaturData, loading: loadingDonatur } = useAPI('/api/donatur');
  const { data: transaksiData, loading: loadingTransaksi } = useAPI('/api/transaksi');
  const { data: jenisDonasiData, loading: loadingJenisDonasi } = useAPI(endpoints.jenis_donasi.getAll);

  const donaturArray = useMemo(() => {
    if (Array.isArray(donaturData)) return donaturData;
    if (Array.isArray(donaturData?.donatur)) return donaturData.donatur;
    if (Array.isArray(donaturData?.data)) return donaturData.data;
    if (Array.isArray(donaturData?.result)) return donaturData.result;
    return [];
  }, [donaturData]);

  const transaksiArray = useMemo(() => {
    if (Array.isArray(transaksiData)) return transaksiData;
    if (Array.isArray(transaksiData?.transaksi)) return transaksiData.transaksi;
    if (Array.isArray(transaksiData?.data)) return transaksiData.data;
    if (Array.isArray(transaksiData?.result)) return transaksiData.result;
    return [];
  }, [transaksiData]);

  const jenisDonasiArray = useMemo(() => {
    if (Array.isArray(jenisDonasiData)) return jenisDonasiData;
    if (Array.isArray(jenisDonasiData?.jenis_donasi)) return jenisDonasiData.jenis_donasi;
    if (Array.isArray(jenisDonasiData?.data)) return jenisDonasiData.data;
    if (Array.isArray(jenisDonasiData?.result)) return jenisDonasiData.result;
    return [];
  }, [jenisDonasiData]);

  const formatRupiah = (angka) => (
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(angka) || 0)
  );

  const formatCompactRupiah = (angka) => {
    const value = Number(angka) || 0;
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)} Rb`;
    return formatRupiah(value);
  };

  const dashboard = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    let donaturBaruBulanIni = 0;
    for (const donatur of donaturArray) {
      const createdAt = donatur.created_at || donatur.tgl_daftar || donatur.tanggal_daftar || donatur.tanggal || donatur.tgl;
      if (!createdAt) continue;
      const date = new Date(createdAt);
      if (!Number.isNaN(date.getTime()) && date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        donaturBaruBulanIni += 1;
      }
    }

    let totalDanaTerkumpul = 0;
    let totalDanaHariIni = 0;
    let totalDanaBulanIni = 0;
    let pendingCount = 0;
    let processingCount = 0;
    let successCount = 0;
    const monthlyTotals = Array(12).fill(0);
    const categoryTotals = {};
    const recentTransactions = [];

    for (const trx of transaksiArray) {
      const amount = Number(trx.jumlah || trx.jumlah_donasi || 0) || 0;
      const rawDate = trx.tanggal_transaksi || trx.tgl_transaksi || trx.created_at || trx.tanggal || trx.tgl;
      const status = (trx.status || trx.status_transaksi || trx.statusTransaksi || 'pending').toString().toLowerCase();
      const kodeJenisDonasi =
        trx.kode_jenis_donasi ||
        trx.jenis_donasi?.kode_jenis_donasi ||
        trx.jenisDonasi?.kode_jenis_donasi ||
        trx.jenis_donasi?.kode ||
        trx.jenisDonasi?.kode ||
        '';
      const matchedJenisDonasi = jenisDonasiArray.find((item) => {
        const itemKode =
          item.kode_jenis_donasi ||
          item.kode ||
          item.kodeJenisDonasi ||
          '';
        return itemKode && itemKode === kodeJenisDonasi;
      });
      const category =
        matchedJenisDonasi?.nama_donasi ||
        matchedJenisDonasi?.nama ||
        trx.jenis_donasi?.nama_donasi ||
        trx.jenisDonasi?.nama_donasi ||
        trx.nama_jenis_donasi ||
        'Donasi';
      const donaturName =
        trx.nama_donatur ||
        trx.donatur?.nama ||
        trx.kode_donatur?.nama ||
        trx.kode_donatur ||
        'Donatur';

      if (status === 'pending') pendingCount += 1;
      else if (status === 'diproses' || status === 'processed' || status === 'processing') processingCount += 1;
      else if (status === 'success' || status === 'verified' || status === 'diverifikasi' || status === 'berhasil') successCount += 1;

      if (!rawDate) continue;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) continue;

      totalDanaTerkumpul += amount;
      if (date.getFullYear() === currentYear) {
        monthlyTotals[date.getMonth()] += amount;
      }
      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        totalDanaBulanIni += amount;
      }
      if (date.getTime() >= todayStart.getTime()) {
        totalDanaHariIni += amount;
      }

      if (kodeJenisDonasi) {
        categoryTotals[kodeJenisDonasi] = (categoryTotals[kodeJenisDonasi] || 0) + amount;
      }
      recentTransactions.push({
        id: trx.id || trx.kode_transaksi || `${category}-${rawDate}`,
        kode: trx.kode_transaksi || '-',
        donatur: donaturName,
        amount,
        date,
        category,
        status,
      });
    }

    recentTransactions.sort((a, b) => b.date - a.date);

    const topCategories = jenisDonasiArray
      .map((item) => {
        const kode =
          item.kode_jenis_donasi ||
          item.kode ||
          item.kodeJenisDonasi ||
          '';
        const label =
          item.nama_donasi ||
          item.nama ||
          item.nama_jenis ||
          kode ||
          'Donasi';

        return {
          kode,
          label,
          value: categoryTotals[kode] || 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    return {
      totalDonatur: donaturArray.length,
      donaturBaruBulanIni,
      totalDanaHariIni,
      totalDanaBulanIni,
      totalDanaTerkumpul,
      pendingCount,
      processingCount,
      successCount,
      monthlyTotals,
      monthLabels,
      peakMonthlyValue: Math.max(...monthlyTotals, 1),
      recentTransactions: recentTransactions.slice(0, 3),
      topCategories,
    };
  }, [donaturArray, transaksiArray, jenisDonasiArray]);

  const isLoading = loadingDonatur || loadingTransaksi || loadingJenisDonasi;

  const summaryCards = [
    {
      label: 'Dana Terkumpul',
      value: formatCompactRupiah(dashboard.totalDanaTerkumpul),
      note: 'Akumulasi seluruh transaksi',
      icon: BanknotesIcon,
      pill: 'Total',
    },
    {
      label: 'Donasi Bulan Ini',
      value: formatRupiah(dashboard.totalDanaBulanIni),
      note: 'Pemasukan bulan berjalan',
      icon: ArrowTrendingUpIcon,
      pill: 'Bulanan',
    },
    {
      label: 'Total Donatur',
      value: `${dashboard.totalDonatur}`,
      note: `+${dashboard.donaturBaruBulanIni} baru bulan ini`,
      icon: UserGroupIcon,
      pill: 'Aktif',
    },
  ];

  const statusCards = [
    {
      label: 'Pending',
      value: dashboard.pendingCount,
      note: 'Menunggu konfirmasi donatur',
      color: 'text-slate-700',
      bg: 'bg-slate-100',
    },
    {
      label: 'Diproses',
      value: dashboard.processingCount,
      note: 'Siap diverifikasi admin',
      color: 'text-blue-800',
      bg: 'bg-blue-100',
    },
    {
      label: 'Sukses',
      value: dashboard.successCount,
      note: 'Sudah selesai diverifikasi',
      color: 'text-amber-800',
      bg: 'bg-amber-100',
    },
  ];

  const quickActions = [
    {
      label: 'Kelola Donasi',
      description: 'Pantau transaksi, lihat detail, dan verifikasi dari satu halaman.',
      to: '/laporan/donasi',
      icon: ClipboardDocumentListIcon,
    },
    {
      label: 'Laporan Donasi',
      description: 'Cek rangkuman nominal, kategori, dan metode donasi.',
      to: '/laporan/donasi',
      icon: DocumentChartBarIcon,
    },
    {
      label: 'Kelola QR Code',
      description: 'Atur QRIS aktif yang digunakan donatur saat pembayaran.',
      to: '/transaksi/qrcode',
      icon: QrCodeIcon,
    },
  ];

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentMonthName = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <p className="text-blue-900 text-sm">Memuat dashboard admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-8 lg:py-10 space-y-6">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700/80">
              MPZ DT • Dashboard Admin
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-blue-950 truncate">
              Assalamualaikum, {displayName}
            </h1>
            <p className="text-xs md:text-sm text-blue-800 truncate">
              Kelola donatur, transaksi, dan verifikasi donasi dari satu dashboard yang ringkas.
            </p>
          </div>
          <div className="bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 text-right flex-shrink-0">
            <p className="text-[11px] text-slate-400">Hari ini</p>
            <p className="text-xs font-medium text-slate-700">{todayLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1.1fr] gap-6">
          <div className="space-y-4">
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 rounded-2xl shadow-lg min-h-[280px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.24),_transparent_28%)]" />
              <div className="relative z-10 h-full flex items-center px-6 py-6 md:px-8 md:py-7 text-white">
                <div className="max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-amber-300 mb-2">
                    Pusat Kontrol Admin
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-3">
                    Pantau performa donasi dan status verifikasi dengan cepat.
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100 mb-5">
                    Kode himpun Anda: <span className="font-semibold text-white">{kodeHimpun}</span>. Fokus utama bulan ini adalah menjaga alur pending, diproses, dan sukses tetap tertata rapi.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {summaryCards.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5">
                              {item.pill}
                            </span>
                            <Icon className="w-4 h-4 text-amber-300" />
                          </div>
                          <p className="mt-3 text-[11px] text-blue-100">{item.label}</p>
                          <p className="text-base md:text-lg font-semibold text-white mt-1">
                            {item.value}
                          </p>
                          <p className="text-[10px] text-blue-200 mt-1">{item.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-blue-950">
                    Aktivitas Donasi Terbaru
                  </h3>
                  <p className="text-[11px] text-blue-700">
                    Tiga transaksi terbaru yang perlu Anda perhatikan.
                  </p>  
                </div>
                <span className="text-[11px] text-amber-600 font-medium">
                  {currentMonthName}
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {dashboard.recentTransactions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada transaksi terbaru.
                  </div>
                ) : (
                  dashboard.recentTransactions.map((trx) => {
                    const statusText = trx.status === 'success' || trx.status === 'verified' || trx.status === 'diverifikasi' || trx.status === 'berhasil'
                      ? 'Sukses'
                      : trx.status === 'diproses' || trx.status === 'processed' || trx.status === 'processing'
                        ? 'Diproses'
                        : 'Pending';

                    return (
                      <div
                        key={trx.id}
                        className="px-4 py-3 flex items-center justify-between text-xs md:text-sm hover:bg-slate-50/70"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700">
                            TR
                          </div>
                          <div>
                            <p className="font-medium text-blue-950">{trx.donatur}</p>
                            <p className="text-[11px] text-blue-700">
                              {trx.category} • {trx.date.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-950">{formatRupiah(trx.amount)}</p>
                          <p className={`text-[11px] font-medium ${
                            statusText === 'Sukses'
                              ? 'text-amber-600'
                              : statusText === 'Diproses'
                                ? 'text-blue-700'
                                : 'text-slate-500'
                          }`}>
                            {statusText}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-100">
                <h3 className="text-sm font-semibold text-blue-950">
                  Akses Cepat Admin
                </h3>
                <p className="text-[11px] text-blue-700">
                  Shortcut ke halaman yang paling sering dipakai saat operasional.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-medium text-amber-700">
                          Buka
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-blue-950">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-600">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-blue-700">Ringkasan Status</p>
                  <h3 className="text-sm font-semibold text-blue-950">
                    Progres Verifikasi
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-medium text-amber-800">
                  <ChartBarIcon className="w-3.5 h-3.5" />
                  Monitoring
                </div>
              </div>

              <div className="space-y-3">
                {statusCards.map((item) => (
                  <div key={item.label} className="rounded-xl border border-blue-100 px-3 py-3 hover:bg-blue-50/70 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-blue-950">{item.label}</p>
                        <p className="text-[11px] text-blue-700">{item.note}</p>
                      </div>
                      <span className={`inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${item.bg} ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-950">
                  Distribusi Donasi per Bulan
                </h3>
                <button className="text-[11px] text-amber-600 hover:text-amber-700 font-medium">
                  Statistik
                </button>
              </div>

              <div className="rounded-xl bg-blue-50 px-3 py-4">
                <div className="flex items-end gap-2 h-44">
                  {dashboard.monthlyTotals.map((value, index) => {
                    const height = Math.max((value / dashboard.peakMonthlyValue) * 100, value > 0 ? 8 : 0);
                    return (
                      <div key={dashboard.monthLabels[index]} className="flex-1 flex flex-col items-center justify-end gap-2">
                        <div className="w-full flex items-end h-32">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-900 to-amber-400"
                            style={{ height: `${height}%` }}
                            title={`${dashboard.monthLabels[index]}: ${formatRupiah(value)}`}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-blue-800">{dashboard.monthLabels[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-3">
              <h3 className="text-sm font-semibold text-blue-950">
                Kategori Donasi Utama
              </h3>
              <div className="space-y-3">
                {dashboard.topCategories.length === 0 ? (
                  <div className="py-6 text-center text-xs text-blue-700">
                    Belum ada data kategori donasi.
                  </div>
                ) : (
                  dashboard.topCategories.map((category) => {
                    const percentage = dashboard.totalDanaTerkumpul > 0
                      ? Math.min((category.value / dashboard.totalDanaTerkumpul) * 100, 100)
                      : 0;

                    return (
                      <div key={category.label} className="rounded-xl border border-blue-100 px-3 py-3 hover:bg-blue-50/70 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-blue-950">{category.label}</p>
                            <p className="text-[11px] text-blue-700">{formatCompactRupiah(category.value)}</p>
                          </div>
                          <span className="text-[11px] font-medium text-amber-600">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-blue-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-700 to-amber-500"
                            style={{ width: `${Math.max(percentage, 6)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
