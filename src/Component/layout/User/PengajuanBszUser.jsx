import React, { useEffect, useMemo, useState } from 'react';
import api from '../../Services/api';
import endpointsUser from '../../Services/endpointUser';
import useAPI from '../../hooks/useAPI';
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

function openPrintWindow(fileUrl) {
  const printWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
  if (!printWindow) return false;

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      // Ignore browser print restrictions and keep opened tab as fallback.
    }
  };

  printWindow.onload = triggerPrint;
  setTimeout(triggerPrint, 900);
  return true;
}

function openHtmlPrintWindow(html) {
  const printWindow = window.open('', '_blank', 'width=960,height=900,noopener,noreferrer');
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}

function PengajuanBszUser({ user }) {
  const identity = useMemo(() => getDonaturIdentity(user), [user]);
  const { data: transaksiData } = useAPI(
    identity.kode_donatur ? endpointsUser.transaksi.getByKodeDonatur(identity.kode_donatur) : null
  );

  const yearOptions = useMemo(() => getBszEligibleYears(transaksiData), [transaksiData]);
  const [selectedYear, setSelectedYear] = useState('');
  const [generatedFile, setGeneratedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSelectedYear((currentValue) => {
      if (currentValue && yearOptions.includes(currentValue)) return currentValue;
      return yearOptions[0] || '';
    });
  }, [yearOptions]);

  useEffect(() => {
    return () => {
      if (generatedFile?.url) {
        URL.revokeObjectURL(generatedFile.url);
      }
    };
  }, [generatedFile]);

  const eligibleTransactions = useMemo(
    () => getBszEligibleTransactions(transaksiData, selectedYear),
    [transaksiData, selectedYear]
  );
  const transactionCount = eligibleTransactions.length;

  const handleGenerate = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!identity.kode_donatur) {
      setErrorMessage('Kode donatur tidak ditemukan. Silakan login ulang terlebih dahulu.');
      return;
    }

    if (!selectedYear) {
      setErrorMessage('Tidak ada riwayat zakat yang bisa dibuatkan BSZ.');
      return;
    }

    if (!eligibleTransactions.length) {
      setErrorMessage(`Tidak ada transaksi zakat pada tahun ${selectedYear}.`);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await api.get(endpointsUser.laporan_bsz.generate, {
        params: {
          kode_donatur: identity.kode_donatur,
          kodeDonatur: identity.kode_donatur,
          tahun: selectedYear,
          year: selectedYear,
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
        year: selectedYear,
        transactions: eligibleTransactions,
      });

      const htmlBlob = new Blob([html], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);

      setGeneratedFile((previousFile) => {
        if (previousFile?.url && !previousFile.isRemote) {
          URL.revokeObjectURL(previousFile.url);
        }

        return {
          name: `BSZ-${selectedYear}.html`,
          url: htmlUrl,
          isRemote: false,
        };
      });

      const opened = openHtmlPrintWindow(html);
      setSuccessMessage(
        opened
          ? `BSZ tahun ${selectedYear} siap dicetak.`
          : `BSZ tahun ${selectedYear} Popup cetak diblokir browser, silakan buka file secara manual.`
      );
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Gagal generate BSZ.';

      setErrorMessage(backendMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-8 px-6 py-12 lg:px-16">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-900 px-6 py-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Layanan Donatur</p>
            <h1 className="mt-2 text-3xl font-bold lg:text-4xl">Cetak BSZ</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              BSZ hanya dibuat dari riwayat transaksi zakat. Tahun yang tampil hanya tahun yang memiliki transaksi zakat.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">Generate BSZ</p>
                <p className="mt-1 text-sm text-slate-500">
                  Donatur: <span className="font-medium text-slate-700">{identity.nama_donatur || '-'}</span>
                </p>
                <p className="text-sm text-slate-500">
                  Kode Donatur: <span className="font-medium text-slate-700">{identity.kode_donatur || '-'}</span>
                </p>
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Tahun BSZ</label>
                  <select
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                    disabled={!yearOptions.length}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {!yearOptions.length ? <option value="">Tidak ada riwayat zakat</option> : null}
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedYear || !yearOptions.length}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? 'Memproses BSZ...' : 'Generate & Cetak'}
                </button>
              </div>

              {generatedFile ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">File BSZ Terbaru</p>
                  <p className="mt-2 truncate text-sm text-slate-600">{generatedFile.name}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={generatedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Lihat File
                    </a>
                    <button
                      type="button"
                      onClick={() => openPrintWindow(generatedFile.url)}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      Cetak Ulang
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">Alur Baru BSZ</p>
                <p className="mt-1 text-sm text-slate-500">
                  BSZ sekarang khusus untuk zakat dan hanya mengambil transaksi zakat pada tahun yang dipilih.
                </p>
              </div>

              {[
                'Pilih tahun BSZ yang ingin dicetak.',
                'Sistem hanya menghitung transaksi dengan kategori zakat pada tahun tersebut.',
                'Template BSZ dibuka dan siap dicetak.',
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Ringkasan Donatur</p>
                <p className="mt-3 text-sm text-slate-700">
                  Riwayat zakat pada tahun terpilih: <span className="font-semibold text-slate-900">{transactionCount}</span>
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Tahun zakat tersedia: <span className="font-semibold text-slate-900">{yearOptions.join(', ') || '-'}</span>
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Endpoint: <span className="font-semibold text-slate-900">{endpointsUser.laporan_bsz.generate}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PengajuanBszUser;
