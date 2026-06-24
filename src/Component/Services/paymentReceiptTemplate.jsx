import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

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
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPrintableStylesHtml() {
  if (typeof document === 'undefined') return '';

  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');
}

function ReceiptDocument({ receipt }) {
  const items = Array.isArray(receipt?.items) ? receipt.items : [];

  return (
    <div className="mx-auto max-w-[760px] bg-white text-slate-900">
      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="rounded-t-[28px] bg-slate-950 px-8 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            Bukti Konfirmasi Pembayaran
          </p>
          <h1 className="mt-3 text-3xl font-bold">Struk Donasi</h1>
          <p className="mt-2 text-sm text-slate-300">
            Simpan struk ini sebagai bukti bahwa pembayaran Anda sudah dikonfirmasi ke sistem.
          </p>
        </div>

        <div className="space-y-8 px-8 py-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">No. Referensi</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{receipt.receiptNumber}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tanggal Konfirmasi</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{formatDateTime(receipt.confirmedAt)}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nama Donatur</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{receipt.donorName || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kode Donatur</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{receipt.donorCode || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Metode Pembayaran</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{receipt.paymentMethod || '-'}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kode Transaksi</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{receipt.transactionCode || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nominal</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrency(receipt.amount)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Catatan</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{receipt.note || '-'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-sm font-semibold text-slate-900">Rincian Donasi</p>
            <div className="mt-4 space-y-3">
              {items.length ? (
                items.map((item, index) => (
                  <div
                    key={`${item?.kode_transaksi || item?.nama_detail_donasi || 'item'}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {normalizeText(item?.nama_detail_donasi || item?.namaDetail || 'Donasi')}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {normalizeText(item?.nama_jenis_donasi || item?.namaJenis || '-')}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(item?.jumlah_donasi || item?.nominal || 0)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">Tidak ada rincian item.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-6 py-5 text-sm text-emerald-900">
            Bukti pembayaran Anda telah diteruskan ke sistem. Simpan halaman ini untuk arsip pribadi Anda.
          </div>
        </div>
      </div>
    </div>
  );
}

export function buildPaymentReceiptHtml(receipt) {
  const bodyMarkup = renderToStaticMarkup(<ReceiptDocument receipt={receipt} />);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Struk Donasi</title>
  ${getPrintableStylesHtml()}
  <style>
    @page { size: auto; margin: 14mm; }
    body { margin: 0; background: #f8fafc; }
  </style>
</head>
<body onload="window.print();">
  <div style="padding: 24px;">
    ${bodyMarkup}
  </div>
</body>
</html>`;
}
