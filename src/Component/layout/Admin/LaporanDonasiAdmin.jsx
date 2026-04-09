import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import usePutTransaksi from '../../hooks/useUpdateTransaksi';
import endpointsUser from '../../Services/endpointUser';
import { addNotification } from '../../Services/notifikasi';
import { exportRowsToExcel, exportRowsToPdf, isWithinDateRange } from './exportUtils';

function LaporanDonasiAdmin() {
  const { data: transaksiData, loading, error, refetch } = useAPI('/api/transaksi');
  const { data: jenisDonasiData } = useAPI(endpointsUser.jenis_donasi.getAll);
  const { putTransaksi, loading: updating, error: updateError } = usePutTransaksi();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const transaksiList = useMemo(() => {
    if (Array.isArray(transaksiData)) return transaksiData;
    if (Array.isArray(transaksiData?.transaksi)) return transaksiData.transaksi;
    if (Array.isArray(transaksiData?.data)) return transaksiData.data;
    if (Array.isArray(transaksiData?.result)) return transaksiData.result;
    return [];
  }, [transaksiData]);

  const jenisDonasiList = useMemo(() => {
    if (Array.isArray(jenisDonasiData)) return jenisDonasiData;
    if (Array.isArray(jenisDonasiData?.jenis_donasi)) return jenisDonasiData.jenis_donasi;
    if (Array.isArray(jenisDonasiData?.data)) return jenisDonasiData.data;
    if (Array.isArray(jenisDonasiData?.result)) return jenisDonasiData.result;
    return [];
  }, [jenisDonasiData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value || 0) || 0);

  const formatDate = (value) => {
    if (!value) return '-';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return String(value);

    return parsedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const sanitizeFilenamePart = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const getJenisMeta = useCallback((trx) => {
    const kodeJenis =
      trx.kode_jenis_donasi ||
      trx.jenis_donasi?.kode_jenis_donasi ||
      trx.jenisDonasi?.kode_jenis_donasi ||
      trx.jenis_donasi?.kode ||
      trx.jenisDonasi?.kode ||
      trx.kode_jenis ||
      '';

    const matchedJenis = jenisDonasiList.find((item) => {
      const itemKode =
        item.kode_jenis_donasi ||
        item.kode ||
        item.kode_jenis ||
        item.id_jenis_donasi ||
        item.id;

      return String(itemKode) === String(kodeJenis);
    });

    const namaJenis =
      matchedJenis?.nama_donasi ||
      matchedJenis?.nama ||
      matchedJenis?.nama_jenis ||
      trx.jenis_donasi?.nama_donasi ||
      trx.jenis_donasi?.nama ||
      trx.jenisDonasi?.nama_donasi ||
      trx.jenisDonasi?.nama ||
      trx.nama_jenis_donasi ||
      'Donasi Lainnya';

    return {
      kode: kodeJenis,
      nama: namaJenis,
    };
  }, [jenisDonasiList]);

  const getDonaturDisplay = (trx) => {
    const donatur = trx?.donatur || trx?.data_donatur || trx?.donatur_detail;

    if (typeof trx?.nama_donatur === 'string' && trx.nama_donatur.trim()) {
      return trx.nama_donatur;
    }

    if (donatur && typeof donatur === 'object') {
      return donatur.nama || donatur.nama_donatur || donatur.kode_donatur || donatur.email || '-';
    }

    if (typeof trx?.kode_donatur === 'string' && trx.kode_donatur.trim()) {
      return trx.kode_donatur;
    }

    if (typeof trx?.kode_donatur === 'object' && trx.kode_donatur !== null) {
      return trx.kode_donatur.nama || trx.kode_donatur.kode_donatur || '-';
    }

    return '-';
  };

  const getDetailDonasiDisplay = (trx) =>
    trx.detailDonasi?.nama_detail_donasi ||
    trx.detail_donasi?.nama_detail_donasi ||
    trx.detailDonasi?.nama ||
    trx.detail_donasi?.nama ||
    trx.nama_detail_donasi ||
    '-';

  const getMetodeDisplay = (trx) =>
    trx.detailTransaksi?.nama ||
    trx.detail_transaksi?.nama ||
    trx.metode_pembayaran ||
    trx.metode ||
    trx.jalur_pembayaran ||
    trx.nama_detail_transaksi ||
    '-';

  const getStatusDisplay = (trx) => {
    const status = (
      trx.status ||
      trx.status_transaksi ||
      trx.statusTransaksi ||
      'pending'
    )
      .toString()
      .toLowerCase();

    if (status === 'success' || status === 'verified' || status === 'diverifikasi' || status === 'berhasil') {
      return 'Sukses';
    }

    if (status === 'diproses' || status === 'processed' || status === 'processing') {
      return 'Diproses';
    }

    return 'Pending';
  };

  const getStatusBadgeClass = (statusLabel) => {
    if (statusLabel === 'Sukses') {
      return 'bg-green-100 text-green-700 border-green-200';
    }

    if (statusLabel === 'Diproses') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }

    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const filteredTransaksi = useMemo(() => {
    return transaksiList.filter((trx) => {
      const tanggal = trx.tanggal_transaksi || trx.tgl_transaksi || trx.created_at || trx.tanggal || trx.tgl;
      const jenisMeta = getJenisMeta(trx);
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const detailDonasi = getDetailDonasiDisplay(trx).toLowerCase();
      const catatan = String(trx.catatan || trx.catatan_donatur || '').toLowerCase();
      const matchesJenis =
        !normalizedQuery ||
        jenisMeta.nama.toLowerCase().includes(normalizedQuery) ||
        String(jenisMeta.kode || '').toLowerCase().includes(normalizedQuery) ||
        detailDonasi.includes(normalizedQuery) ||
        catatan.includes(normalizedQuery);

      return isWithinDateRange(tanggal, startDate, endDate) && matchesJenis;
    });
  }, [transaksiList, startDate, endDate, searchQuery, getJenisMeta]);

  const laporan = useMemo(() => {
    let totalNominal = 0;
    let totalTransaksi = 0;
    const kategoriMap = {};

    for (const trx of filteredTransaksi) {
      const nominal = Number(trx.jumlah || trx.jumlah_donasi || 0) || 0;
      const kategoriNama = getJenisMeta(trx).nama;

      totalNominal += nominal;
      totalTransaksi += 1;
      kategoriMap[kategoriNama] = (kategoriMap[kategoriNama] || 0) + nominal;
    }

    return {
      totalNominal,
      totalTransaksi,
      kategori: Object.entries(kategoriMap).sort((a, b) => b[1] - a[1]),
    };
  }, [filteredTransaksi, getJenisMeta]);

  useEffect(() => {
    if (!filteredTransaksi.length) {
      setSelectedTransactionId(null);
      setIsDetailModalOpen(false);
      return;
    }

    const selectedStillExists = filteredTransaksi.some((trx) => String(trx.id || trx.kode_transaksi || trx.kode) === String(selectedTransactionId));

    if (!selectedStillExists) {
      const firstId = filteredTransaksi[0].id || filteredTransaksi[0].kode_transaksi || filteredTransaksi[0].kode;
      setSelectedTransactionId(firstId);
      if (isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    }
  }, [filteredTransaksi, selectedTransactionId, isDetailModalOpen]);

  const selectedTransaction = useMemo(() => {
    return (
      filteredTransaksi.find((trx) => String(trx.id || trx.kode_transaksi || trx.kode) === String(selectedTransactionId)) ||
      null
    );
  }, [filteredTransaksi, selectedTransactionId]);

  const handleOpenDetail = (rowId) => {
    setSelectedTransactionId(rowId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
  };

  const handleToggleExport = () => {
    setIsExportOpen((prev) => !prev);
  };

  const handleExportAction = (type) => {
    if (type === 'excel') {
      handleExportExcel();
    }

    if (type === 'pdf') {
      handleExportPdf();
    }

    setIsExportOpen(false);
  };

  const handleConfirm = async (trx) => {
    setActionMessage('');
    const id = trx.id || trx.kode_transaksi || trx.kode;
    setActiveId(id);

    if (!id) {
      setActionMessage('Tidak dapat memperbarui transaksi: id transaksi tidak ditemukan.');
      setActiveId(null);
      return;
    }

    try {
      const response = await putTransaksi(
        id,
        trx.kode_transaksi,
        trx.kode_donatur,
        trx.kode_jenis_donasi,
        trx.kode_detail_donasi,
        trx.kode_user,
        trx.kode_himpun,
        trx.kode_detail_transaksi,
        trx.jumlah_donasi,
        'berhasil'
      );

      if (response) {
        setActionMessage('Status transaksi berhasil diubah menjadi sukses.');
        addNotification({
          title: 'Status Transaksi Dikonfirmasi',
          message: `Transaksi ${trx.kode_transaksi || id} telah dikonfirmasi admin dan status berubah menjadi berhasil.`,
          userType: 'donatur',
          audienceKey:
            (typeof trx?.kode_donatur === 'string' && trx.kode_donatur) ||
            trx?.kode_donatur?.kode_donatur ||
            trx?.donatur?.kode_donatur ||
            trx?.data_donatur?.kode_donatur ||
            null,
        });
        await refetch();
      } else {
        setActionMessage('Gagal memperbarui status transaksi. Silakan coba lagi.');
      }
    } catch (e) {
      setActionMessage('Terjadi kesalahan saat memperbarui status transaksi.');
    } finally {
      setActiveId(null);
    }
  };

  const getExportMeta = () => {
    const queryPart = sanitizeFilenamePart(searchQuery);
    const startPart = startDate || 'awal';
    const endPart = endDate || 'akhir';
    const hasDateRange = Boolean(startDate || endDate);

    const filenameParts = ['laporan-donasi'];
    const titleParts = ['Laporan Donasi'];

    if (queryPart) {
      filenameParts.push(queryPart);
      titleParts.push(`Pencarian: ${searchQuery.trim()}`);
    }

    if (hasDateRange) {
      filenameParts.push(startPart, endPart);
      titleParts.push(`Periode ${startPart} s.d. ${endPart}`);
    }

    return {
      filename: filenameParts.join('-'),
      title: titleParts.join(' - '),
    };
  };

  const handleExportExcel = () => {
    const exportMeta = getExportMeta();

    exportRowsToExcel(
      exportMeta.filename,
      exportMeta.title,
      ['Kode Transaksi', 'Donatur', 'Kategori', 'Program', 'Metode', 'Nominal', 'Tanggal', 'Status'],
      filteredTransaksi.map((trx) => [
        trx.kode_transaksi || '-',
        getDonaturDisplay(trx),
        getJenisMeta(trx).nama,
        getDetailDonasiDisplay(trx),
        getMetodeDisplay(trx),
        Number(trx.jumlah || trx.jumlah_donasi || 0) || 0,
        formatDate(trx.tanggal_transaksi || trx.tgl_transaksi || trx.created_at || trx.tanggal || trx.tgl || null),
        getStatusDisplay(trx),
      ])
    );
  };

  const handleExportPdf = () => {
    const exportMeta = getExportMeta();

    exportRowsToPdf(
      exportMeta.title,
      ['Kode Transaksi', 'Donatur', 'Kategori', 'Program', 'Metode', 'Nominal', 'Tanggal', 'Status'],
      filteredTransaksi.map((trx) => [
        trx.kode_transaksi || '-',
        getDonaturDisplay(trx),
        getJenisMeta(trx).nama,
        getDetailDonasiDisplay(trx),
        getMetodeDisplay(trx),
        formatCurrency(trx.jumlah || trx.jumlah_donasi || 0),
        formatDate(trx.tanggal_transaksi || trx.tgl_transaksi || trx.created_at || trx.tanggal || trx.tgl || null),
        getStatusDisplay(trx),
      ])
    );
  };

  if (loading) return <div className="w-full px-6 lg:px-16 py-12 text-slate-600">Memuat laporan donasi...</div>;
  if (error) return <div className="w-full px-6 lg:px-16 py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Laporan</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Laporan Donasi</h1>
          <p className="text-sm text-slate-600 mt-3">
            Filter berdasarkan jenis donasi, lihat daftar transaksi yang sesuai, lalu klik salah satu transaksi untuk membuka detail lengkapnya.
          </p>
        </div>

        {actionMessage && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            {actionMessage}
          </div>
        )}

        {updateError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {updateError}
          </div>
        )}

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Toolbar Laporan</p>
                <p className="mt-1 text-sm text-slate-500">
                  Filter periode dan pencarian transaksi dalam satu baris kerja.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
                {filteredTransaksi.length} transaksi ditemukan
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <span className="text-sm font-semibold text-slate-700">Periode:</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-slate-400">📅</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full min-w-[150px] bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>

                  <div className="px-2 text-sm font-semibold text-slate-500">s/d</div>

                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-slate-400">📅</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full min-w-[150px] bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="text-xs text-slate-400">⌕</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keyword jenis, detail donasi, atau catatan..."
                    className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="relative flex sm:justify-end">
                <button
                  type="button"
                  onClick={handleToggleExport}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  <span>🧾</span>
                  <span>Export</span>
                  <span className="text-xs">{isExportOpen ? '▴' : '▾'}</span>
                </button>

                {isExportOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleExportAction('excel')}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50"
                    >
                      <span>🧾</span>
                      <span>Export Excel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportAction('pdf')}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-rose-50"
                    >
                      <span>📄</span>
                      <span>Export PDF</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_0.9fr_1.2fr] gap-5 items-stretch">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-sky-700 p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Total Donasi</p>
            <p className="mt-4 text-3xl font-bold leading-tight">{formatCurrency(laporan.totalNominal)}</p>
            <p className="mt-3 text-sm text-blue-100">Akumulasi nominal dari seluruh transaksi yang sesuai filter.</p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-100">Jumlah Transaksi</p>
            <p className="mt-4 text-3xl font-bold leading-tight">{laporan.totalTransaksi}</p>
            <p className="mt-3 text-sm text-emerald-100">Total data transaksi yang tampil berdasarkan jenis donasi dan tanggal.</p>
          </div>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Donasi per Kategori</h2>
              <p className="text-sm text-slate-500 mt-1">Rangkuman nominal donasi untuk tiap kategori yang sedang difilter.</p>
            </div>
            <div className="p-6 space-y-4">
              {laporan.kategori.length === 0 ? <p className="text-sm text-slate-500">Belum ada data kategori.</p> : laporan.kategori.map(([nama, nominal]) => (
                <div key={nama} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{nama}</span>
                  <span className="text-sm font-semibold text-blue-900">{formatCurrency(nominal)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar Transaksi Donasi</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan {filteredTransaksi.length} transaksi{searchQuery.trim() ? ' sesuai hasil pencarian' : ''}.
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Klik salah satu transaksi untuk melihat rincian lengkap.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Kode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Donatur</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Nominal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTransaksi.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <p className="text-slate-600 font-medium">Tidak ada transaksi yang sesuai filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransaksi.map((trx, idx) => {
                      const rowId = trx.id || trx.kode_transaksi || trx.kode;
                      const isActive = String(rowId) === String(selectedTransactionId);
                      const jenisMeta = getJenisMeta(trx);
                      const statusLabel = getStatusDisplay(trx);
                      const trxStatus = (trx.status || trx.status_transaksi || trx.statusTransaksi || '').toString().toLowerCase();
                      const canAdminConfirm = trxStatus === 'diproses' || trxStatus === 'processed' || trxStatus === 'processing';

                      return (
                        <tr
                          key={rowId || idx}
                          onClick={() => handleOpenDetail(rowId)}
                          className={`cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{idx + 1}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{trx.kode_transaksi || '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{getDonaturDisplay(trx)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{jenisMeta.nama}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(trx.jumlah || trx.jumlah_donasi || 0)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(statusLabel)}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                            {canAdminConfirm ? (
                              <button
                                type="button"
                                onClick={() => handleConfirm(trx)}
                                disabled={updating && activeId === rowId}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updating && activeId === rowId ? 'Menyimpan...' : 'Konfirmasi'}
                              </button>
                            ) : trxStatus === 'pending' ? (
                              <span className="text-xs text-amber-600 font-medium">Menunggu konfirmasi donatur</span>
                            ) : (
                              <span className="text-xs text-slate-500">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {selectedTransaction && isDetailModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={handleCloseDetail}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Detail Transaksi</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedTransaction.kode_transaksi || '-'}</h2>
                <p className="text-sm text-slate-600 mt-1">{getDonaturDisplay(selectedTransaction)}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-sm text-slate-700 leading-6">
                  Detail lengkap transaksi donasi ini langsung ditampilkan setelah admin memilih salah satu data transaksi dari daftar laporan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Jenis Donasi</p>
                  <p className="text-sm font-semibold text-slate-800">{getJenisMeta(selectedTransaction).nama}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Program Donasi</p>
                  <p className="text-sm font-semibold text-slate-800">{getDetailDonasiDisplay(selectedTransaction)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Nominal</p>
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(selectedTransaction.jumlah || selectedTransaction.jumlah_donasi || 0)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Tanggal</p>
                  <p className="text-sm font-semibold text-slate-800">{formatDate(selectedTransaction.tanggal_transaksi || selectedTransaction.tgl_transaksi || selectedTransaction.created_at || selectedTransaction.tanggal || selectedTransaction.tgl)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Metode Pembayaran</p>
                  <p className="text-sm font-semibold text-slate-800">{getMetodeDisplay(selectedTransaction)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Status</p>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(getStatusDisplay(selectedTransaction))}`}>
                    {getStatusDisplay(selectedTransaction)}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Kode Donatur</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedTransaction.kode_donatur || selectedTransaction.donatur?.kode_donatur || '-'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500 mb-2">Kode Detail Transaksi</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedTransaction.kode_detail_transaksi || selectedTransaction.detail_transaksi?.kode_detail_transaksi || '-'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <p className="text-xs text-slate-500">Catatan Donatur</p>
                <p className="text-sm text-slate-700 leading-6">
                  {selectedTransaction.catatan || selectedTransaction.catatan_donatur || 'Tidak ada catatan pada transaksi ini.'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-3">Data Tambahan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Kode Jenis Donasi: </span>
                    <span className="font-medium text-slate-800">{selectedTransaction.kode_jenis_donasi || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Kode Detail Donasi: </span>
                    <span className="font-medium text-slate-800">{selectedTransaction.kode_detail_donasi || selectedTransaction.detail_donasi?.kode_detail_donasi || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Kode Himpun: </span>
                    <span className="font-medium text-slate-800">{selectedTransaction.kode_himpun || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Kode User: </span>
                    <span className="font-medium text-slate-800">{selectedTransaction.kode_user || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaporanDonasiAdmin;
