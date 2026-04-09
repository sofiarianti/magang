import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postZakat, serta status loading dan error.
 */
const usePostZakat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_zakat 
   * @param { string } kode_jenis_donasi 
   * @param { string } nama_zakat 
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postZakat = async (kode_zakat, nama_zakat, kode_jenis_donasi) => {
    setLoadingZakat(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_zakat,
        nama_zakat,
        kode_jenis_donasi,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.zakat.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error uploading data:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mengupload data.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postZakat, loading, error };
};

export default usePostZakat;