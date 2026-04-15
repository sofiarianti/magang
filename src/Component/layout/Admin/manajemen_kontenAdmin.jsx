import React, { useState, useMemo } from 'react';
import useAPI from '../../hooks/useAPI';
import usePostInformasi from '../../hooks/usePostInformasi';
import useUpdateInformasi from '../../hooks/useUpdateInformasi';
import useDeleteInformasi from '../../hooks/useDeleteInformasi';
import endpoints from '../../Services/endpointUser';
import { addNotification } from '../../Services/notifikasi';

function InformasiManager() {
  // Fetch all informasi
  const { data: informasiData, loading, error } = useAPI(endpoints.informasi.getAll);

  // Hooks for mutations
  const { postInformasi, loading: postLoading } = usePostInformasi();
  const { putInformasi, loading: putLoading } = useUpdateInformasi();
  const { deleteInformasi, loading: deleteLoading } = useDeleteInformasi();

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    isi: '',
    kategori: 'Berita',
    foto: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  // Parse informasi data
  const informasiList = useMemo(() => {
    if (Array.isArray(informasiData)) return informasiData;
    if (Array.isArray(informasiData?.informasi_mahasiswa)) return informasiData.informasi_mahasiswa;
    if (Array.isArray(informasiData?.informasi)) return informasiData.informasi;
    if (Array.isArray(informasiData?.data)) return informasiData.data;
    return [];
  }, [informasiData]);

  const handleOpenForm = (berita = null) => {
    if (berita) {
      setEditingId(berita.id_informasi_mahasiswa || berita.id);
      setFormData({
        judul: berita.judul || '',
        deskripsi: berita.deskripsi || '',
        isi: berita.isi || '',
        kategori: berita.kategori || 'Berita',
        foto: berita.foto || '',
        tanggal: berita.tanggal ? berita.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingId(null);
      setFormData({
        judul: '',
        deskripsi: '',
        isi: '',
        kategori: 'Berita',
        foto: '',
        tanggal: new Date().toISOString().split('T')[0],
      });
    }
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.judul || !formData.deskripsi || !formData.isi) {
      addNotification({
        title: 'Data Tidak Lengkap',
        message: 'Pastikan judul, deskripsi, dan isi diisi dengan benar.'
      });
      return;
    }

    if (editingId) {
      // Update
      const result = await putInformasi(editingId, formData.judul, formData.deskripsi, formData.isi, formData.kategori, formData.foto, formData.tanggal);
      if (result) {
        addNotification({
          title: 'Sukses',
          message: 'Berita berhasil diperbarui'
        });
        handleCloseForm();
        window.location.reload();
      }
    } else {
      // Create
      const result = await postInformasi(formData.judul, formData.deskripsi, formData.isi, formData.kategori, formData.foto, formData.tanggal);
      if (result) {
        addNotification({
          title: 'Sukses',
          message: 'Berita berhasil ditambahkan'
        });
        handleCloseForm();
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const result = await deleteInformasi(id);
      if (result) {
        addNotification({
          title: 'Sukses',
          message: 'Berita berhasil dihapus'
        });
        window.location.reload();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <p className="text-blue-600">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 py-10 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Kelola Berita & Informasi</h1>
            <p className="text-slate-600">Tambah, ubah, atau hapus berita yang ditampilkan untuk donatur</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Berita
          </button>
        </div>

        {/* Berita Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Judul</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {informasiList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-600">
                      Belum ada berita. Klik tombol "Tambah Berita" untuk memulai.
                    </td>
                  </tr>
                ) : (
                  informasiList.map((berita) => (
                    <tr key={berita.id_informasi_mahasiswa || berita.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{berita.judul}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{berita.deskripsi}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {berita.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {berita.tanggal ? new Date(berita.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenForm(berita)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(berita.id_informasi_mahasiswa || berita.id)}
                            disabled={deleteLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Judul */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Judul *</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Masukkan judul berita"
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Kategori</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Berita">Berita</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Cerita Sukses">Cerita Sukses</option>
                  <option value="Insight">Insight</option>
                  <option value="Tips">Tips</option>
                </select>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Deskripsi Singkat *</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Deskripsi yang akan ditampilkan di preview (maks 150 karakter)"
                  rows="2"
                  maxLength="150"
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">{formData.deskripsi.length}/150</p>
              </div>

              {/* Isi Lengkap */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Isi Lengkap *</label>
                <textarea
                  name="isi"
                  value={formData.isi}
                  onChange={handleChange}
                  placeholder="Konten lengkap berita"
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {/* Foto URL */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">URL Foto Berita</label>
                <input
                  type="url"
                  name="foto"
                  value={formData.foto}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.foto && (
                  <div className="mt-3 rounded-lg overflow-hidden border-2 border-slate-300">
                    <img src={formData.foto} alt="Preview" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={postLoading || putLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {postLoading || putLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Berita' : 'Tambah Berita'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InformasiManager;
