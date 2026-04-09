// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin'; // Pastikan path ini benar

/**
 * useDeleteDonatur adalah custom hook yang digunakan untuk menghapus data donatur dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteDonatur, serta status loading dan error.
 */
const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus donatur di backend.
   * @param { number } id - ID gambar yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.users || typeof endpoints.users.delete !== 'function') {
        throw new Error('endpoints.users.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.users.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus user.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus user.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};

export default useDeleteUser;