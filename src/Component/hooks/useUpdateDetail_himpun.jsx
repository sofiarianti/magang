// src/Component/hooks/usePutDetailHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutDetailHimpun adalah custom hook yang digunakan untuk memperbarui data detail himpun di backend.
 * @returns { Object } - Mengembalikan fungsi putDetailHimpun, serta status loading dan error.
 */
const usePutDetailHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data detail himpun di backend.
   * @param { number } id - ID detail himpun yang akan diperbarui.
   * @param { string } kode_detail_himpun - Kode detail himpun.
   * @param { string } nama - Nama detail himpun.
   * @param { string } kode_himpun - Kode himpun.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putDetailHimpun = async (id, kode_detail_himpun, nama, kode_himpun) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_detail_himpun,
        nama,
        kode_himpun,
      };

      // Defensive check
      if (!endpoints.detail_himpun || typeof endpoints.detail_himpun.update !== 'function') {
        throw new Error('endpoints.detail_himpun.update is not defined');
      }

      // PUT request
      const response = await api.put(endpoints.detail_himpun.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error updating detail himpun:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Terjadi kesalahan saat memperbarui detail himpun.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putDetailHimpun, loading, error };
};

export default usePutDetailHimpun;