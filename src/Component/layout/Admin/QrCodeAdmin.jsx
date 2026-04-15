import React, { useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import usePostQr_code from '../../hooks/usePostQr_code';
import usePutQr_code from '../../hooks/useUpdateQr_code';
import useDeleteQr_code from '../../hooks/useDeleteQr_code';
import endpoints from '../../Services/endpointUser';
import api from '../../Services/api';

const initialForm = {
  nama_qrcode: '',
  jenis_qrcode: 'QRIS',
  image_qrcode: '',
  nominal_default: '',
  is_active: '1',
  keterangan: '',
};

function QrCodeManager() {
  const { data, loading, error, refetch } = useAPI(endpoints.qrcode.getAll);
  const { postQr_code, loading: creating, error: createError } = usePostQr_code();
  const { putQr_code, loading: updating, error: updateError } = usePutQr_code();
  const { deleteQr_code, loading: deleting, error: deleteError } = useDeleteQr_code();

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const qrCodes = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.qrcode)) return data.qrcode;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  }, [data]);

  const filteredQrCodes = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return qrCodes;

    return qrCodes.filter((item) => {
      const nama = (item.nama_qrcode || '').toLowerCase();
      const jenis = (item.jenis_qrcode || '').toLowerCase();
      const image = (item.image_qrcode || '').toLowerCase();
      const keterangan = (item.keterangan || '').toLowerCase();
      return (
        nama.includes(keyword) ||
        jenis.includes(keyword) ||
        image.includes(keyword) ||
        keterangan.includes(keyword)
      );
    });
  }, [qrCodes, searchTerm]);

  const getResolvedImageUrl = (imagePath) => {
    if (!imagePath) return '';

    const rawPath = String(imagePath).trim();
    if (/^https?:\/\//i.test(rawPath)) return rawPath;

    const baseUrl = (api?.defaults?.baseURL || process.env.REACT_APP_API_URL || window.location.origin).replace(/\/$/, '');
    const origin = new URL(baseUrl, window.location.origin).origin;
    const cleanPath = rawPath.replace(/^\/+/, '');

    return `${origin}/${cleanPath}`;
  };

  const normalizeActiveValue = (value) => {
    if (value === true || value === 1 || value === '1') return '1';
    if (typeof value === 'string' && value.toLowerCase() === 'true') return '1';
    return '0';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setActionMessage('');
    setEditingId(item.id_qrcode || item.id);
    setForm({
      nama_qrcode: item.nama_qrcode || '',
      jenis_qrcode: item.jenis_qrcode || 'QRIS',
      image_qrcode: item.image_qrcode || '',
      nominal_default: item.nominal_default ? String(item.nominal_default) : '',
      is_active: normalizeActiveValue(item.is_active),
      keterangan: item.keterangan || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    if (!form.nama_qrcode.trim()) {
      setActionMessage('Nama QR code wajib diisi.');
      return;
    }

    if (!form.image_qrcode.trim()) {
      setActionMessage('Path atau URL gambar QR code wajib diisi.');
      return;
    }

    let result = null;

    if (editingId) {
      result = await putQr_code(
        editingId,
        form.nama_qrcode.trim(),
        form.jenis_qrcode.trim(),
        form.image_qrcode.trim(),
        form.nominal_default ? Number(form.nominal_default) : 0,
        form.is_active,
        form.keterangan.trim()
      );
    } else {
      result = await postQr_code(
        form.nama_qrcode.trim(),
        form.jenis_qrcode.trim(),
        form.image_qrcode.trim(),
        form.nominal_default ? Number(form.nominal_default) : 0,
        form.is_active,
        form.keterangan.trim()
      );
    }

    if (result) {
      setActionMessage(editingId ? 'QR code berhasil diperbarui.' : 'QR code berhasil ditambahkan.');
      resetForm();
      await refetch();
    }
  };

  const handleDelete = async (item) => {
    const targetId = item.id_qrcode || item.id;
    if (!targetId) return;

    const confirmed = window.confirm(`Hapus QR code "${item.nama_qrcode || '-'}"?`);
    if (!confirmed) return;

    setActionMessage('');
    setActiveDeleteId(targetId);

    const success = await deleteQr_code(targetId);
    if (success) {
      setActionMessage('QR code berhasil dihapus.');
      if (editingId === targetId) {
        resetForm();
      }
      await refetch();
    }

    setActiveDeleteId(null);
  };

  const handleToggleActive = async (item) => {
    const targetId = item.id_qrcode || item.id;
    if (!targetId) return;

    const nextActiveValue = normalizeActiveValue(item.is_active) === '1' ? '0' : '1';
    setActionMessage('');

    const result = await putQr_code(
      targetId,
      item.nama_qrcode || '',
      item.jenis_qrcode || 'QRIS',
      item.image_qrcode || '',
      item.nominal_default || 0,
      nextActiveValue,
      item.keterangan || ''
    );

    if (result) {
      setActionMessage(nextActiveValue === '1' ? 'QR code diaktifkan.' : 'QR code dinonaktifkan.');
      await refetch();
    }
  };

  const currentError = createError || updateError || deleteError;
  const formPreview = getResolvedImageUrl(form.image_qrcode);

  if (loading) {
    return (
      <div className="w-full px-6 lg:px-16 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data QR code...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">
              Pembayaran • QR Code
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">
              Manajemen QR Code
            </h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Kelola QR code pembayaran untuk QRIS, atur QR yang aktif, dan perbarui gambar dengan cepat dari dashboard admin.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs text-slate-500">Total QR Code</p>
            <p className="text-2xl font-bold text-blue-900">{qrCodes.length}</p>
          </div>
        </div>

        {(actionMessage || currentError || error) && (
          <div className={`rounded-2xl border px-5 py-4 text-sm ${
            currentError || error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}>
            {currentError || error || actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.35fr] gap-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Ubah QR Code' : 'Tambah QR Code Baru'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Isi data QR code dan simpan agar bisa dipakai pada pembayaran donatur.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama QR Code</label>
                <input
                  type="text"
                  name="nama_qrcode"
                  value={form.nama_qrcode}
                  onChange={handleChange}
                  placeholder="Contoh: QRIS Utama MPZ DT"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Jenis QR Code</label>
                  <input
                    type="text"
                    name="jenis_qrcode"
                    value={form.jenis_qrcode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="is_active"
                    value={form.is_active}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Path / URL Gambar</label>
                <input
                  type="text"
                  name="image_qrcode"
                  value={form.image_qrcode}
                  onChange={handleChange}
                  placeholder="uploads/qrcodes/nama-file.jpeg atau https://..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Gunakan path yang dikirim backend, misalnya `uploads/qrcodes/file.jpeg`.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nominal Default</label>
                <input
                  type="number"
                  min="0"
                  name="nominal_default"
                  value={form.nominal_default}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Keterangan</label>
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tambahkan catatan singkat untuk QR code ini"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Preview Gambar</p>
                {formPreview ? (
                  <img
                    src={formPreview}
                    alt="Preview QR code"
                    className="w-40 h-40 rounded-2xl border border-slate-200 bg-white object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-2xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-xs text-slate-400">
                    Preview akan tampil di sini
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {creating || updating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah QR Code'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar QR Code</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih data untuk diubah, aktifkan/nonaktifkan, atau hapus jika sudah tidak dipakai.
                </p>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari QR code..."
                className="w-full md:w-72 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">QR Code</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Jenis</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Nominal</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Keterangan</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQrCodes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        Tidak ada data QR code.
                      </td>
                    </tr>
                  ) : (
                    filteredQrCodes.map((item) => {
                      const id = item.id_qrcode || item.id;
                      const isActive = normalizeActiveValue(item.is_active) === '1';
                      const imageUrl = getResolvedImageUrl(item.image_qrcode);

                      return (
                        <tr key={id} className="hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.nama_qrcode || 'QR code'}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-[10px] text-slate-400">No Image</span>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{item.nama_qrcode || '-'}</p>
                                <p className="text-xs text-slate-500 break-all">{item.image_qrcode || '-'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{item.jenis_qrcode || '-'}</td>
                          <td className="px-6 py-4 text-slate-700">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(Number(item.nominal_default) || 0)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 max-w-xs">
                            <p className="line-clamp-2">{item.keterangan || '-'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleActive(item)}
                                disabled={updating}
                                className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                              >
                                {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                disabled={deleting && activeDeleteId === id}
                                className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                              >
                                {deleting && activeDeleteId === id ? 'Menghapus...' : 'Hapus'}
                              </button>
                            </div>
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
    </div>
  );
}

export default QrCodeManager;
