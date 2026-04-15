// src/Component/hooks/usePostDetailHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDetailHimpun, serta status loading dan error.
 */
const usePostDetailHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_detail_himpun 
   * @param { string } nama 
   * @param { string } kode_himpun 
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDetailHimpun = async (kode_detail_himpun, nama, kode_himpun) => {
    setLoading(true);
    setError(null);

    try {
      const data = {
        kode_detail_himpun,
        nama,
        kode_himpun,
      };

      const candidateEndpoints = [
        endpoints.detail_himpun?.create,
        '/api/detail_himpun/insert',
        '/api/detail-himpun/insert',
        '/api/detail_himpun',
        '/api/detail-himpun',
      ].filter(Boolean);

      let lastError = null;

      for (const endpoint of candidateEndpoints) {
        try {
          const response = await api.post(endpoint, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          return response.data;
        } catch (err) {
          lastError = err;

          if (err?.response?.status !== 404) {
            throw err;
          }
        }
      }

      throw lastError || new Error('Endpoint detail himpun tidak ditemukan.');
    } catch (err) {
      console.error('Error uploading data:', err);
      setError(
        err.response?.data?.error ||
        'Terjadi kesalahan saat mengupload data.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postDetailHimpun, loading, error };
};

export default usePostDetailHimpun;