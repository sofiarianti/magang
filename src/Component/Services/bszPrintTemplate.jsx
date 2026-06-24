import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const BSZ_CATEGORY_ORDER = [
  { key: 'emas_perak_uang', label: '1. Emas, Perak dan Uang' },
  { key: 'perdagangan', label: '2. Perdagangan dan Perusahaan*' },
  { key: 'pertanian', label: '3. Hasil Pertanian, Perkebunan dan Perikanan*' },
  { key: 'pertambangan', label: '4. Hasil Pertambangan*' },
  { key: 'peternakan', label: '5. Hasil Peternakan*' },
  { key: 'pendapatan_jasa', label: '6. Hasil Pendapatan dan Jasa*' },
  { key: 'rikaz', label: '7. Rikaz' },
  { key: 'fitrah', label: '8. Fitrah' },
];

const SUCCESS_STATUSES = ['success', 'verified', 'diverifikasi', 'berhasil'];

function normalizeDonationLabel(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/infak/g, 'infaq')
    .replace(/[^\w\s/.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatNumberId(value) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0) || 0);
}

function formatRupiah(value) {
  return `Rp. ${formatNumberId(value)}`;
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLongDate(value) {
  const date = parseDate(value) || new Date();
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toSentenceCase(value) {
  const text = normalizeText(value);
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function numberToWordsId(value) {
  const number = Math.floor(Math.abs(Number(value || 0)));
  const words = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

  const toWords = (n) => {
    if (n < 12) return words[n];
    if (n < 20) return `${toWords(n - 10)} belas`;
    if (n < 100) return `${toWords(Math.floor(n / 10))} puluh ${toWords(n % 10)}`.trim();
    if (n < 200) return `seratus ${toWords(n - 100)}`.trim();
    if (n < 1000) return `${toWords(Math.floor(n / 100))} ratus ${toWords(n % 100)}`.trim();
    if (n < 2000) return `seribu ${toWords(n - 1000)}`.trim();
    if (n < 1000000) return `${toWords(Math.floor(n / 1000))} ribu ${toWords(n % 1000)}`.trim();
    if (n < 1000000000) return `${toWords(Math.floor(n / 1000000))} juta ${toWords(n % 1000000)}`.trim();
    if (n < 1000000000000) return `${toWords(Math.floor(n / 1000000000))} miliar ${toWords(n % 1000000000)}`.trim();
    return `${toWords(Math.floor(n / 1000000000000))} triliun ${toWords(n % 1000000000000)}`.trim();
  };

  if (!number) return 'nol rupiah';
  return `${toWords(number).replace(/\s+/g, ' ').trim()} rupiah`;
}

function getNestedValue(source, paths) {
  for (const path of paths) {
    const value = path.split('.').reduce((result, key) => result?.[key], source);
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
}

function normalizeTransactions(transaksiData) {
  if (Array.isArray(transaksiData?.transaksi)) return transaksiData.transaksi;
  if (Array.isArray(transaksiData?.data)) return transaksiData.data;
  if (Array.isArray(transaksiData)) return transaksiData;
  return [];
}

function getTransactionLabel(item) {
  return normalizeText(
    item?.nama_detail_donasi ||
      item?.detailDonasi?.nama_detail_donasi ||
      item?.detailDonasi?.nama ||
      item?.detail_donasi?.nama_detail_donasi ||
      item?.detail_donasi?.nama ||
      item?.nama_donasi ||
      item?.jenisDonasi?.nama_donasi ||
      item?.jenis_donasi?.nama_donasi ||
      item?.jenis_donasi ||
      item?.detail_donasi ||
      item?.catatan
  ).toLowerCase();
}

function getJenisDonasiLabel(item) {
  return normalizeDonationLabel(
    item?.nama_jenis_donasi ||
      item?.jenisDonasi?.nama_donasi ||
      item?.jenisDonasi?.nama ||
      item?.jenis_donasi?.nama_donasi ||
      item?.jenis_donasi?.nama ||
      item?.nama_donasi ||
      item?.kategori_donasi ||
      item?.kategori
  );
}

function getDetailJenisDonasiLabel(item) {
  return normalizeDonationLabel(
    item?.detailDonasi?.jenis_donasi?.nama_donasi ||
      item?.detailDonasi?.jenis_donasi?.nama ||
      item?.detailDonasi?.jenisDonasi?.nama_donasi ||
      item?.detailDonasi?.jenisDonasi?.nama ||
      item?.detail_donasi?.jenis_donasi?.nama_donasi ||
      item?.detail_donasi?.jenis_donasi?.nama ||
      item?.detail_donasi?.jenisDonasi?.nama_donasi ||
      item?.detail_donasi?.jenisDonasi?.nama ||
      item?.detail_donasi?.kategori ||
      item?.detailDonasi?.kategori
  );
}

function isZakatTransaction(item) {
  const jenisLabel = getJenisDonasiLabel(item);
  const detailJenisLabel = getDetailJenisDonasiLabel(item);
  const kodeJenis = normalizeDonationLabel(
    item?.kode_jenis_donasi ||
      item?.kodeJenisDonasi ||
      item?.jenis_donasi?.kode_jenis_donasi ||
      item?.jenisDonasi?.kode_jenis_donasi ||
      item?.jenis_donasi?.kode ||
      item?.jenisDonasi?.kode ||
      item?.kode_jenis
  );

  return (
    jenisLabel === 'zakat' ||
    jenisLabel.includes('zakat') ||
    detailJenisLabel === 'zakat' ||
    detailJenisLabel.includes('zakat') ||
    kodeJenis.includes('zakat')
  );
}

function resolveCategoryKey(item) {
  const label = getTransactionLabel(item);

  if (label.includes('fitrah')) return 'fitrah';
  if (label.includes('rikaz')) return 'rikaz';
  if (label.includes('ternak')) return 'peternakan';
  if (label.includes('tambang')) return 'pertambangan';
  if (label.includes('tani') || label.includes('kebun') || label.includes('ikan') || label.includes('pertanian')) {
    return 'pertanian';
  }
  if (label.includes('dagang') || label.includes('perusahaan') || label.includes('niaga')) {
    return 'perdagangan';
  }
  if (label.includes('emas') || label.includes('perak') || label.includes('uang')) {
    return 'emas_perak_uang';
  }
  if (
    label.includes('profesi') ||
    label.includes('pendapatan') ||
    label.includes('jasa') ||
    label.includes('penghasilan') ||
    label.includes('maal') ||
    label.includes('mal')
  ) {
    return 'pendapatan_jasa';
  }

  return 'pendapatan_jasa';
}

function getTransactionAmount(item) {
  const amount = Number(item?.jumlah_donasi || item?.jumlah || item?.nominal || item?.nominal_setor || item?.total || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function isSuccessfulTransaction(item) {
  const status = normalizeText(item?.status || item?.status_transaksi || '').toLowerCase();
  if (!status) return true;
  return SUCCESS_STATUSES.includes(status);
}

function matchesYear(item, year) {
  const sourceDate = item?.tanggal || item?.created_at || item?.createdAt || item?.updated_at || item?.updatedAt;
  const parsed = parseDate(sourceDate);
  if (!parsed) return false;
  return String(parsed.getFullYear()) === String(year);
}

function aggregateCategories(items, year) {
  const totals = BSZ_CATEGORY_ORDER.reduce((result, item) => {
    result[item.key] = 0;
    return result;
  }, {});

  items
    .filter((item) => isZakatTransaction(item) && matchesYear(item, year) && isSuccessfulTransaction(item))
    .forEach((item) => {
      const key = resolveCategoryKey(item);
      totals[key] += getTransactionAmount(item);
    });

  return totals;
}

function resolveTemplateData({ apiPayload, identity, year, transactions }) {
  const payload = apiPayload?.data || apiPayload?.result || apiPayload?.payload || apiPayload || {};
  const donor = payload?.donatur || payload?.data_donatur || payload?.donor || payload;
  const payloadTransactions = normalizeTransactions(
    payload?.transaksi || payload?.transactions || payload?.riwayat_transaksi || transactions
  ).filter(isZakatTransaction);
  const categoryTotals = aggregateCategories(payloadTransactions, year);
  const total = Object.values(categoryTotals).reduce((sum, item) => sum + item, 0);
  const printDate =
    getNestedValue(payload, ['tanggal_cetak', 'print_date', 'tanggal_terbit', 'created_at']) || new Date().toISOString();

  return {
    serialNumber: normalizeText(getNestedValue(payload, ['seri_aa', 'no_seri', 'serial_number'])),
    receiptNumber:
      normalizeText(getNestedValue(payload, ['nomor_bsz', 'nomor', 'receipt_number'])) ||
      `${year}${String(identity.kode_donatur || '0000').replace(/\D/g, '').slice(-8).padStart(8, '0')}`,
    year: String(year),
    donorCode: normalizeText(getNestedValue(donor, ['kode_donatur', 'kodeDonatur', 'kode']) || identity.kode_donatur),
    donorName: normalizeText(getNestedValue(donor, ['nama', 'nama_donatur', 'nama_lengkap', 'name']) || identity.nama_donatur),
    email: normalizeText(getNestedValue(donor, ['email', 'email_donatur']) || identity.email_donatur),
    npwp: normalizeText(getNestedValue(donor, ['npwp'])),
    address: normalizeText(getNestedValue(donor, ['alamat', 'alamat_donatur']) || identity.alamat_donatur),
    phone: normalizeText(getNestedValue(donor, ['no_hp', 'nomor_hp', 'telepon', 'phone']) || identity.no_hp_donatur),
    city: normalizeText(getNestedValue(payload, ['kota_cetak', 'kota', 'city'])) || 'Bandung',
    signatoryName:
      normalizeText(getNestedValue(payload, ['nama_petugas', 'signatory_name', 'petugas_penerima'])) || 'Jajang Nurjaman, S.E.',
    signatoryTitle:
      normalizeText(getNestedValue(payload, ['jabatan_petugas', 'signatory_title'])) || 'Diterima Oleh LAZ DT PEDULI',
    printDate,
    categories: categoryTotals,
    total,
  };
}

function getPrintableStylesHtml() {
  if (typeof document === 'undefined') return '';

  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');
}

function BszPrintDocument({ template, printDateLabel, terbilang }) {
  const depagLogoUrl = `${window.location.origin}/bsz-assets/depag.jpg`;
  const dtPeduliLogoUrl = `${window.location.origin}/bsz-assets/logo_dpudt.png`;
  const signImageUrl = `${window.location.origin}/bsz-assets/dpudt8790.png`;

  return (
    <div className="mx-auto w-[675px] bg-white px-0 py-0 text-[11px] leading-[1.22] text-[#333333]">
      <div className="px-1 text-center font-bold">
        *Semoga Allah SWT, Membalas apa saja yang telah kamu keluarkan dan Allah SWT memberikan berkah pada harta yang masih tersisa.
      </div>

      <div className="mt-1 grid grid-cols-[94px_1fr] px-1">
        <div>No.SERI AA {template.serialNumber}</div>
        <div className="text-right">&nbsp;</div>
      </div>

      <div className="mt-1 px-0.5">
        <div className="border border-black">
          <div className="grid grid-cols-[179px_1fr_150px] border-b border-black">
            <div className="border-r border-black p-[5px]">
              <div className="flex items-center gap-2">
                <img src={depagLogoUrl} alt="Kementerian Agama RI" className="h-[63px] w-[62px] object-contain" />
                <div className="whitespace-nowrap">
                  Kementrian Agama RI
                  <br />
                  Direktorat Jenderal
                  <br />
                  Bimas Islam dan
                  <br />
                  Penyelenggaraan Haji
                </div>
              </div>
            </div>

            <div className="border-r border-black p-[5px] text-center align-top">
              <div className="text-[24px] underline">Bukti Setor Zakat</div>
              <div className="mt-1">
                Nomor : {template.receiptNumber}
                <br />
                <br />
                <br />
                <span className="text-[16px]">Tahun {template.year}</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-[5px] text-center">
              <img src={dtPeduliLogoUrl} alt="DT Peduli" className="h-[63px] object-contain" />
            </div>
          </div>

          <div className="border-b border-black px-[10px] py-[8px] text-center">
            <div className="text-[16px] font-bold">LEMBAGA AMIL ZAKAT NASIONAL</div>
            <div className="text-[16px]">Yayasan Daarut Tauhiid Peduli (LAZ DT PEDULI)</div>
            <div className="h-4" />

            <div className="space-y-0.5 text-left">
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>Alamat / Telepon</div>
                <div>:</div>
                <div>Jl Gegerkalong Girang No. 32 40154 / 6281317121712</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>E-mail</div>
                <div>:</div>
                <div>info@dtpeduli.org</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>No. / Tgl. Pengukuhan</div>
                <div>:</div>
                <div>SK Kementerian Agama No. 1200 Tahun 2022, pada tanggal 3 November 2022</div>
              </div>
            </div>
          </div>

          <div className="border-b border-black p-[5px]">
            <div className="space-y-0.5">
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>Telah terima dari</div>
                <div>:</div>
                <div>{template.donorName}</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>ID Donatur</div>
                <div>:</div>
                <div>{template.donorCode}</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>NPWP</div>
                <div>:</div>
                <div>{template.npwp}</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr]">
                <div>Alamat</div>
                <div>:</div>
                <div>{template.address}</div>
              </div>
              <div className="grid grid-cols-[21%_2%_1fr_14%_2%]">
                <div>Telepon</div>
                <div>:</div>
                <div>{template.phone}</div>
                <div>:</div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black px-2 py-1 text-center font-normal" colSpan={4}>
                  Objek Zakat
                </th>
                <th className="w-[150px] px-2 py-1 text-center font-normal">Jumlah Zakat</th>
              </tr>
            </thead>
            <tbody>
              {BSZ_CATEGORY_ORDER.map((item) => (
                <tr key={item.key} className="border-b border-black last:border-b-0">
                  <td className="border-r border-black px-2 py-1" colSpan={4}>
                    {item.label}
                  </td>
                  <td className="px-2 py-1 text-right">{formatNumberId(template.categories[item.key])}</td>
                </tr>
              ))}
              <tr className="border-b border-black">
                <td className="border-r border-black px-2 py-1 text-right" colSpan={4}>
                  Total
                </td>
                <td className="px-2 py-1 text-right">{formatRupiah(template.total)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-2 py-1" colSpan={5}>
                  Terbilang : <em>{terbilang}</em>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-[5px]">
            <div className="grid grid-cols-2">
              <div className="text-center">
                {template.signatoryTitle}
                <br />
                {template.city} Tanggal {printDateLabel}
                <div className="flex h-[100px] items-end justify-center">
                  <img src={signImageUrl} alt="Tanda tangan Jajang Nurjaman" className="h-[100px] w-[130px] object-contain" />
                </div>
                {template.signatoryName}
              </div>
              <div className="text-center">
                Penyetor / Wajib Zakat
                <br />
                {template.city} , Tanggal {printDateLabel}
                <div className="h-[100px]" />
                {template.donorName}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 space-y-1 text-[10px]">
          <div className="grid grid-cols-[10px_1fr]">
            <div>*</div>
            <div className="text-justify">
              Dapat diperhitungkan sebagai Pengurang Penghasilan Kena Pajak. Pajak Penghasilan sesuai kadar yang berlaku
              (pasal 9 ayat (1) huruf g, Undang-Undang Nomor 7 Tahun 1983 tentang Pajak Penghasilan sebagaimana telah
              beberapa kali diubah, terakhir dengan Undang-Undang Nomor 36 Tahun 2008)
            </div>
          </div>
          <div className="grid grid-cols-[10px_1fr]">
            <div>**</div>
            <div className="text-justify">
              Diisi sesuai kadar yang berlaku, berdasarkan Lampiran I keputusan Direktur Jenderal Bimas Islam dan Urusan
              Haji Nomor D/291 Tahun 2000 Tanggal 15 Desember 2000.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getBszEligibleTransactions(transaksiData, year = '') {
  return normalizeTransactions(transaksiData).filter((item) => {
    if (!isZakatTransaction(item)) return false;
    if (!isSuccessfulTransaction(item)) return false;
    if (!year) return true;
    return matchesYear(item, year);
  });
}

export function getBszEligibleYears(transaksiData) {
  const years = new Set();

  getBszEligibleTransactions(transaksiData).forEach((item) => {
    const sourceDate = item?.tanggal || item?.created_at || item?.createdAt || item?.updated_at || item?.updatedAt;
    const parsed = parseDate(sourceDate);
    if (parsed) {
      years.add(String(parsed.getFullYear()));
    }
  });

  return Array.from(years).sort((left, right) => Number(right) - Number(left));
}

export function buildBszPrintHtml({ apiPayload, identity, year, transactions }) {
  const template = resolveTemplateData({ apiPayload, identity, year, transactions });
  const printDateLabel = formatLongDate(template.printDate);
  const terbilang = toSentenceCase(numberToWordsId(template.total));
  const bodyMarkup = renderToStaticMarkup(
    <BszPrintDocument template={template} printDateLabel={printDateLabel} terbilang={terbilang} />
  );

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Print BSZ</title>
  ${getPrintableStylesHtml()}
  <style>
    @page { size: auto; margin: 12mm; }
    body { margin: 0; background: #ffffff; }
  </style>
</head>
<body onload="window.print();">
  ${bodyMarkup}
</body>
</html>`;
}
