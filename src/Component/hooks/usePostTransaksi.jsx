import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDonatur, serta status loading dan error.
 */
const usePostTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * Status transaksi dibuat "pending" saat awal. Jika pembayaran dikonfirmasi admin, status diperbarui menjadi "success".
   * @param { string } kode_transaksi 
   * @param { string } kode_donatur 
   * @param { string } kode_jenis_donasi 
   * @param { string } kode_detail_donasi 
   * @param { string } kode_user
   * @param { string } kode_himpun
   * @param { string } kode_detail_transaksi
   * @param { string } jumlah_donasi
   * @param { string } [status='pending'] - Status awal transaksi
   * @param { string } catatan
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postTransaksi = async (kode_transaksi, kode_donatur, kode_jenis_donasi, kode_detail_donasi, kode_user, kode_himpun, kode_detail_transaksi, jumlah_donasi, status = 'pending', catatan) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_transaksi,
        kode_donatur,
        kode_jenis_donasi,
        kode_detail_donasi,
        kode_user,
        kode_himpun,
        kode_detail_transaksi,
        jumlah_donasi,
        status,
        catatan,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.transaksi.create, data, {
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

  return { postTransaksi, loading, error };
};

export default usePostTransaksi;