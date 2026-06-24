import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePostTransaksi from '../../hooks/usePostTransaksi';
import useUpdateTransaksi from '../../hooks/useUpdateTransaksi';
import usePostKonfirmasiTransaksi from '../../hooks/usePostKonfirmasiTransaksi';
import { addNotification } from '../../Services/notifikasi';

const PAYMENT_CONFIRMATION_STORAGE_KEY = 'pending_qris_payment_confirmation';

function normalizeText(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value || 0) || 0);
}

function formatDateTime(value) {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return '-';

  return parsed.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function KonfirmasiPembayaranUser({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentContext, setPaymentContext] = useState(() => {
    const routedState = location.state?.paymentContext;
    if (routedState) {
      sessionStorage.setItem(PAYMENT_CONFIRMATION_STORAGE_KEY, JSON.stringify(routedState));
      return routedState;
    }

    const savedState = sessionStorage.getItem(PAYMENT_CONFIRMATION_STORAGE_KEY);
    if (!savedState) return null;

    try {
      return JSON.parse(savedState);
    } catch {
      sessionStorage.removeItem(PAYMENT_CONFIRMATION_STORAGE_KEY);
      return null;
    }
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  const {
    postTransaksi,
    loading: creatingTransaction,
  } = usePostTransaksi();
  const {
    putTransaksi,
    loading: updatingTransaction,
  } = useUpdateTransaksi();
  const {
    postKonfirmasiTransaksi,
    loading: creatingConfirmation,
    error: confirmationError,
  } = usePostKonfirmasiTransaksi();

  useEffect(() => {
    return () => {
      if (proofPreviewUrl) {
        URL.revokeObjectURL(proofPreviewUrl);
      }
    };
  }, [proofPreviewUrl]);

  const createdCheckout = paymentContext?.createdCheckout || null;
  const pendingQrisCheckout = paymentContext?.pendingQrisCheckout || null;
  const selectedQrCode = paymentContext?.selectedQrCode || null;
  const donorName = normalizeText(user?.donatur?.nama || user?.nama || 'Donatur');
  const donorCode = normalizeText(
    user?.donatur?.kode_donatur ||
      paymentContext?.createdCheckout?.kode_donatur ||
      paymentContext?.pendingQrisCheckout?.kodeDonatur ||
      ''
  );

  const summary = useMemo(() => {
    const checkout = createdCheckout || {};
    return {
      total: Number(checkout?.total_donasi || 0),
      items: Array.isArray(checkout?.transactions) ? checkout.transactions : [],
      paymentMethod: checkout?.metode_pembayaran || pendingQrisCheckout?.namaMetodePembayaran || 'QRIS',
      paymentLane: checkout?.jalur_pembayaran || pendingQrisCheckout?.jalurPembayaran || 'QRIS',
      paymentType: pendingQrisCheckout?.paymentType || 'qris',
      bankAccountNumber:
        checkout?.no_rek ||
        pendingQrisCheckout?.bankAccountNumber ||
        checkout?.transactions?.[0]?.no_rek ||
        '',
    };
  }, [createdCheckout, pendingQrisCheckout]);

  const loading = creatingTransaction || updatingTransaction || creatingConfirmation;

  const handleSelectProof = (event) => {
    const file = event.target.files?.[0] || null;
    setSubmitError('');
    setSubmitMessage('');

    if (proofPreviewUrl) {
      URL.revokeObjectURL(proofPreviewUrl);
      setProofPreviewUrl('');
    }

    if (!file) {
      setProofFile(null);
      return;
    }

    setProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
  };

  const buildConfirmationPayloadVariants = (transactionId) => {
    const variants = [];

    const fullPayload = new FormData();
    fullPayload.append('id_transaksi', String(transactionId || ''));
    fullPayload.append('status', 'diproses');
    fullPayload.append('foto_bukti', proofFile);
    fullPayload.append('foto_konfirmasi', proofFile);
    variants.push({
      label: 'full-payload',
      payload: fullPayload,
    });

    const buktiOnlyPayload = new FormData();
    buktiOnlyPayload.append('id_transaksi', String(transactionId || ''));
    buktiOnlyPayload.append('status', 'diproses');
    buktiOnlyPayload.append('foto_bukti', proofFile);
    variants.push({
      label: 'foto-bukti-only',
      payload: buktiOnlyPayload,
    });

    const konfirmasiOnlyPayload = new FormData();
    konfirmasiOnlyPayload.append('id_transaksi', String(transactionId || ''));
    konfirmasiOnlyPayload.append('status', 'diproses');
    konfirmasiOnlyPayload.append('foto_konfirmasi', proofFile);
    variants.push({
      label: 'foto-konfirmasi-only',
      payload: konfirmasiOnlyPayload,
    });

    const withKurbanNullPayload = new FormData();
    withKurbanNullPayload.append('id_transaksi', String(transactionId || ''));
    withKurbanNullPayload.append('id_transaksi_kurban', 'null');
    withKurbanNullPayload.append('status', 'diproses');
    withKurbanNullPayload.append('foto_bukti', proofFile);
    variants.push({
      label: 'kurban-null-string',
      payload: withKurbanNullPayload,
    });

    return variants;
  };

  const persistTransactionsFromDraft = async () => {
    if (!pendingQrisCheckout?.itemsToProcess?.length) {
      return Array.isArray(createdCheckout?.transactions) ? createdCheckout.transactions : [];
    }

    const createdTransactions = [];

    for (const item of pendingQrisCheckout.itemsToProcess) {
      const isRegisteredDonatur = pendingQrisCheckout.isRegisterFlag === 1;
      const idLembagaForTransaction = isRegisteredDonatur 
        ? (user?.donatur?.id_lembaga || user?.id_lembaga || pendingQrisCheckout.idLembaga || null) 
        : null;
      
      const transaksiResponse = await postTransaksi(
        item.kode_transaksi,
        pendingQrisCheckout.kodeDonatur,
        item.kode_jenis_donasi,
        item.kode_detail_donasi,
        pendingQrisCheckout.kodeUser,
        pendingQrisCheckout.kodeHimpun,
        pendingQrisCheckout.kodeDetailTransaksi,
        item.nominal,
        'diproses',
        pendingQrisCheckout.finalCatatanDonatur,
        pendingQrisCheckout.isRegisterFlag,
        pendingQrisCheckout.namaMetodePembayaran,
        pendingQrisCheckout.jalurPembayaran,
        idLembagaForTransaction
      );

      if (!transaksiResponse) {
        throw new Error('Gagal menyimpan transaksi pembayaran.');
      }

      const transaksiData = transaksiResponse?.transaksi || transaksiResponse;
      createdTransactions.push({
        ...item,
        ...transaksiData,
        jumlah_donasi: Number(transaksiData?.jumlah_donasi || item.nominal || 0),
        status: transaksiData?.status || transaksiData?.status_transaksi || 'diproses',
        status_transaksi: transaksiData?.status_transaksi || transaksiData?.status || 'diproses',
      });
    }

    return createdTransactions;
  };

  const ensureTransactionsAreProcessing = async (transactions) => {
    const normalizedTransactions = Array.isArray(transactions) ? transactions : [];

    for (const transaksi of normalizedTransactions) {
      const transactionId = transaksi?.id || transaksi?.id_transaksi;
      if (!transactionId) {
        throw new Error('ID transaksi tidak ditemukan.');
      }

      const currentStatus = String(
        transaksi?.status_transaksi || transaksi?.status || ''
      ).toLowerCase();

      if (currentStatus === 'diproses') {
        continue;
      }

      const updateResponse = await putTransaksi(
        transactionId,
        transaksi.kode_transaksi,
        transaksi.kode_donatur,
        transaksi.kode_jenis_donasi,
        transaksi.kode_detail_donasi,
        transaksi.kode_user,
        transaksi.kode_himpun,
        transaksi.kode_detail_transaksi,
        transaksi.jumlah_donasi,
        'diproses',
        transaksi.catatan
      );

      if (!updateResponse) {
        throw new Error('Status transaksi belum berhasil diubah menjadi diproses.');
      }
    }
  };

  const submitConfirmationWithVariants = async (transactionId) => {
    const variants = buildConfirmationPayloadVariants(transactionId);
    let lastError = null;

    for (const variant of variants) {
      try {
        console.log('Mencoba payload konfirmasi transaksi:', variant.label);
        const response = await postKonfirmasiTransaksi(variant.payload);
        return response;
      } catch (error) {
        lastError = error;
        console.warn('Payload konfirmasi transaksi gagal:', variant.label, error?.message);
      }
    }

    throw lastError || new Error('Konfirmasi pembayaran belum berhasil disimpan.');
  };

  const handleSubmitConfirmation = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitMessage('');

    if (!paymentContext) {
      setSubmitError('Data pembayaran tidak ditemukan. Silakan ulangi dari halaman transaksi.');
      return;
    }

    if (!proofFile) {
      setSubmitError('Silakan upload bukti pembayaran terlebih dahulu.');
      return;
    }

    try {
      const persistedTransactions = await persistTransactionsFromDraft();
      if (!persistedTransactions.length) {
        throw new Error('Tidak ada transaksi yang bisa dikonfirmasi.');
      }

      await ensureTransactionsAreProcessing(persistedTransactions);

      const primaryTransaction = persistedTransactions[0];
      const transactionId = primaryTransaction?.id || primaryTransaction?.id_transaksi;
      const confirmationResponse = await submitConfirmationWithVariants(transactionId);

      const confirmationData =
        confirmationResponse?.konfirmasi_transaksi ||
        confirmationResponse?.data ||
        confirmationResponse;
      const receiptNumber = `KTRX-${
        confirmationData?.id_konfirmasi_transaksi ||
        confirmationData?.id ||
        Date.now()
      }`;
      const receipt = {
        receiptNumber,
        confirmedAt:
          confirmationData?.created_at ||
          confirmationData?.updated_at ||
          primaryTransaction?.updated_at ||
          new Date().toISOString(),
        donorName,
        donorCode,
        transactionCode:
          primaryTransaction?.kode_transaksi ||
          selectedQrCode?.kode_transaksi ||
          '-',
        amount: summary.total || primaryTransaction?.jumlah_donasi || 0,
        paymentMethod: summary.paymentMethod,
        note:
          pendingQrisCheckout?.finalCatatanDonatur ||
          primaryTransaction?.catatan ||
          '',
        items: persistedTransactions,
      };

      setReceiptData(receipt);
      setPaymentContext((prev) => (
        prev
          ? {
              ...prev,
              createdCheckout: {
                ...(prev.createdCheckout || {}),
                transactions: persistedTransactions,
                total_donasi: summary.total || persistedTransactions.reduce(
                  (total, item) => total + Number(item?.jumlah_donasi || 0),
                  0
                ),
                total_item: persistedTransactions.length,
                status: 'diproses',
                kode_donatur: donorCode,
              },
            }
          : prev
      ));
      sessionStorage.removeItem(PAYMENT_CONFIRMATION_STORAGE_KEY);
      setSubmitMessage('Bukti pembayaran berhasil dikirim.');

      addNotification({
        title: 'Bukti Pembayaran Diterima',
        message: 'Pembayaran Anda sedang diverifikasi admin. Struk konfirmasi sudah tersedia.',
        userType: 'donatur',
        ...(donorCode ? { audienceKey: donorCode } : {}),
      });
    } catch (error) {
      console.error('Error submitting payment confirmation:', error);
      setSubmitError(
        error?.message ||
          'Konfirmasi pembayaran gagal diproses. Silakan coba lagi.'
      );
    }
  };

  if (!paymentContext && !receiptData) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Konfirmasi Pembayaran</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Data pembayaran tidak ditemukan</h1>
          <p className="mt-4 text-sm text-slate-600">
            Silakan ulangi proses dari halaman transaksi agar sistem memiliki data checkout yang lengkap.
          </p>
          <button
            type="button"
            onClick={() => navigate('/transaksi')}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Kembali ke transaksi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-8 py-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {summary.paymentType === 'bank' ? 'Pembayaran Transfer Bank' : 'Pembayaran QRIS'}
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Ringkasan Pembayaran</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kode Transaksi</p>
                    <p className="mt-2 text-base font-bold text-slate-900">
                      {selectedQrCode?.kode_transaksi || summary.items[0]?.kode_transaksi || '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Donasi</p>
                    <p className="mt-2 text-base font-bold text-slate-900">{formatCurrency(summary.total)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Donatur</p>
                    <p className="mt-2 text-base font-bold text-slate-900">{donorName || '-'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Metode</p>
                    <p className="mt-2 text-base font-bold text-slate-900">{summary.paymentMethod || 'QRIS'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {summary.paymentType === 'bank' ? 'Nomor Rekening Tujuan' : 'Jalur Pembayaran'}
                    </p>
                    <p className="mt-2 text-base font-bold text-slate-900">
                      {summary.paymentType === 'bank'
                        ? (summary.bankAccountNumber || '-')
                        : (summary.paymentLane || '-')}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {(summary.items || []).map((item, index) => (
                    <div
                      key={`${item?.kode_transaksi || item?.nama_detail_donasi || 'item'}-${index}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {index + 1}. {item?.nama_detail_donasi || item?.namaDetail || 'Donasi'}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {item?.nama_jenis_donasi || item?.namaJenis || '-'}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(item?.jumlah_donasi || item?.nominal || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmitConfirmation} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Upload Bukti Bayar</p>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 text-center hover:border-slate-400 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectProof}
                    className="hidden"
                  />
                  {proofPreviewUrl ? (
                    <div className="w-full">
                      <img
                        src={proofPreviewUrl}
                        alt="Preview bukti pembayaran"
                        className="max-h-[420px] w-full object-contain bg-white"
                      />
                      <div className="border-t border-slate-200 px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {proofFile?.name || 'Bukti pembayaran'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Klik area gambar untuk mengganti file.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-10">
                      <svg className="mx-auto h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-4 text-sm font-semibold text-slate-900">
                        Klik untuk memilih file bukti pembayaran
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Format gambar umum seperti JPG, JPEG, atau PNG.
                      </p>
                    </div>
                  )}
                </label>

                {(submitError || confirmationError) && (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError || confirmationError}
                  </div>
                )}

                {submitMessage && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {submitMessage}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 md:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Menyimpan konfirmasi pembayaran...' : 'Konfirmasi dan Simpan Bukti'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/transaksi')}
                    className="rounded-2xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Kembali ke transaksi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {receiptData && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-emerald-600 px-8 py-6 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">Struk Siap Disimpan</p>
                  <h2 className="mt-2 text-2xl font-bold">Bukti Konfirmasi Pembayaran</h2>
                  <p className="mt-2 text-sm text-emerald-100">
                    Screenshot struk ini bila diperlukan sebagai arsip pembayaran Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptData(null)}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                  aria-label="Tutup struk"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 px-8 py-8">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">No. Referensi</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{receiptData.receiptNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tanggal Konfirmasi</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{formatDateTime(receiptData.confirmedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Donatur</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{receiptData.donorName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kode Transaksi</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{receiptData.transactionCode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Metode Pembayaran</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{receiptData.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Donasi</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{formatCurrency(receiptData.amount)}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(receiptData.items || []).map((item, index) => (
                      <div
                        key={`${item?.kode_transaksi || item?.nama_detail_donasi || 'receipt'}-${index}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {index + 1}. {item?.nama_detail_donasi || item?.namaDetail || 'Donasi'}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {item?.nama_jenis_donasi || item?.namaJenis || '-'}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(item?.jumlah_donasi || item?.nominal || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KonfirmasiPembayaranUser;
