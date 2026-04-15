import React, { useState, useMemo } from 'react';
import { UserIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useAPI from '../../hooks/useAPI';
import { exportRowsToExcel, exportRowsToPdf, formatDateForFilter, isWithinDateRange } from './exportUtilsAdmin';

function ListDonatur() {
  const { data: donaturData, loading, error } = useAPI('/api/donatur');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const itemsPerPage = 10;

  const donaturArray = useMemo(() => {
    if (Array.isArray(donaturData)) {
      return donaturData;
    } else if (donaturData && donaturData.donatur && Array.isArray(donaturData.donatur)) {
      return donaturData.donatur;
    } else if (donaturData && donaturData.data && Array.isArray(donaturData.data)) {
      return donaturData.data;
    } else if (donaturData && donaturData.result && Array.isArray(donaturData.result)) {
      return donaturData.result;
    }
    return [];
  }, [donaturData]);

  // Filter berdasarkan search term
  const filteredDonatur = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return donaturArray.filter(item => {
      const nama = (item.nama || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const noHp = (item.no_hp || item.nomor_hp || item.phone || '').toLowerCase();
      const kodeDonatur = (item.kode_donatur || item.kode || '').toLowerCase();
      const nik = (item.nik || item.no_identitas || '').toLowerCase();
      const agama = (item.agama || '').toLowerCase();
      const pekerjaan = (item.pekerjaan || item.profesi || '').toLowerCase();
      const tanggalDaftar =
        item.created_at ||
        item.tanggal_daftar ||
        item.tgl_daftar ||
        item.tanggal ||
        item.tgl;

      const matchesSearch =
        !searchTerm ||
        nama.includes(lowerSearch) || 
        email.includes(lowerSearch) || 
        noHp.includes(lowerSearch) ||
        kodeDonatur.includes(lowerSearch) ||
        nik.includes(lowerSearch) ||
        agama.includes(lowerSearch) ||
        pekerjaan.includes(lowerSearch);
      
      return matchesSearch && isWithinDateRange(tanggalDaftar, startDate, endDate);
    });
  }, [donaturArray, searchTerm, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredDonatur.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonatur = filteredDonatur.slice(startIndex, startIndex + itemsPerPage);

  // Format tanggal
  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const getExportMeta = () => {
    const queryPart = sanitizeFilenamePart(searchTerm);
    const startPart = startDate || 'awal';
    const endPart = endDate || 'akhir';
    const hasDateRange = Boolean(startDate || endDate);

    const filenameParts = ['laporan-donatur'];
    const titleParts = ['Laporan Donatur'];

    if (queryPart) {
      filenameParts.push(queryPart);
      titleParts.push(`Pencarian: ${searchTerm.trim()}`);
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
      ['Kode Donatur', 'NIK', 'Nama', 'Tanggal Daftar', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Pekerjaan', 'Email', 'No HP', 'Alamat'],
      filteredDonatur.map((item) => [
        item.kode_donatur || item.kode || '-',
        item.nik || item.no_identitas || '-',
        item.nama || '-',
        formatDateForFilter(item.created_at || item.tanggal_daftar || item.tgl_daftar || item.tanggal || item.tgl) || '-',
        formatTanggal(item.tanggal_lahir || item.tgl_lahir || '-'),
        item.jenis_kelamin || item.gender || '-',
        item.agama || '-',
        item.pekerjaan || item.profesi || '-',
        item.email || '-',
        item.no_hp || item.nomor_hp || item.phone || '-',
        item.alamat || '-',
      ])
    );
  };

  const handleExportPdf = () => {
    const exportMeta = getExportMeta();

    exportRowsToPdf(
      exportMeta.title,
      ['Kode Donatur', 'Nama', 'Tanggal Daftar', 'Email', 'No HP', 'Pekerjaan'],
      filteredDonatur.map((item) => [
        item.kode_donatur || item.kode || '-',
        item.nama || '-',
        formatDateForFilter(item.created_at || item.tanggal_daftar || item.tgl_daftar || item.tanggal || item.tgl) || '-',
        item.email || '-',
        item.no_hp || item.nomor_hp || item.phone || '-',
        item.pekerjaan || item.profesi || '-',
      ])
    );
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

  if (loading) {
    return (
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data donatur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">Terjadi kesalahan: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Daftar Donatur</h1>
            <p className="text-slate-600">Kelola dan pantau seluruh data donatur yang terdaftar</p>
          </div>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Toolbar Donatur</p>
                <p className="mt-1 text-sm text-slate-500">
                  Cari donatur, atur periode pendaftaran, lalu export data yang sedang tampil.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
                {filteredDonatur.length} donatur ditemukan
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
                      onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                      className="w-full min-w-[150px] bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>

                  <div className="px-2 text-sm font-semibold text-slate-500">s/d</div>

                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-slate-400">📅</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                      className="w-full min-w-[150px] bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                  <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Keyword nama, email, nomor HP, NIK, agama, atau pekerjaan..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-end">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
                  <p className="text-xs text-slate-500">Total Donatur</p>
                  <p className="text-lg font-bold text-slate-800">{filteredDonatur.length}</p>
                </div>

                <div className="relative">
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
          </div>
        </section>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Kode Donatur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">NIK</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Tanggal lahir</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Jenis Kelamin</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Agama</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Pekerjaan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Nomor HP</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Alamat</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedDonatur.length > 0 ? (
                  paginatedDonatur.map((donatur, index) => (
                    <tr key={donatur.id || index} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          {donatur.kode_donatur || donatur.kode || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.nik || donatur.no_identitas || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                              {(donatur.nama || 'D').charAt(0).toUpperCase()}
                            </div>
                          </div>
                          {donatur.nama || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatTanggal(donatur.tanggal_lahir || donatur.tgl_lahir || '-')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.jenis_kelamin || donatur.gender || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.agama || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.pekerjaan || donatur.profesi || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.email || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donatur.no_hp || donatur.nomor_hp || donatur.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {donatur.alamat || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200" title="Edit">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200" title="Hapus">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <UserIcon className="h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-slate-600 font-medium">Tidak ada data donatur</p>
                        <p className="text-sm text-slate-500">Mulai dengan menambahkan donatur baru</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                Menampilkan <span className="font-semibold">{startIndex + 1}</span> sampai <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredDonatur.length)}</span> dari <span className="font-semibold">{filteredDonatur.length}</span> donatur
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-900 text-white'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListDonatur;
