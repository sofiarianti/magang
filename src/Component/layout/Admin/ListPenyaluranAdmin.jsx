import React, { useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import usePostPenyaluranProgram from '../../hooks/usePostPenyaluran_program';
import useUpdatePenyaluranProgram from '../../hooks/useUpdatePenyaluran_program';
import useDeletePenyaluranProgram from '../../hooks/useDeletePenyaluran_program';
import endpointsAdmin from '../../Services/endpointAdmin';

const initialForm = {
  id_peyaluran: '',
  id_transaksi: '',
  id_program: '',
  kode_user: '',
  tanggal_penyaluran: '',
  nominal_penyaluran: '',
  status_penyaluran: 'pending',
  catatan: '',
};

function ListPenyaluranAdmin() {
  const { data, loading, error, refetch } = useAPI(endpointsAdmin.penyaluran_program.getAll);
  const { data: programData } = useAPI(endpointsAdmin.program.getAll);
  const { postPenyaluranProgram, loading: creating, error: createError } = usePostPenyaluranProgram();
  const { putPenyaluranProgram, loading: updating, error: updateError } = useUpdatePenyaluranProgram();
  const { deletePenyaluranProgram, loading: deleting, error: deleteError } = useDeletePenyaluranProgram();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const penyaluranList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.penyaluran_program)) return data.penyaluran_program;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  }, [data]);

  const programList = useMemo(() => {
    if (Array.isArray(programData)) return programData;
    if (Array.isArray(programData?.program)) return programData.program;
    if (Array.isArray(programData?.data)) return programData.data;
    if (Array.isArray(programData?.result)) return programData.result;
    return [];
  }, [programData]);

  const programMap = useMemo(
    () => new Map(programList.map((item) => [String(item.id_program), item.nama_program || 'Program'])),
    [programList]
  );

  const filteredList = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return penyaluranList;

    return penyaluranList.filter((item) => {
      const programName = programMap.get(String(item.id_program)) || '';
      return [
        item.id_peyaluran,
        item.id_penyaluran,
        item.id_transaksi,
        item.id_program,
        item.kode_user,
        item.status_penyaluran,
        item.catatan,
        programName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [penyaluranList, programMap, searchTerm]);

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
    const targetId = item.id_peyaluran || item.id_penyaluran || item.id;
    setEditingId(targetId);
    setActionMessage('');
    setFormData({
      id_peyaluran: item.id_peyaluran || item.id_penyaluran || '',
      id_transaksi: item.id_transaksi || '',
      id_program: item.id_program ? String(item.id_program) : '',
      kode_user: item.kode_user || '',
      tanggal_penyaluran: item.tanggal_penyaluran ? String(item.tanggal_penyaluran).split('T')[0] : '',
      nominal_penyaluran: item.nominal_penyaluran ? String(item.nominal_penyaluran) : '',
      status_penyaluran: item.status_penyaluran || 'pending',
      catatan: item.catatan || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    if (!formData.id_transaksi || !formData.id_program || !formData.kode_user) {
      setActionMessage('ID transaksi, program, dan kode user wajib diisi.');
      return;
    }

    const result = editingId
      ? await putPenyaluranProgram(
          editingId,
          formData.id_peyaluran || editingId,
          formData.id_transaksi,
          formData.id_program,
          formData.kode_user,
          formData.tanggal_penyaluran,
          formData.nominal_penyaluran,
          formData.status_penyaluran,
          formData.catatan
        )
      : await postPenyaluranProgram(
          formData.id_peyaluran,
          formData.id_transaksi,
          formData.id_program,
          formData.kode_user,
          formData.tanggal_penyaluran,
          formData.nominal_penyaluran,
          formData.status_penyaluran,
          formData.catatan
        );

    if (result) {
      setActionMessage(editingId ? 'Data penyaluran berhasil diperbarui.' : 'Data penyaluran berhasil ditambahkan.');
      resetForm();
      await refetch();
    }
  };

  const handleDelete = async (item) => {
    const targetId = item.id_peyaluran || item.id_penyaluran || item.id;
    if (!targetId || !window.confirm('Hapus data penyaluran ini?')) return;

    setActionMessage('');
    setActiveDeleteId(targetId);
    const result = await deletePenyaluranProgram(targetId);

    if (result) {
      setActionMessage('Data penyaluran berhasil dihapus.');
      if (editingId === targetId) resetForm();
      await refetch();
    }

    setActiveDeleteId(null);
  };

  if (loading) {
    return <div className="w-full px-6 lg:px-16 py-12 text-slate-600">Memuat data penyaluran...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Penyaluran</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">List Penyaluran</h1>
        </div>

        {(actionMessage || currentError) && (
          <div className={`rounded-2xl border px-5 py-4 text-sm ${
            currentError ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}>
            {currentError || actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.45fr] gap-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Ubah Penyaluran' : 'Tambah Penyaluran'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" name="id_peyaluran" value={formData.id_peyaluran} onChange={handleChange} placeholder="ID Penyaluran" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <input type="text" name="id_transaksi" value={formData.id_transaksi} onChange={handleChange} placeholder="ID Transaksi" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <select name="id_program" value={formData.id_program} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm">
                <option value="">Pilih Program</option>
                {programList.map((item) => (
                  <option key={item.id_program} value={item.id_program}>{item.nama_program}</option>
                ))}
              </select>
              <input type="text" name="kode_user" value={formData.kode_user} onChange={handleChange} placeholder="Kode User" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <input type="date" name="tanggal_penyaluran" value={formData.tanggal_penyaluran} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <input type="number" min="0" name="nominal_penyaluran" value={formData.nominal_penyaluran} onChange={handleChange} placeholder="Nominal Penyaluran" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              <select name="status_penyaluran" value={formData.status_penyaluran} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm">
                <option value="pending">Pending</option>
                <option value="diproses">Diproses</option>
                <option value="tersalurkan">Tersalurkan</option>
              </select>
              <textarea name="catatan" value={formData.catatan} onChange={handleChange} rows="4" placeholder="Catatan" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm resize-none" />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={creating || updating} className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                  {creating || updating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Penyaluran'}
                </button>
                <button type="button" onClick={resetForm} className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  Reset Form
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Daftar Penyaluran</h2>
              <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari penyaluran..." className="w-full md:w-72 rounded-xl border border-slate-300 px-4 py-3 text-sm" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Transaksi</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Program</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Nominal</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">Belum ada data penyaluran.</td></tr>
                  ) : filteredList.map((item) => {
                    const rowId = item.id_peyaluran || item.id_penyaluran || item.id;
                    return (
                      <tr key={rowId} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 text-slate-700">{rowId}</td>
                        <td className="px-6 py-4 text-slate-700">{item.id_transaksi || '-'}</td>
                        <td className="px-6 py-4 text-slate-700">{programMap.get(String(item.id_program)) || item.id_program || '-'}</td>
                        <td className="px-6 py-4 text-slate-700">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(item.nominal_penyaluran) || 0)}</td>
                        <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.status_penyaluran || '-'}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => handleEdit(item)} className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">Edit</button>
                            <button type="button" onClick={() => handleDelete(item)} disabled={deleting && activeDeleteId === rowId} className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">
                              {deleting && activeDeleteId === rowId ? 'Menghapus...' : 'Hapus'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ListPenyaluranAdmin;
