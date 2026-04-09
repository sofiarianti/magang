import React, { useState, useMemo } from 'react';
import useAPI from '../../hooks/useAPI';

function KoordinatorDonatur() {
  const { data, loading, error } = useAPI('/api/koordinator');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract array dari berbagai struktur response
  const koordinatorArray = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.koordinator && Array.isArray(data.koordinator)) {
      return data.koordinator;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && data.result && Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  }, [data]);

  // Filter based on search
  const filteredKoordinator = useMemo(() => {
    if (!searchTerm) return koordinatorArray;
    
    const lowerSearch = searchTerm.toLowerCase();
    return koordinatorArray.filter(item => {
      const nama = (item.nama || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      
      return nama.includes(lowerSearch) || email.includes(lowerSearch);
    });
  }, [koordinatorArray, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredKoordinator.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKoordinator = filteredKoordinator.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="w-full px-6 lg:px-16 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data koordinator...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-6 lg:px-16 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">Terjadi kesalahan: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Data Koordinator</h1>
            <p className="text-slate-600">Kelola data koordinator donasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center gap-4 p-6 border-b">
              <input
                type="text"
                placeholder="Cari koordinator..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Nama</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedKoordinator.length > 0 ? (
                    paginatedKoordinator.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="px-6 py-4">{item.nama || '-'}</td>
                        <td className="px-6 py-4">{item.email || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-slate-500">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t">
                <span className="text-sm text-slate-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KoordinatorDonatur;
