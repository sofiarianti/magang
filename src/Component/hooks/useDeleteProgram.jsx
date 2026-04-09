import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi deleteProgram, serta status loading dan error.
 */
const useDeleteProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus data program di backend.
   * @param { number } id_program - ID program yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteProgram = async (id_program) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.program || typeof endpoints.program.delete !== 'function') {
        throw new Error('endpoints.program.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.program.delete(id_program), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      }

      setError('Gagal menghapus data program.');
      return false;
    } catch (err) {
      console.error('Error deleting program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus data program.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProgram, loading, error };
};

export default useDeleteProgram;
