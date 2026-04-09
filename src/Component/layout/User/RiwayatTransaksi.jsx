import React, { useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import useUpdateTransaksi from '../../hooks/useUpdateTransaksi';
import endpoints from '../../Services/endpointUser';
import api from '../../Services/api';

function RiwayatTransaksi({ user }) {
  const kd_donatur =
    user?.donatur?.kode_donatur ||
    user?.kode_donatur ||
    user?.kode_donatur ||
    '';

  const {
    data,
    loading,
    error,
    refetch,
  } = useAPI(
    kd_donatur ? endpoints.transaksi.getByKodeDonatur(kd_donatur) : null
  );

  const { data: qrCodeData } = useAPI(endpoints.qrcode.getActive);
  const { putTransaksi, loading: loadingUpdateTransaksi } = useUpdateTransaksi();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrImageCandidates, setQrImageCandidates] = useState([]);
  const [qrImageCandidateIndex, setQrImageCandidateIndex] = useState(0);
  const [actionMessage, setActionMessage] = useState('');

  const transaksiList = useMemo(() => {
    if (Array.isArray(data?.transaksi)) return data.transaksi;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

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

  const normalizePaymentMethod = (trx) => (
    trx?.detailTransaksi?.nama ||
    trx?.detail_transaksi?.nama ||
    trx?.metode_pembayaran ||
    trx?.nama_detail_transaksi ||
    ''
  );

  const isPendingStatus = (trx) => normalizeStatus(trx).toString().toLowerCase() === 'pending';
  const isProcessingStatus = (trx) => {
    const status = normalizeStatus(trx).toString().toLowerCase();
    return status === 'diproses' || status === 'processed' || status === 'processing';
  };
  const isSuccessStatus = (trx) => {
    const status = normalizeStatus(trx).toString().toLowerCase();
    return status === 'success' || status === 'verified' || status === 'diverifikasi' || status === 'berhasil';
  };
  const isQrisTransaction = (trx) => normalizePaymentMethod(trx).toString().toLowerCase().includes('qris');

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

  const getNormalizedApiUrl = () => {
    const configuredUrl =
      api?.defaults?.baseURL ||
      process.env.REACT_APP_API_URL ||
      window.location.origin;
    return configuredUrl.replace(/\/$/, '');
  };

  const getQrImageCandidates = (imagePath) => {
    if (!imagePath) return [];

    const apiUrl = getNormalizedApiUrl();
    const apiOrigin = new URL(apiUrl, window.location.origin).origin;
    const rawPath = String(imagePath).trim();
    const cleanPath = rawPath.replace(/^\/+/, '');
    const fileName = cleanPath.split('/').pop();
    const candidates = [];

    const addCandidate = (value) => {
      if (value && !candidates.includes(value)) {
        candidates.push(value);
      }
    };

    if (/^https?:\/\//i.test(rawPath)) {
      addCandidate(rawPath);
      return candidates;
    }

    addCandidate(`${apiOrigin}/${cleanPath}`);
    addCandidate(`${apiUrl}/${cleanPath}`);

    if (cleanPath.startsWith('uploads/')) {
      addCandidate(`${apiUrl}/api/${cleanPath}`);
    }

    if (fileName) {
      addCandidate(`${apiOrigin}/uploads/qrcodes/${fileName}`);
      addCandidate(`${apiUrl}/uploads/qrcodes/${fileName}`);
      addCandidate(`${apiUrl}/api/uploads/qrcodes/${fileName}`);
    }

    return candidates;
  };

  const resolveActiveQrCode = () => {
    if (
      qrCodeData &&
      typeof qrCodeData === 'object' &&
      !Array.isArray(qrCodeData) &&
      (qrCodeData.image_qrcode || qrCodeData.image_url || qrCodeData.image || qrCodeData.url || qrCodeData.qr_image)
    ) {
      return qrCodeData;
    }

    if (
      qrCodeData?.data &&
      typeof qrCodeData.data === 'object' &&
      !Array.isArray(qrCodeData.data) &&
      (qrCodeData.data.image_qrcode || qrCodeData.data.image_url || qrCodeData.data.image || qrCodeData.data.url || qrCodeData.data.qr_image)
    ) {
      return qrCodeData.data;
    }

    if (Array.isArray(qrCodeData?.qrcode) && qrCodeData.qrcode[0]) {
      return qrCodeData.qrcode[0];
    }

    if (Array.isArray(qrCodeData?.data) && qrCodeData.data[0]) {
      return qrCodeData.data[0];
    }

    if (Array.isArray(qrCodeData) && qrCodeData[0]) {
      return qrCodeData[0];
    }

    if (qrCodeData && typeof qrCodeData === 'object' && !Array.isArray(qrCodeData)) {
      for (const key in qrCodeData) {
        let item = qrCodeData[key];
        if (Array.isArray(item)) item = item[0];
        if (
          item &&
          typeof item === 'object' &&
          (item.image_qrcode || item.image_url || item.image || item.url || item.qr_image)
        ) {
          return item;
        }
      }
    }

    return null;
  };

  const resetQrModal = () => {
    setShowQrModal(false);
    setSelectedTransaction(null);
    setSelectedQrCode(null);
    setQrImageError(false);
    setQrImageUrl('');
    setQrImageCandidates([]);
    setQrImageCandidateIndex(0);
  };

  const handleQrDisplayError = () => {
    const nextIndex = qrImageCandidateIndex + 1;
    const nextUrl = qrImageCandidates[nextIndex];

    if (nextUrl) {
      setQrImageCandidateIndex(nextIndex);
      setQrImageUrl(nextUrl);
      return;
    }

    setQrImageError(true);
  };

  const handleOpenPendingQris = (trx) => {
    setActionMessage('');

    if (!isQrisTransaction(trx) || !isPendingStatus(trx)) {
      return;
    }

    const qrCode = resolveActiveQrCode();
    const imagePath =
      qrCode?.image_qrcode ||
      qrCode?.image_url ||
      qrCode?.image ||
      qrCode?.url ||
      qrCode?.qr_image;

    if (!qrCode || !imagePath) {
      setActionMessage('QR Code aktif belum tersedia. Silakan coba lagi beberapa saat.');
      return;
    }

    const candidates = getQrImageCandidates(imagePath);

    if (!candidates.length) {
      setActionMessage('QR Code aktif tidak memiliki URL gambar yang valid.');
      return;
    }

    setSelectedTransaction(trx);
    setSelectedQrCode(qrCode);
    setQrImageCandidates(candidates);
    setQrImageCandidateIndex(0);
    setQrImageUrl(candidates[0]);
    setQrImageError(false);
    setShowQrModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedTransaction) return;

    const transactionId = selectedTransaction.id || selectedTransaction.id_transaksi;
    if (!transactionId) {
      setActionMessage('ID transaksi tidak ditemukan, jadi status belum bisa diperbarui.');
      return;
    }
    const response = await putTransaksi(
      transactionId,
      selectedTransaction.kode_transaksi,
      selectedTransaction.kode_donatur,
      selectedTransaction.kode_jenis_donasi,
      selectedTransaction.kode_detail_donasi,
      selectedTransaction.kode_user,
      selectedTransaction.kode_himpun,
      selectedTransaction.kode_detail_transaksi,
      selectedTransaction.jumlah_donasi,
      'diproses'
    );

    if (!response) {
      setActionMessage('Status pembayaran belum berhasil dikonfirmasi. Silakan coba lagi.');
      return;
    }

    resetQrModal();
    setActionMessage('Pembayaran Anda berhasil dikonfirmasi dan status transaksi berubah menjadi diproses.');
    refetch();
  };

  const totalVerified = transaksiList.filter((t) => isSuccessStatus(t)).length;

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

        {actionMessage && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4 text-sm font-medium text-blue-800">
            {actionMessage}
          </div>
        )}

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
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
            <div>
              <h2 className="text-lg font-bold text-white">
                Daftar Transaksi Donasi
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Transaksi QRIS yang masih pending bisa dilanjutkan kembali dari sini
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

                const metodePembayaran = normalizePaymentMethod(trx) || '-';
                const canReopenQris = isQrisTransaction(trx) && isPendingStatus(trx);

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

                          {canReopenQris && (
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenPendingQris(trx)}
                                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
                              >
                                Lanjutkan Pembayaran QRIS
                              </button>
                              <p className="text-xs text-slate-500">
                                QR code hanya tersedia selama status transaksi masih pending.
                              </p>
                            </div>
                          )}

                          {isQrisTransaction(trx) && isProcessingStatus(trx) && (
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

      {showQrModal && selectedTransaction && selectedQrCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 md:p-8 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Lanjutkan Pembayaran QRIS</h2>
                <p className="text-purple-100 text-sm">
                  Transaksi {selectedTransaction.kode_transaksi} masih pending dan bisa Anda lanjutkan
                </p>
              </div>
              <button
                type="button"
                onClick={resetQrModal}
                className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-2">Status saat ini</p>
                    <div className="mb-3">{getStatusBadge(normalizeStatus(selectedTransaction))}</div>
                    <p className="text-sm text-slate-700">
                      Setelah Anda klik tombol konfirmasi pembayaran, status transaksi akan berubah menjadi <strong>diproses</strong> dan QR code tidak akan ditampilkan lagi di riwayat.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <p className="text-sm font-semibold text-slate-800">Ringkasan Transaksi</p>
                    <p className="text-sm text-slate-600">Kode: {selectedTransaction.kode_transaksi}</p>
                    <p className="text-sm text-slate-600">Nominal: {formatRupiah(selectedTransaction.jumlah_donasi)}</p>
                    <p className="text-sm text-slate-600">Metode: {normalizePaymentMethod(selectedTransaction) || 'QRIS'}</p>
                  </div>

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Petunjuk</p>
                    <p className="text-sm text-slate-700">
                      Scan QR code di samping menggunakan aplikasi pembayaran Anda. Jika pembayaran sudah berhasil, klik tombol konfirmasi di bawah.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
                    {qrImageError ? (
                      <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                        <p className="text-slate-600 text-sm text-center">QR Code tidak dapat dimuat</p>
                        <p className="text-xs text-slate-500 mt-2 text-center">Silakan hubungi admin</p>
                      </div>
                    ) : qrImageUrl ? (
                      <img
                        src={qrImageUrl}
                        alt="QRIS QR Code"
                        className="w-56 h-56 object-contain"
                        onError={handleQrDisplayError}
                      />
                    ) : (
                      <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 text-center font-medium">
                    QR Code untuk transaksi pending Anda
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={loadingUpdateTransaksi}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingUpdateTransaksi ? 'Memproses konfirmasi pembayaran...' : 'Saya Sudah Melakukan Pembayaran'}
                </button>
                <button
                  type="button"
                  onClick={resetQrModal}
                  className="w-full px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Tutup dan Lanjutkan Nanti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiwayatTransaksi;
