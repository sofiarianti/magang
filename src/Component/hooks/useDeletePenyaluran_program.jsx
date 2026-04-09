import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi deletePenyaluranProgram, serta status loading dan error.
 */
const useDeletePenyaluranProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus data penyaluran program di backend.
   * @param { number } id_penyaluran - ID penyaluran program yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deletePenyaluranProgram = async (id_penyaluran) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.penyaluran_program || typeof endpoints.penyaluran_program.delete !== 'function') {
        throw new Error('endpoints.penyaluran_program.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.penyaluran_program.delete(id_penyaluran), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      }

      setError('Gagal menghapus data penyaluran program.');
      return false;
    } catch (err) {
      console.error('Error deleting penyaluran program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus data penyaluran program.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePenyaluranProgram, loading, error };
};

export default useDeletePenyaluranProgram;
