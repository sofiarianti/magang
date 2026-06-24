import React, { useEffect, useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';
import api from '../../Services/api';
import {
  buildBszPrintHtml,
  getBszEligibleTransactions,
  getBszEligibleYears,
} from '../../Services/bszPrintTemplate';

function getDonaturIdentity(user) {
  return {
    kode_donatur: String(user?.donatur?.kode_donatur || user?.kode_donatur || '').trim(),
    nama_donatur: String(user?.donatur?.nama || user?.nama || '').trim(),
    email_donatur: String(user?.donatur?.email || user?.email || '').trim(),
    alamat_donatur: String(user?.donatur?.alamat || user?.alamat || '').trim(),
    no_hp_donatur: String(user?.donatur?.no_hp || user?.no_hp || user?.donatur?.nomor_hp || '').trim(),
  };
}

async function parseBlobResponse(blob) {
  const mimeType = String(blob?.type || '').toLowerCase();

  if (mimeType.includes('application/json') || mimeType.includes('text/json')) {
    const text = await blob.text();
    return JSON.parse(text);
  }

  return null;
}

function readBlobAsText(blob) {
  return blob.text();
}

function openPendingPrintWindow() {
  const printWindow = window.open('', '_blank', 'width=960,height=900');
  if (!printWindow) return null;

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>Menyiapkan BSZ</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <p>Menyiapkan BSZ untuk dicetak...</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  return printWindow;
}

function writeHtmlToPrintWindow(printWindow, html) {
  if (!printWindow || printWindow.closed) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}

function RiwayatTransaksi({ user }) {
  const identity = useMemo(() => getDonaturIdentity(user), [user]);
  const kd_donatur =
    user?.donatur?.kode_donatur ||
    user?.kode_donatur ||
    user?.kode_donatur ||
    '';

  const {
    data,
    loading,
    error,
  } = useAPI(
    kd_donatur ? endpoints.transaksi.getByKodeDonatur(kd_donatur) : null
  );
  const { data: himpunData } = useAPI(endpoints.himpun.getAll);
  const { data: detailHimpunData } = useAPI(endpoints.detail_himpun.getAll);

  const [selectedBszYear, setSelectedBszYear] = useState('');
  const [generatedBszFile, setGeneratedBszFile] = useState(null);
  const [bszMessage, setBszMessage] = useState('');
  const [bszError, setBszError] = useState('');
  const [isGeneratingBsz, setIsGeneratingBsz] = useState(false);

  const transaksiList = useMemo(() => {
    if (Array.isArray(data?.transaksi)) return data.transaksi;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const himpunList = useMemo(() => {
    if (Array.isArray(himpunData?.himpun)) return himpunData.himpun;
    if (Array.isArray(himpunData)) return himpunData;
    if (Array.isArray(himpunData?.data)) return himpunData.data;
    if (himpunData && typeof himpunData === 'object' && !Array.isArray(himpunData)) {
      return Object.values(himpunData);
    }
    return [];
  }, [himpunData]);

  const detailHimpunList = useMemo(() => {
    if (Array.isArray(detailHimpunData?.detail_himpun)) return detailHimpunData.detail_himpun;
    if (Array.isArray(detailHimpunData)) return detailHimpunData;
    if (Array.isArray(detailHimpunData?.data)) return detailHimpunData.data;
    if (Array.isArray(detailHimpunData?.result)) return detailHimpunData.result;
    return [];
  }, [detailHimpunData]);

  const formatRupiah = (nominal) => {
    if (nominal == null || nominal === '') return '-';
    const num = Number(nominal);
    if (isNaN(num)) return String(nominal);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    try {
      const d = new Date(tanggal);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(tanggal);
    }
  };

  const normalizeStatus = (trx) => (
    trx?.status || trx?.status_transaksi || trx?.statusTransaksi || 'pending'
  );

  const normalizeInlineText = (value) =>
    String(value || '')
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const normalizePaymentMethod = (trx) => (
    trx?.metode_pembayaran ||
    trx?.detailTransaksi?.nama ||
    trx?.detail_transaksi?.nama ||
    trx?.nama_detail_transaksi ||
    ''
  );

  const getHimpunCode = (item) =>
    String(
      item?.kode_himpun ||
      item?.kode ||
      item?.kode_himpun_id ||
      item?.himpun?.kode_himpun ||
      ''
    ).trim();

  const getHimpunName = (item) =>
    normalizeInlineText(
      item?.nama_himpun ||
      item?.nama ||
      item?.himpun?.nama_himpun ||
      item?.himpun?.nama ||
      ''
    );

  const getDetailHimpunCode = (item) =>
    String(
      item?.kode_detail_himpun ||
      item?.kode_detail_himpun_himpun ||
      item?.kode_detail_transaksi ||
      item?.kode ||
      item?.kode_detail ||
      item?.id ||
      ''
    ).trim();

  const getDetailHimpunName = (item) =>
    normalizeInlineText(item?.nama || item?.nama_detail_himpun || '');

  const resolvePaymentMethodLabel = (trx) => {
    const fallbackLabel = normalizeInlineText(normalizePaymentMethod(trx));
    const fallbackLower = fallbackLabel.toLowerCase();
    const kodeHimpun = String(trx?.kode_himpun || '').trim();
    const kodeDetailHimpun = String(
      trx?.kode_detail_transaksi ||
      trx?.kode_detail_himpun ||
      ''
    ).trim();

    const himpunItem =
      himpunList.find((item) => getHimpunCode(item) === kodeHimpun) || null;
    const himpunName = getHimpunName(himpunItem);
    const himpunLower = himpunName.toLowerCase();
    const isQris =
      himpunLower === 'qris' ||
      fallbackLower === 'qris' ||
      fallbackLower.includes('qris');

    if (isQris) {
      return 'QRIS';
    }

    const detailHimpunItem =
      detailHimpunList.find((item) => getDetailHimpunCode(item) === kodeDetailHimpun) || null;
    const detailHimpunName = getDetailHimpunName(detailHimpunItem);

    if (himpunName && detailHimpunName) {
      return `${himpunName} - ${detailHimpunName}`;
    }

    if (himpunName) {
      return himpunName;
    }

    return fallbackLabel || '-';
  };

  const isProcessingStatus = (trx) => {
    const status = normalizeStatus(trx).toString().toLowerCase();
    return status === 'diproses' || status === 'processed' || status === 'processing';
  };
  const isSuccessStatus = (trx) => {
    const status = normalizeStatus(trx).toString().toLowerCase();
    return status === 'success' || status === 'verified' || status === 'diverifikasi' || status === 'berhasil';
  };
  const getStatusBadge = (status) => {
    const s = (status || 'pending').toString().toLowerCase();

    if (s === 'success' || s === 'verified' || s === 'diverifikasi' || s === 'berhasil') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Sukses
        </span>
      );
    }

    if (s === 'diproses' || s === 'processed' || s === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Diproses
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
        Pending
      </span>
    );
  };

  const totalVerified = transaksiList.filter((t) => isSuccessStatus(t)).length;
  const bszYears = useMemo(() => getBszEligibleYears(transaksiList), [transaksiList]);
  const eligibleBszTransactions = useMemo(
    () => getBszEligibleTransactions(transaksiList, selectedBszYear),
    [transaksiList, selectedBszYear]
  );

  useEffect(() => {
    setSelectedBszYear((currentValue) => {
      if (currentValue && bszYears.includes(currentValue)) return currentValue;
      return bszYears[0] || '';
    });
  }, [bszYears]);

  useEffect(() => {
    return () => {
      if (generatedBszFile?.url) {
        URL.revokeObjectURL(generatedBszFile.url);
      }
    };
  }, [generatedBszFile]);

  const handleGenerateBsz = async () => {
    setBszMessage('');
    setBszError('');

    if (!identity.kode_donatur) {
      setBszError('Kode donatur tidak ditemukan. Silakan login ulang terlebih dahulu.');
      return;
    }

    if (!selectedBszYear) {
      setBszError('Tidak ada riwayat zakat yang bisa dibuatkan BSZ.');
      return;
    }

    if (!eligibleBszTransactions.length) {
      setBszError(`Tidak ada transaksi zakat pada tahun ${selectedBszYear}.`);
      return;
    }

    const printWindow = openPendingPrintWindow();
    if (!printWindow) {
      setBszError('Popup cetak diblokir browser. Izinkan pop-up untuk situs ini lalu coba lagi.');
      return;
    }

    setIsGeneratingBsz(true);

    try {
      const response = await api.get(endpoints.laporan_bsz.generate, {
        params: {
          kode_donatur: identity.kode_donatur,
          kodeDonatur: identity.kode_donatur,
          tahun: selectedBszYear,
          year: selectedBszYear,
        },
        responseType: 'blob',
      });

      const jsonPayload = await parseBlobResponse(response.data);
      const responseMimeType = String(response.data?.type || '').toLowerCase();
      const htmlFromBackend =
        responseMimeType.includes('text/html') ? await readBlobAsText(response.data) : '';

      const html = htmlFromBackend || buildBszPrintHtml({
        apiPayload: jsonPayload || {},
        identity,
        year: selectedBszYear,
        transactions: eligibleBszTransactions,
      });

      const htmlBlob = new Blob([html], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);

      setGeneratedBszFile((previousFile) => {
        if (previousFile?.url) {
          URL.revokeObjectURL(previousFile.url);
        }

        return {
          name: `BSZ-${selectedBszYear}.html`,
          url: htmlUrl,
        };
      });

      const opened = writeHtmlToPrintWindow(printWindow, html);
      setBszMessage(
        opened
          ? `BSZ tahun ${selectedBszYear} berhasil digenerate dan siap dicetak.`
          : `BSZ tahun ${selectedBszYear} berhasil digenerate. Popup cetak diblokir browser, silakan buka file secara manual.`
      );
    } catch (error) {
      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Gagal generate BSZ.';

      setBszError(backendMessage);
    } finally {
      setIsGeneratingBsz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Memuat riwayat transaksi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!kd_donatur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Silakan login untuk melihat riwayat transaksi.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main className="w-full px-6 lg:px-16 py-12 space-y-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-blue-900/70">
            Zakat & Donasi • Riwayat Lengkap
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
            Riwayat Transaksi Donasi
          </h1>
          <p className="text-slate-600">
            Kelola dan pantau semua donasi yang telah Anda lakukan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-all">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Total Transaksi</p>
            <p className="text-3xl font-bold text-slate-800">{transaksiList.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-all">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Total Donasi</p>
            <p className="text-3xl font-bold text-green-700">
              {formatRupiah(transaksiList.reduce((sum, trx) => sum + (Number(trx.jumlah_donasi) || 0), 0))}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-all">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Status Verifikasi</p>
            <p className="text-3xl font-bold text-amber-700">{totalVerified}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-white">Cetak BSZ</h2>
              <p className="text-sm text-slate-200 mt-1">
                BSZ hanya tersedia untuk transaksi zakat yang sukses pada tahun yang dipilih.
              </p>
            </div>
            <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm border border-white/30">
              {bszYears.length} tahun zakat
            </span>
          </div>

          <div className="px-8 py-6 space-y-5">
            {bszError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {bszError}
              </div>
            ) : null}

            {bszMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                {bszMessage}
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Tahun Zakat</label>
                <select
                  value={selectedBszYear}
                  onChange={(event) => setSelectedBszYear(event.target.value)}
                  disabled={!bszYears.length}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {!bszYears.length ? <option value="">Tidak ada riwayat zakat</option> : null}
                  {bszYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateBsz}
                disabled={isGeneratingBsz || !selectedBszYear || !bszYears.length}
                className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGeneratingBsz ? 'Memproses BSZ...' : 'Cetak BSZ'}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              <p>
                Riwayat zakat tahun terpilih: <span className="font-semibold text-slate-900">{eligibleBszTransactions.length}</span>
              </p>
              <p className="mt-1">
                Kode Donatur: <span className="font-semibold text-slate-900">{identity.kode_donatur || '-'}</span>
              </p>
            </div>

            {generatedBszFile ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">File BSZ Terbaru</p>
                <p className="mt-2 truncate text-sm text-slate-600">{generatedBszFile.name}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={generatedBszFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Lihat File
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
            <div>
              <h2 className="text-lg font-bold text-white">
                Daftar Transaksi Donasi
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Pantau status seluruh transaksi donasi Anda dari sini
              </p>
            </div>
            <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm border border-white/30">
              {transaksiList.length} donasi
            </span>
          </div>

          {transaksiList.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4 opacity-50">🕌</div>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Belum ada riwayat transaksi
              </p>
              <p className="text-slate-500">
                Donasi yang Anda lakukan akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transaksiList.map((trx, idx) => {
                const jenisDonasi =
                  trx.jenisDonasi?.nama_donasi ||
                  trx.jenis_donasi?.nama_donasi ||
                  trx.jenisDonasi?.nama ||
                  trx.nama_jenis_donasi ||
                  '-';

                const detailDonasi =
                  trx.detailDonasi?.nama_detail_donasi ||
                  trx.detail_donasi?.nama_detail_donasi ||
                  trx.detailDonasi?.nama ||
                  trx.nama_detail_donasi ||
                  '-';

                const metodePembayaran = resolvePaymentMethodLabel(trx);

                return (
                  <div
                    key={trx.id || trx.kode_transaksi || idx}
                    className="px-8 py-6 hover:bg-blue-50/40 transition-colors duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 text-2xl border border-blue-200">
                            💰
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="font-mono text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                              {trx.kode_transaksi || 'N/A'}
                            </span>
                            {getStatusBadge(normalizeStatus(trx))}
                            <span className="text-xs text-slate-500">
                              {formatTanggal(trx.tanggal || trx.created_at)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Jenis Donasi
                              </p>
                              <p className="font-medium text-slate-800">
                                {jenisDonasi}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Detail Donasi
                              </p>
                              <p className="font-medium text-slate-800 truncate">
                                {detailDonasi}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                Metode Pembayaran
                              </p>
                              <p className="font-medium text-slate-800">
                                {metodePembayaran}
                              </p>
                            </div>
                          </div>

                          {resolvePaymentMethodLabel(trx).toString().toLowerCase() === 'qris' && isProcessingStatus(trx) && (
                            <p className="mt-4 text-xs text-blue-600 font-medium">
                              Pembayaran QRIS sudah dikonfirmasi oleh Anda dan sedang diverifikasi admin.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="lg:text-right lg:min-w-max">
                        <p className="text-2xl lg:text-3xl font-bold text-blue-900 mb-1">
                          {formatRupiah(trx.jumlah_donasi)}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Jumlah Donasi
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RiwayatTransaksi;
