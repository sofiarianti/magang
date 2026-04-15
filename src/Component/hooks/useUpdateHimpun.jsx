// src/Component/hooks/usePutHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutHimpun adalah custom hook yang digunakan untuk memperbarui data himpun di backend.
 * @returns { Object } - Mengembalikan fungsi putHimpun, serta status loading dan error.
 */
const usePutHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data himpun di backend.
   * @param { number } id - ID himpun yang akan diperbarui.
   * @param { string } kode_himpun - Kode himpun.
   * @param { string } nama_himpun - Nama himpun.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putHimpun = async (id, kode_himpun, nama_himpun) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_himpun,
        nama_himpun,
      };

      // Defensive check
      if (!endpoints.himpun || typeof endpoints.himpun.update !== 'function') {
        throw new Error('endpoints.himpun.update is not defined');
      }

      // PUT request
      const response = await api.put(endpoints.himpun.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error updating himpun:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Terjadi kesalahan saat memperbarui himpun.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putHimpun, loading, error };
};

export default usePutHimpun;