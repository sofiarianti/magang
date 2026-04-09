import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postInfakUmum, serta status loading dan error.
 */
const usePostInfakUmum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_infak_umum 
   * @param { string } nama_infak_umum 
   * @param { string } kode_jenis_donasi
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postInfakUmum = async (kode_infak_umum, nama_infak_umum, kode_jenis_donasi) => {
    setLoadingInfakUmum(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_infak_umum,
        nama_infak_umum,
        kode_jenis_donasi,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.infak_umum.create, data, {
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

return { postInfakUmum, loading, error };
};

export default usePostInfakUmum;