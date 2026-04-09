import React, { useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import usePostProgram from '../../hooks/usePostProgram';
import usePutProgram from '../../hooks/useUpdateProgram';
import useDeleteProgram from '../../hooks/useDeleteProgram';
import endpointsAdmin from '../../Services/endpointAdmin';

const initialForm = {
  id_divisi: '',
  nama_program: '',
};

function PenerimaManfaatAdmin() {
  const { data, loading, error, refetch } = useAPI(endpointsAdmin.program.getAll);
  const { postProgram, loading: creating, error: createError } = usePostProgram();
  const { putProgram, loading: updating, error: updateError } = usePutProgram();
  const { deleteProgram, loading: deleting, error: deleteError } = useDeleteProgram();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const programList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.program)) return data.program;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  }, [data]);

  const filteredPrograms = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return programList;
    return programList.filter((item) =>
      [item.id_program, item.id_divisi, item.nama_program, item.divisi?.nama_divisi]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [programList, searchTerm]);

  const currentError = error || createError || updateError || deleteError;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id_program);
    setActionMessage('');
    setFormData({
      id_divisi: item.id_divisi ? String(item.id_divisi) : '',
      nama_program: item.nama_program || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    if (!formData.id_divisi || !formData.nama_program.trim()) {
      setActionMessage('ID divisi dan nama program wajib diisi.');
      return;
    }

    const result = editingId
      ? await putProgram(editingId, formData.id_divisi, formData.nama_program.trim())
      : await postProgram(formData.id_divisi, formData.nama_program.trim());

    if (result) {
      setActionMessage(editingId ? 'Program penerima manfaat berhasil diperbarui.' : 'Program penerima manfaat berhasil ditambahkan.');
      resetForm();
      await refetch();
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus program "${item.nama_program}"?`)) return;

    setActionMessage('');
    setActiveDeleteId(item.id_program);
    const result = await deleteProgram(item.id_program);

    if (result) {
      setActionMessage('Program penerima manfaat berhasil dihapus.');
      if (editingId === item.id_program) resetForm();
      await refetch();
    }

    setActiveDeleteId(null);
  };

  if (loading) {
    return <div className="w-full px-6 lg:px-16 py-12 text-slate-600">Memuat data penerima manfaat...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Penyaluran</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Penerima Manfaat</h1>
        </div>

        {(actionMessage || currentError) && (
          <div className={`rounded-2xl border px-5 py-4 text-sm ${
            currentError ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}>
            {currentError || actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.45fr] gap-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Ubah Program' : 'Tambah Program'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="number" min="1" name="id_divisi" value={formData.id_divisi} onChange={handleChange} placeholder="ID Divisi" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <input type="text" name="nama_program" value={formData.nama_program} onChange={handleChange} placeholder="Nama Program" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={creating || updating} className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                  {creating || updating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Program'}
                </button>
                <button type="button" onClick={resetForm} className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  Reset Form
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Daftar Program</h2>
              <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari program..." className="w-full md:w-72 rounded-xl border border-slate-300 px-4 py-3 text-sm" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">ID Program</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Divisi</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Nama Program</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrograms.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">Belum ada program penerima manfaat.</td></tr>
                  ) : filteredPrograms.map((item) => (
                    <tr key={item.id_program} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 text-slate-700">{item.id_program}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-700">{item.id_divisi || '-'}</p>
                          <p className="text-xs text-slate-500">{item.divisi?.nama_divisi || 'Divisi belum terhubung'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{item.nama_program || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => handleEdit(item)} className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">Edit</button>
                          <button type="button" onClick={() => handleDelete(item)} disabled={deleting && activeDeleteId === item.id_program} className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">
                            {deleting && activeDeleteId === item.id_program ? 'Menghapus...' : 'Hapus'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PenerimaManfaatAdmin;
