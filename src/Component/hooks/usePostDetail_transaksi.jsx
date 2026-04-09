import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDetailTransaksi, serta status loading dan error.
 */
const usePostDetailTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_detail_transaksi 
   * @param { string } nama 
   * @param { string } kode_himpun 
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDetailTransaksi = async (kode_detail_transaksi, nama, kode_himpun) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_detail_transaksi,
        nama,
        kode_himpun,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.detail_transaksi.create, data, {
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

  return { postDetailTransaksi, loading, error };
};

export default usePostDetailTransaksi;