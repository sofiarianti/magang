import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDetailDonasi, serta status loading dan error.
 */
const usePostDetailDonasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_detail_donasi 
   * @param { string } nama_detail_donasi 
   * @param { string } kode_jenis_donasi 
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDetailDonasi = async (kode_detail_donasi, nama_detail_donasi, kode_jenis_donasi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_detail_donasi,
        nama_detail_donasi,
        kode_jenis_donasi,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.detail_donasi.create, data, {
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

  return { postDetailDonasi, loading, error };
};

export default usePostDetailDonasi;