// src/Component/hooks/usePostHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postHimpun, serta status loading dan error.
 */
const usePostHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data himpun ke backend.
   * @param { string } kode_himpun
   * @param { string } nama_himpun
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postHimpun = async (kode_himpun, nama_himpun) => {
    setLoading(true);
    setError(null);

    try {
      const data = {
        kode_himpun: String(kode_himpun || '').trim() || '-',
        nama_himpun: String(nama_himpun || '').trim() || '-',
      };

      const response = await api.post(endpoints.himpun.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error uploading himpun:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Terjadi kesalahan saat mengupload data himpun.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postHimpun, loading, error };
};

export default usePostHimpun;